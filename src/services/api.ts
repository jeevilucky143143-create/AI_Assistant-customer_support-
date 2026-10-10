import {
  ComplaintTicket,
  ComplaintAnalysis,
  PolicyDocument,
  DispatchPayload,
  DispatchResponse,
  TonePreset,
  DecomposedConcern,
  Citation,
  UnsupportedCommitment,
  ComplaintHistory,
  BackendComplaintResponse,
  BackendPolicyDocumentResponse,
  AgentProfile,
  ComplaintAuditLog,
} from '../types';
import { MOCK_TICKETS, MOCK_ANALYSES, MOCK_POLICIES } from '../data/mockData';

// Centralized API configuration supporting both http://localhost:8000 and http://localhost:8000/api/v1
const RAW_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
const API_BASE_URL = RAW_URL.endsWith('/api/v1') ? RAW_URL : `${RAW_URL}/api/v1`;
const ROOT_URL = RAW_URL.endsWith('/api/v1') ? RAW_URL.replace(/\/api\/v1$/, '') : RAW_URL;

export interface BackendStatus {
  isLive: boolean;
  message: string;
  timestamp: string;
  databaseStatus?: string;
  providersStatus?: string;
}

// Global Clerk token provider function
let authTokenGetter: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  authTokenGetter = getter;
}

/**
 * Builds HTTP headers including Bearer token if Clerk session is available.
 */
async function getAuthHeaders(includeContentType: boolean = true): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (authTokenGetter) {
    try {
      const token = await authTokenGetter();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Could not retrieve Clerk auth token:', err);
    }
  }
  return headers;
}

/**
 * Transforms backend ComplaintResponse into the UI ComplaintAnalysis structure.
 */
function mapBackendToComplaintAnalysis(
  data: BackendComplaintResponse,
  rawTicketText: string,
  sentiment: string = 'neutral',
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  requestedTone: TonePreset = 'empathetic'
): ComplaintAnalysis {
  const backendToneKey = requestedTone === 'formal' ? 'professional' : requestedTone;
  const activeVariant = data.draft_variants?.[backendToneKey];
  const draftText = activeVariant?.text || data.draft?.text || '';
  const draftCitations = activeVariant?.citations || data.draft?.citations || [];
  const draftId = data.draft?.draft_id || '';

  // Extract subject if draft starts with Subject:
  let subject = `Response regarding your inquiry [Ref: ${data.complaint_id.slice(0, 8)}]`;
  let body = draftText;
  if (draftText.startsWith('Subject:')) {
    const lines = draftText.split('\n');
    subject = lines[0].replace(/^Subject:\s*/, '').trim();
    body = lines.slice(1).join('\n').trim();
  }

  // Map issues and evidence citations
  const decomposed_concerns: DecomposedConcern[] = (data.issues || []).map((iss, idx) => ({
    concern_id: iss.issue_id || `ISSUE-${idx + 1}`,
    category: iss.requested_resolution || (iss.issue_text.length > 45 ? `${iss.issue_text.slice(0, 42)}...` : iss.issue_text),
    summary: iss.issue_text,
    severity: (iss.assessment_status === 'prohibited' || iss.assessment_status === 'conflict') ? 'high' : 'medium',
    status: iss.assessment_status,
    rationale: iss.missing_facts && iss.missing_facts.length > 0 ? `Required information: ${iss.missing_facts.join(', ')}` : undefined,
    citations: (iss.evidence || []).map((e: any) => ({
      citation_id: e.chunk_id,
      document_title: e.source_filename || 'Enterprise Policy',
      clause_id: e.section ? e.section : `REF-${e.chunk_id.slice(0, 8)}`,
      section_name: e.section || 'General Terms',
      page_number: e.page_number || undefined,
      excerpt: e.content,
      confidence_score: 0.95,
    })),
  }));

  // Map deterministic validation results to guardrail report
  const isFlagged = !data.validation.valid || (data.validation.errors && data.validation.errors.length > 0);
  const unsupported_commitments: UnsupportedCommitment[] = (data.validation.errors || []).map(err => ({
    claim: err,
    reason: 'Detected claim not grounded in policy or violates safety constraints',
    severity: 'HIGH',
  }));

  const conflicts = (data.issues || [])
    .filter(i => i.assessment_status === 'conflict')
    .map(i => `Policy conflict detected: ${i.issue_text}`);

  const gaps = (data.issues || [])
    .filter(i => i.assessment_status === 'uncovered')
    .map(i => `No policy coverage for: ${i.issue_text}`);

  return {
    complaint_id: data.complaint_id,
    analysis_timestamp: new Date().toISOString(),
    overall_sentiment: sentiment,
    overall_severity: isFlagged || conflicts.length > 0 ? 'high' : severity,
    decomposed_concerns,
    guardrail_report: {
      verdict: isFlagged ? 'FLAGGED' : 'PASSED',
      unsupported_commitments_detected: unsupported_commitments,
      policy_conflicts_detected: conflicts,
      policy_gaps_detected: gaps,
    },
    grounded_draft: {
      tone: requestedTone,
      subject,
      body,
      anchored_clause_ids: draftCitations,
      draft_id: draftId,
    },
    human_review_required: data.status === 'needs_human_review' || isFlagged,
    review_reasons: data.validation.warnings || [],
    draft_id: draftId,
    draft_variants: data.draft_variants || undefined,
  };
}

export const apiService = {
  // Check health of backend process and external dependencies
  async checkHealth(): Promise<BackendStatus> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        return {
          isLive: true,
          message: `Connected to FastAPI (${data.status || 'ok'})`,
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      // Try root /health endpoint as fallback
      try {
        const rootRes = await fetch(`${ROOT_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (rootRes.ok) {
          const rootData = await rootRes.json();
          return {
            isLive: true,
            message: `Connected to FastAPI (${rootData.status || 'ok'})`,
            timestamp: new Date().toISOString(),
          };
        }
      } catch {
        // Backend offline
      }
    }
    return {
      isLive: false,
      message: 'Local Interactive Demo Engine (Backend Offline Fallback)',
      timestamp: new Date().toISOString(),
    };
  },

  // Get active agent profile for authenticated Clerk user
  async getCurrentAgent(): Promise<AgentProfile | null> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/agents/me`, {
        method: 'GET',
        headers,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Could not retrieve agent profile:', err);
    }
    return null;
  },

  // List all registered agents (for assignment & supervisor admin)
  async listAgents(): Promise<AgentProfile[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/agents`, {
        method: 'GET',
        headers,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Could not list agents:', err);
    }
    return [];
  },

  // Update agent role (Supervisor only)
  async updateAgentRole(agentId: string, role: 'support_agent' | 'supervisor'): Promise<AgentProfile> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/${agentId}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update agent role');
    }
    return await res.json();
  },

  // Update agent status (activate or deactivate - Supervisor only)
  async updateAgentStatus(agentId: string, isActive: boolean): Promise<AgentProfile> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/${agentId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ is_active: isActive }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update agent status');
    }
    return await res.json();
  },

  // Assign or reassign complaint to a support agent
  async assignComplaint(complaintId: string, targetAgentId: string): Promise<BackendComplaintResponse> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/assign`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ assigned_to_agent_id: targetAgentId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to assign complaint');
    }
    return await res.json();
  },

  // Retrieve immutable audit trail for a complaint
  async getComplaintAuditLogs(complaintId: string): Promise<ComplaintAuditLog[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/audit`, {
        method: 'GET',
        headers,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Could not fetch complaint audit logs:', err);
    }
    return [];
  },

  // Get active complaint tickets (from local fixture queue or database)
  async getTickets(): Promise<ComplaintTicket[]> {
    return MOCK_TICKETS;
  },

  // Get enterprise policy manuals from backend database
  async getPolicies(): Promise<PolicyDocument[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/policies`, { headers });
      if (res.ok) {
        const data: BackendPolicyDocumentResponse[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((p) => ({
            policy_id: p.document_id,
            title: p.source_filename,
            version: p.version_label || 'v1.0',
            category: p.document_type || 'General Policy',
            updated_at: p.created_at || new Date().toISOString(),
            total_chunks: 0,
            status: p.status === 'completed' ? 'active' : 'draft',
            is_demo_fixture: false,
          }));
        }
      }
    } catch (err) {
      console.warn('Backend policies unreachable, falling back to cached policies:', err);
    }
    return MOCK_POLICIES;
  },

  // Ingest a new policy document into the backend
  async uploadPolicy(file: File, versionLabel?: string): Promise<{ document_id: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (versionLabel) {
      formData.append('version_label', versionLabel);
    }
    const headers = await getAuthHeaders(false); // multipart boundary set automatically
    const res = await fetch(`${API_BASE_URL}/policies?sync=true`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.message || 'Failed to upload and ingest policy document');
    }
    return await res.json();
  },

  // Analyze complaint with live RAG decomposition, citations, guardrail check
  async analyzeComplaint(
    ticket: ComplaintTicket,
    tone: TonePreset = 'empathetic'
  ): Promise<{ analysis: ComplaintAnalysis; isLive: boolean }> {
    try {
      const backendTone = tone === 'formal' ? 'professional' : tone;
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          complaint_text: ticket.raw_text,
          response_tone: backendTone,
          generate_tone_variants: true,
        }),
      });

      if (res.ok) {
        const data: BackendComplaintResponse = await res.json();
        const analysis = mapBackendToComplaintAnalysis(
          data,
          ticket.raw_text,
          ticket.overall_sentiment,
          ticket.overall_severity,
          tone
        );
        return { analysis, isLive: true };
      }
    } catch (err) {
      console.warn('Live backend analysis failed, falling back to benchmark simulation:', err);
    }

    // Graceful offline fallback using benchmark fixtures
    const ticketAnalyses = MOCK_ANALYSES[ticket.complaint_id];
    if (ticketAnalyses && ticketAnalyses[tone]) {
      return { analysis: ticketAnalyses[tone], isLive: false };
    }

    return { analysis: MOCK_ANALYSES['CMP-2026-9042'][tone], isLive: false };
  },

  // Submit and process a new customer complaint in real time
  async submitComplaint(
    complaintText: string,
    tone: TonePreset = 'empathetic'
  ): Promise<{ ticket: ComplaintTicket; analysis: ComplaintAnalysis; isLive: boolean }> {
    const backendTone = tone === 'formal' ? 'professional' : tone;
    let isLive = false;
    let data: BackendComplaintResponse | null = null;

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          complaint_text: complaintText,
          response_tone: backendTone,
          generate_tone_variants: true,
        }),
      });

      if (res.ok) {
        data = await res.json();
        isLive = true;
      }
    } catch (err) {
      console.warn('Backend unavailable for complaint intake:', err);
    }

    const complaintId = data?.complaint_id || `CMP-${Date.now().toString().slice(-4)}`;
    const newTicket: ComplaintTicket = {
      complaint_id: complaintId,
      customer_id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: 'Customer Inbound',
      customer_email: 'inbound.customer@example.com',
      channel: 'ticket',
      received_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      raw_text: complaintText,
      overall_sentiment: 'frustrated',
      overall_severity: data?.status === 'needs_human_review' ? 'high' : 'medium',
      review_status: 'PENDING_REVIEW',
      created_by_agent_name: data?.created_by_agent_name || null,
      assigned_to_agent_id: data?.assigned_to_agent_id || null,
      assigned_to_agent_name: data?.assigned_to_agent_name || null,
    };

    if (isLive && data) {
      const analysis = mapBackendToComplaintAnalysis(
        data,
        complaintText,
        newTicket.overall_sentiment,
        newTicket.overall_severity,
        tone
      );
      return { ticket: newTicket, analysis, isLive: true };
    }

    // Fallback in-memory analysis
    const fallbackAnalysis = MOCK_ANALYSES['CMP-2026-9042'][tone];
    const customizedAnalysis: ComplaintAnalysis = {
      ...fallbackAnalysis,
      complaint_id: complaintId,
      analysis_timestamp: new Date().toISOString(),
    };
    return { ticket: newTicket, analysis: customizedAnalysis, isLive: false };
  },

  // Record human reviewer decision (approve, escalate, or reject)
  async dispatchComplaint(
    payload: DispatchPayload
  ): Promise<{ response: DispatchResponse; isLive: boolean }> {
    try {
      const backendDecision: 'approved' | 'rejected' | 'escalated' =
        payload.action === 'APPROVE'
          ? 'approved'
          : payload.action === 'ESCALATE'
          ? 'escalated'
          : 'rejected';

      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/complaints/${payload.complaint_id}/review`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          draft_id: payload.draft_id || '',
          decision: backendDecision,
          final_response_text: payload.final_text,
          reason: payload.notes || '',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const actionStatus =
          data.decision === 'approved'
            ? 'APPROVED'
            : data.decision === 'escalated'
            ? 'ESCALATED'
            : 'REJECTED';

        return {
          response: {
            dispatch_id: data.review_id || `REV-${Date.now()}`,
            complaint_id: data.complaint_id,
            draft_id: data.draft_id,
            status: actionStatus,
            dispatched_at: data.reviewed_at || new Date().toISOString(),
            audit_log_id: `AUDIT-LOG-${data.review_id?.slice(0, 8) || Date.now()}`,
            delivery_channel: 'Internal Compliance Ledger (Never Sent to Customer)',
            review_id: data.review_id,
          },
          isLive: true,
        };
      }
    } catch (err) {
      console.warn('Backend review record failed, using simulated response:', err);
    }

    // Demo dispatch response with explicit simulation flag
    const actionStatus =
      payload.action === 'APPROVE'
        ? 'APPROVED'
        : payload.action === 'ESCALATE'
        ? 'ESCALATED'
        : 'REJECTED';

    const mockResponse: DispatchResponse = {
      dispatch_id: `REV-${Math.floor(1000 + Math.random() * 9000)}-DEMO`,
      complaint_id: payload.complaint_id,
      draft_id: payload.draft_id,
      status: actionStatus,
      dispatched_at: new Date().toISOString(),
      audit_log_id: `AUDIT-RECORD-${Date.now()}`,
      delivery_channel: 'Internal Compliance Ledger (Never Sent to Customer)',
    };

    return { response: mockResponse, isLive: false };
  },

  // Fetch full audit and review history for a complaint
  async getComplaintHistory(complaintId: string): Promise<ComplaintHistory | null> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/history`, {
        headers,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Could not fetch complaint history:', err);
    }
    return null;
  },

  // Retrieve an individual complaint details by ID
  async getComplaint(complaintId: string): Promise<BackendComplaintResponse | null> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
        headers,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Could not retrieve complaint:', err);
    }
    return null;
  },
};
