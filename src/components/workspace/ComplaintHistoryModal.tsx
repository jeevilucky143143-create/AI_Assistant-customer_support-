import React, { useState, useEffect } from 'react';
import {
  History,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  BookMarked,
  ShieldCheck,
  User,
  ArrowRightLeft,
  FileEdit,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ComplaintHistory, ComplaintAuditLog } from '../../types';
import { apiService } from '../../services/api';

interface ComplaintHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId: string;
}

export const ComplaintHistoryModal: React.FC<ComplaintHistoryModalProps> = ({
  isOpen,
  onClose,
  complaintId,
}) => {
  const [history, setHistory] = useState<ComplaintHistory | null>(null);
  const [auditLogs, setAuditLogs] = useState<ComplaintAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'reviews' | 'drafts'>('audit');

  useEffect(() => {
    if (isOpen && complaintId) {
      setIsLoading(true);
      Promise.all([
        apiService.getComplaintHistory(complaintId),
        apiService.getComplaintAuditLogs(complaintId),
      ]).then(([histData, logData]) => {
        setHistory(histData);
        setAuditLogs(logData || []);
        setIsLoading(false);
      });
    }
  }, [isOpen, complaintId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#14141c] border border-white/15 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Compliance & Agent Accountability</h3>
            <span className="text-xs text-white/50 font-mono">
              Complaint ID: {complaintId} • Immutable Audit Ledger
            </span>
          </div>
        </div>

        {/* Safety Invariant Notice */}
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs mb-3 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            Actor attribution derived exclusively from verified Clerk tokens. Approval records internal decisions; customer responses are never sent automatically.
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Review Decisions ({history?.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Draft Versions ({history?.drafts?.length || 0})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-white/50">
              Loading complaint audit history...
            </div>
          ) : activeTab === 'audit' ? (
            auditLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-white/40">
                No audit events recorded yet for this complaint.
              </div>
            ) : (
              <div className="space-y-2.5">
                {auditLogs.map((log) => {
                  const isCreated = log.event_type === 'complaint_created';
                  const isReassigned = log.event_type === 'reassigned' || log.event_type === 'assigned';
                  const isEdited = log.event_type === 'draft_edited';
                  const isApproved = log.event_type === 'review_approved';
                  const isEscalated = log.event_type === 'case_escalated';

                  return (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-mono uppercase text-[10px] font-semibold border ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : isEscalated
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : isCreated
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : isReassigned
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : 'bg-white/10 text-white/80 border-white/20'
                            }`}
                          >
                            {log.event_type.replace(/_/g, ' ')}
                          </span>
                          <span className="font-semibold text-white/90">
                            {log.actor_name || 'System'}
                          </span>
                        </div>
                        <span className="text-white/40 font-mono text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>

                      {log.details && (
                        <div className="text-[11px] font-mono text-white/60 bg-black/30 p-2 rounded-lg border border-white/5">
                          {Object.entries(log.details).map(([key, val]) => (
                            <div key={key} className="flex gap-2">
                              <span className="text-white/40">{key}:</span>
                              <span className="text-white/80">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : activeTab === 'reviews' ? (
            !history || history.reviews.length === 0 ? (
              <div className="py-12 text-center text-xs text-white/40">
                No review decisions recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.reviews.map((rev) => {
                  const isApproved = rev.decision === 'approved';
                  const isEscalated = rev.decision === 'escalated';
                  return (
                    <div
                      key={rev.review_id}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-mono uppercase text-[10px] font-semibold border ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : isEscalated
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {rev.decision}
                          </span>
                          {rev.reviewer_name && (
                            <span className="font-semibold text-white/90">
                              by {rev.reviewer_name}
                            </span>
                          )}
                        </div>
                        <span className="text-white/40 font-mono text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(rev.reviewed_at).toLocaleString()}
                        </span>
                      </div>

                      {rev.reason && (
                        <div className="text-white/70 font-mono text-[11px]">
                          <span className="text-white/40">Reason / Notes:</span> {rev.reason}
                        </div>
                      )}

                      {rev.final_response_text && (
                        <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-[11px] text-white/80 font-sans">
                          <span className="text-white/40 font-mono block text-[10px] mb-1">
                            Signed Response Text:
                          </span>
                          "{rev.final_response_text}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            !history || history.drafts.length === 0 ? (
              <div className="py-12 text-center text-xs text-white/40">
                No draft versions generated yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.drafts.map((d, idx) => (
                  <div
                    key={d.draft_id || idx}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-white/40 font-mono text-[10px]">
                      <span>Draft ID: {d.draft_id?.slice(0, 8) || idx + 1}</span>
                      <span>{d.citations.length} citation(s) attached</span>
                    </div>
                    <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                      "{d.text}"
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-white/[0.08] mt-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
