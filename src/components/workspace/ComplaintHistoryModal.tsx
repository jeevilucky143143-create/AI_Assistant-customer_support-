import React, { useState, useEffect } from 'react';
import { History, X, CheckCircle2, AlertTriangle, XCircle, Clock, BookMarked, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { ComplaintHistory } from '../../types';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && complaintId) {
      setIsLoading(true);
      apiService.getComplaintHistory(complaintId).then((data) => {
        setHistory(data);
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

        <div className="flex items-center gap-3 mb-5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Compliance & Review Audit Trail</h3>
            <span className="text-xs text-white/50 font-mono">
              Complaint ID: {complaintId} • Immutable Audit Log
            </span>
          </div>
        </div>

        {/* Safety Invariant Notice */}
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs mb-4 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            Non-negotiable safety invariant: Human approval records support decisions into the compliance audit ledger. Customer communications are never automatically sent.
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-white/50">
              Loading complaint audit history...
            </div>
          ) : !history || (history.reviews.length === 0 && history.drafts.length === 0) ? (
            <div className="py-12 text-center text-xs text-white/40">
              No previous review decisions or drafts recorded yet for this complaint.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Review Decisions Section */}
              {history.reviews && history.reviews.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-white/50 mb-2">
                    Human Review Decisions ({history.reviews.length})
                  </h4>
                  <div className="space-y-2">
                    {history.reviews.map((rev) => {
                      const isApproved = rev.decision === 'approved';
                      const isEscalated = rev.decision === 'escalated';
                      return (
                        <div
                          key={rev.review_id}
                          className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
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
                </div>
              )}

              {/* Response Drafts Section */}
              {history.drafts && history.drafts.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-white/50 mb-2">
                    Generated Response Drafts ({history.drafts.length})
                  </h4>
                  <div className="space-y-2">
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
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-white/[0.08] mt-4 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
