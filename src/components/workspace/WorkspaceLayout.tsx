import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Menu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Terminal,
} from 'lucide-react';
import {
  ComplaintTicket,
  ComplaintAnalysis,
  PolicyDocument,
  TonePreset,
  DispatchResponse,
} from '../../types';
import { TicketSidebar } from './TicketSidebar';
import { ComplaintHeader } from './ComplaintHeader';
import { DecomposedConcerns } from './DecomposedConcerns';
import { EvidenceViewer } from './EvidenceViewer';
import { GuardrailBanner } from './GuardrailBanner';
import { DraftEditor } from './DraftEditor';
import { DispatchModal } from './DispatchModal';
import { Button } from '../ui/Button';
import { apiService, BackendStatus } from '../../services/api';

interface WorkspaceLayoutProps {
  onBackToLanding: () => void;
  initialTicketId?: string;
  backendStatus: BackendStatus;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  onBackToLanding,
  initialTicketId = 'CMP-2026-9042',
  backendStatus,
}) => {
  const [tickets, setTickets] = useState<ComplaintTicket[]>([]);
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(initialTicketId);
  const [selectedConcernIndex, setSelectedConcernIndex] = useState<number>(0);
  const [currentTone, setCurrentTone] = useState<TonePreset>('empathetic');
  const [analysis, setAnalysis] = useState<ComplaintAnalysis | null>(null);
  const [editedBody, setEditedBody] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Dispatch modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<'APPROVE' | 'ESCALATE' | 'REJECT'>('APPROVE');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<DispatchResponse | null>(null);

  // Load initial tickets and policies
  useEffect(() => {
    async function loadInitial() {
      const loadedTickets = await apiService.getTickets();
      const loadedPolicies = await apiService.getPolicies();
      setTickets(loadedTickets);
      setPolicies(loadedPolicies);
    }
    loadInitial();
  }, []);

  // Whenever ticket or tone changes, run analysis
  useEffect(() => {
    const currentTicket = tickets.find((t) => t.complaint_id === selectedTicketId);
    if (!currentTicket) return;

    setIsLoadingAnalysis(true);
    apiService.analyzeComplaint(currentTicket, currentTone).then(({ analysis }) => {
      setAnalysis(analysis);
      setEditedBody(analysis.grounded_draft.body);
      setSelectedConcernIndex(0);
      setIsLoadingAnalysis(false);
    });
  }, [selectedTicketId, currentTone, tickets]);

  const activeTicket =
    tickets.find((t) => t.complaint_id === selectedTicketId) || tickets[0];
  const activeConcern = analysis?.decomposed_concerns[selectedConcernIndex];

  // Action handlers
  const handleApprove = () => {
    setModalAction('APPROVE');
    setIsModalOpen(true);
  };

  const handleEscalate = () => {
    setModalAction('ESCALATE');
    setIsModalOpen(true);
  };

  const handleReject = () => {
    if (analysis) {
      setEditedBody(analysis.grounded_draft.body);
    }
  };

  const handleConfirmDispatch = async (notes: string) => {
    if (!activeTicket || !analysis) return;
    setIsSubmitting(true);

    const { response } = await apiService.dispatchComplaint({
      complaint_id: activeTicket.complaint_id,
      agent_id: 'AGENT-042',
      agent_name: 'Marcus Aurelius',
      action: modalAction,
      final_text: editedBody,
      notes: notes,
    });

    setIsSubmitting(false);
    setIsModalOpen(false);
    setDispatchResult(response);

    // Update ticket review status in list
    setTickets((prev) =>
      prev.map((t) =>
        t.complaint_id === activeTicket.complaint_id
          ? { ...t, review_status: response.status }
          : t
      )
    );
  };

  return (
    <div className="flex h-screen bg-[#0a0a0d] overflow-hidden text-[#f1f1f5]">
      {/* Sidebar */}
      <TicketSidebar
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        onSelectTicket={(id) => {
          setSelectedTicketId(id);
          setDispatchResult(null);
        }}
        policies={policies}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Workspace Top Bar */}
        <header className="h-14 px-4 sm:px-6 border-b border-white/[0.08] bg-[#101015]/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLanding}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Overview</span>
            </Button>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm text-white">
                Agent Review Console
              </span>
              <span className="text-[10px] font-mono text-white/40 hidden md:inline">
                • Agent Marcus Aurelius (Tier-1)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                backendStatus.isLive
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus.isLive ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="hidden sm:inline">
                {backendStatus.isLive ? 'Live FastAPI Backend' : 'Demo Fallback Engine'}
              </span>
              <span className="sm:hidden">{backendStatus.isLive ? 'Live' : 'Demo'}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Dispatch Result Confirmation Toast/Banner */}
            {dispatchResult && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-semibold block">
                      Response Formally {dispatchResult.status}!
                    </span>
                    <span className="text-white/60 font-mono text-[11px] block">
                      Dispatch Ref: {dispatchResult.dispatch_id} • Audit Log:{' '}
                      {dispatchResult.audit_log_id}
                    </span>
                    <span className="text-amber-300/80 font-mono text-[10px] block mt-0.5">
                      (Simulated CRM Channel • Audit record stored in compliance database)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDispatchResult(null)}
                  className="text-white/40 hover:text-white px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Active Complaint Header */}
            {activeTicket && <ComplaintHeader ticket={activeTicket} />}

            {/* Guardrail Safety Banner */}
            {analysis && <GuardrailBanner report={analysis.guardrail_report} />}

            {/* Main Split Console Grid */}
            {isLoadingAnalysis ? (
              <div className="p-16 text-center text-xs text-white/50 space-y-2">
                <RotateCw className="w-6 h-6 animate-spin mx-auto text-purple-400" />
                <p>Retrieving policy chunks & running hybrid RRF search...</p>
              </div>
            ) : analysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Decomposed Issues + Draft Editor (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <DecomposedConcerns
                    concerns={analysis.decomposed_concerns}
                    selectedIndex={selectedConcernIndex}
                    onSelectConcern={(idx) => setSelectedConcernIndex(idx)}
                  />

                  <DraftEditor
                    draft={analysis.grounded_draft}
                    editedBody={editedBody}
                    onChangeBody={setEditedBody}
                    currentTone={currentTone}
                    onSelectTone={setCurrentTone}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onEscalate={handleEscalate}
                    isSubmitting={isSubmitting}
                  />
                </div>

                {/* Right: Evidence Viewer (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <EvidenceViewer concern={activeConcern} />
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>

      {/* Human Review Authorization Modal */}
      {activeTicket && (
        <DispatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          actionType={modalAction}
          complaintId={activeTicket.complaint_id}
          customerName={activeTicket.customer_name}
          onConfirm={handleConfirmDispatch}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
