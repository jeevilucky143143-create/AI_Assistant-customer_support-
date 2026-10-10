import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  RotateCcw,
  BookMarked,
  Edit3,
} from 'lucide-react';
import { GroundedDraft, TonePreset } from '../../types';
import { Button } from '../ui/Button';

interface DraftEditorProps {
  draft: GroundedDraft;
  editedBody: string;
  onChangeBody: (newBody: string) => void;
  currentTone: TonePreset;
  onSelectTone: (tone: TonePreset) => void;
  onApprove: () => void;
  onReject: () => void;
  onEscalate: () => void;
  isSubmitting?: boolean;
}

export const DraftEditor: React.FC<DraftEditorProps> = ({
  draft,
  editedBody,
  onChangeBody,
  currentTone,
  onSelectTone,
  onApprove,
  onReject,
  onEscalate,
  isSubmitting = false,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#121218] border border-white/[0.08] shadow-sm flex flex-col gap-4">
      {/* Top Bar: Tone Switcher & Subject */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Agent Response Editor
          </h3>
        </div>

        {/* Tone Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 border border-white/10">
          {(['empathetic', 'concise', 'formal'] as TonePreset[]).map((t) => {
            const isActive = t === currentTone;
            return (
              <button
                key={t}
                onClick={() => onSelectTone(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Line */}
      <div className="text-xs font-mono text-white/70 bg-black/40 px-3.5 py-2 rounded-xl border border-white/[0.06]">
        <span className="text-white/40 uppercase text-[10px] block mb-0.5">Subject:</span>
        <span className="text-white font-medium">{draft.subject}</span>
      </div>

      {/* Editable Response Text Area */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-white/50 font-mono uppercase tracking-wider flex items-center justify-between">
          <span>Draft Body (Human Editable)</span>
          <span className="text-purple-300/80">Tone: {currentTone}</span>
        </label>
        <textarea
          rows={11}
          value={editedBody}
          onChange={(e) => onChangeBody(e.target.value)}
          className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white/95 leading-relaxed font-sans focus:outline-none focus:border-purple-500/50 resize-y shadow-inner"
          placeholder="Draft response content..."
        />
      </div>

      {/* Anchored Clauses Tags */}
      <div>
        <span className="text-[10px] font-mono uppercase text-white/40 block mb-1.5 flex items-center gap-1.5">
          <BookMarked className="w-3 h-3 text-amber-400" />
          Anchored Policy Clauses ({draft.anchored_clause_ids.length})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {draft.anchored_clause_ids.map((clauseId, i) => (
            <span
              key={i}
              className="text-[11px] font-mono bg-white/[0.04] text-white/80 px-2.5 py-1 rounded-md border border-white/[0.08]"
            >
              {clauseId}
            </span>
          ))}
        </div>
      </div>

      {/* Human Action Bar */}
      <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            icon={<XCircle className="w-3.5 h-3.5 text-rose-400" />}
          >
            Reject / Reset
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onEscalate}
            icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          >
            Escalate to Lead
          </Button>
        </div>

        <Button
          variant="success"
          size="md"
          onClick={onApprove}
          disabled={isSubmitting}
          icon={<Send className="w-3.5 h-3.5" />}
          className="px-6 font-semibold shadow-lg shadow-emerald-950/40"
        >
          {isSubmitting ? 'Verifying...' : 'Approve & Dispatch'}
        </Button>
      </div>
    </div>
  );
};
