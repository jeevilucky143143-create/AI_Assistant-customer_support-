// Issue coverage states explicitly defined in PRD & API_SPEC
export type IssueCoverageStatus =
  | 'covered'
  | 'partially_covered'
  | 'uncovered'
  | 'prohibited'
  | 'conflict'
  | 'needs_human_review';

export type TonePreset = 'empathetic' | 'concise' | 'formal';
export type BackendTone = 'professional' | 'empathetic' | 'concise';

export type GuardrailVerdict = 'PASSED' | 'FLAGGED';

export interface Citation {
  citation_id: string;
  document_title: string;
  clause_id: string;
  section_name: string;
  page_number?: number;
  excerpt: string;
  confidence_score: number;
}

export interface DecomposedConcern {
  concern_id: string;
  category: string;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: IssueCoverageStatus;
  rationale?: string;
  citations: Citation[];
}

export interface UnsupportedCommitment {
  claim: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface GuardrailReport {
  verdict: GuardrailVerdict;
  unsupported_commitments_detected: UnsupportedCommitment[];
  policy_conflicts_detected: string[];
  policy_gaps_detected: string[];
}

export interface GroundedDraft {
  tone: TonePreset;
  subject: string;
  body: string;
  anchored_clause_ids: string[];
  draft_id?: string;
}

export interface ComplaintTicket {
  complaint_id: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  channel: 'email' | 'chat' | 'ticket' | 'phone_transcript';
  received_at: string;
  raw_text: string;
  overall_sentiment: 'negative' | 'frustrated' | 'neutral' | 'urgent';
  overall_severity: 'low' | 'medium' | 'high' | 'critical';
  review_status: 'PENDING_REVIEW' | 'APPROVED' | 'SIMULATED_DISPATCH' | 'ESCALATED' | 'REJECTED';
}

export interface ComplaintAnalysis {
  complaint_id: string;
  analysis_timestamp: string;
  overall_sentiment: string;
  overall_severity: 'low' | 'medium' | 'high' | 'critical';
  decomposed_concerns: DecomposedConcern[];
  guardrail_report: GuardrailReport;
  grounded_draft: GroundedDraft;
  human_review_required: boolean;
  review_reasons: string[];
  draft_id?: string;
  draft_variants?: Record<string, { text: string; citations: string[] }>;
}

export interface PolicyDocument {
  policy_id: string;
  title: string;
  version: string;
  category: string;
  updated_at: string;
  total_chunks: number;
  status: 'active' | 'archived' | 'draft';
  is_demo_fixture?: boolean;
}

export interface DispatchPayload {
  complaint_id: string;
  draft_id?: string;
  agent_id: string;
  agent_name: string;
  action: 'APPROVE' | 'REJECT' | 'ESCALATE';
  final_text: string;
  notes?: string;
  override_reasons?: string[];
}

export interface DispatchResponse {
  dispatch_id: string;
  complaint_id: string;
  draft_id?: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'SIMULATED_DISPATCH' | 'ESCALATED' | 'REJECTED';
  dispatched_at: string;
  audit_log_id: string;
  delivery_channel?: string;
  review_id?: string;
}

export interface ComplaintReviewHistory {
  review_id: string;
  complaint_id: string;
  draft_id?: string;
  decision: 'approved' | 'rejected' | 'escalated';
  final_response_text?: string;
  reason?: string;
  reviewed_at: string;
}

export interface ComplaintHistory {
  complaint_id: string;
  drafts: Array<{
    draft_id: string;
    text: string;
    citations: string[];
  }>;
  reviews: ComplaintReviewHistory[];
}

// Backend API wire schemas
export interface BackendEvidenceItem {
  chunk_id: string;
  document_id: string;
  source_filename?: string;
  section?: string | null;
  page_number?: number | null;
  content: string;
}

export interface BackendComplaintIssue {
  issue_id: string;
  issue_text: string;
  requested_resolution?: string | null;
  assessment_status: IssueCoverageStatus;
  missing_facts: string[];
  evidence: BackendEvidenceItem[];
}

export interface BackendDraftResponse {
  draft_id: string;
  text: string;
  citations: string[];
}

export interface BackendValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BackendComplaintResponse {
  complaint_id: string;
  status: string;
  issues: BackendComplaintIssue[];
  draft: BackendDraftResponse;
  validation: BackendValidationReport;
  draft_variants?: Record<string, { text: string; citations: string[] }> | null;
}

export interface BackendPolicyDocumentResponse {
  document_id: string;
  source_filename: string;
  document_type: string;
  version_label?: string | null;
  effective_from?: string | null;
  effective_to?: string | null;
  status: string;
  created_at: string;
}
