import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Send, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'APPROVE' | 'ESCALATE' | 'REJECT';
  complaintId: string;
  customerName: string;
  onConfirm: (notes: string) => void;
  isSubmitting?: boolean;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  actionType,
  complaintId,
  customerName,
  onConfirm,
  isSubmitting = false,
}) => {
  const [notes, setNotes] = useState('');
  const [confirmedCheck, setConfirmedCheck] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#14141c] border border-white/15 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              actionType === 'APPROVE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {actionType === 'APPROVE' ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              {actionType === 'APPROVE'
                ? 'Authorize Response Dispatch'
                : actionType === 'ESCALATE'
                ? 'Escalate to Tier-2 Supervisor'
                : 'Reject & Reset Draft'}
            </h3>
            <span className="text-xs text-white/50 font-mono">
              Ticket: {complaintId} • {customerName}
            </span>
          </div>
        </div>

        {/* Compliance Checklist */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] mb-4 space-y-2 text-xs text-white/80">
          <div className="font-semibold text-white/90 uppercase tracking-wider text-[10px] mb-1">
            Mandatory Human Review Checklist
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Response verified against retrieved policy handbooks.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Unsupported commitment scanner checked.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Customer PII and tone appropriateness approved.</span>
          </div>
        </div>

        {/* External Channel Notice */}
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 font-mono mb-4">
          External CRM Dispatch: Demo Simulation Mode (Logs audit event; live email gateway unconfigured).
        </div>

        {/* Agent Notes */}
        <div className="mb-4">
          <label className="text-xs font-medium text-white/70 block mb-1.5">
            Agent Audit Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add operational notes or reason for approval / escalation..."
            className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Checkbox verification */}
        <label className="flex items-center gap-2.5 mb-6 text-xs text-white/80 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmedCheck}
            onChange={(e) => setConfirmedCheck(e.target.checked)}
            className="rounded border-white/20 bg-black/40 text-purple-600 focus:ring-0 cursor-pointer"
          />
          <span>I formally certify this communication as an authorized support agent.</span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'APPROVE' ? 'success' : 'secondary'}
            size="md"
            disabled={!confirmedCheck || isSubmitting}
            onClick={() => onConfirm(notes)}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            {isSubmitting ? 'Recording Audit...' : 'Confirm & Log Audit'}
          </Button>
        </div>
      </div>
    </div>
  );
};
