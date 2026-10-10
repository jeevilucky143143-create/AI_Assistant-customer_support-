import React from 'react';
import { Layers, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { DecomposedConcern } from '../../types';
import { Badge } from '../ui/Badge';

interface DecomposedConcernsProps {
  concerns: DecomposedConcern[];
  selectedIndex: number;
  onSelectConcern: (index: number) => void;
}

export const DecomposedConcerns: React.FC<DecomposedConcernsProps> = ({
  concerns,
  selectedIndex,
  onSelectConcern,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          Decomposed Issues ({concerns.length})
        </h3>
        <span className="text-[11px] text-white/40 font-mono">
          Click an issue to view policy clauses
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {concerns.map((concern, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <div
              key={concern.concern_id}
              onClick={() => onSelectConcern(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'bg-[#1b1b26] border-purple-500/50 shadow-md shadow-purple-950/20'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/12'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/60">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-white truncate">
                    {concern.category}
                  </span>
                </div>
                <Badge status={concern.status} size="sm" />
              </div>

              <p className="text-xs text-white/70 leading-relaxed mb-2 font-sans">
                {concern.summary}
              </p>

              {concern.rationale && (
                <div className="text-[11px] text-white/50 bg-black/30 p-2 rounded-lg border border-white/[0.04] mb-2 font-mono leading-snug">
                  <strong className="text-white/40">Policy Logic:</strong> {concern.rationale}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-white/40 pt-1.5 border-t border-white/[0.04]">
                <span className="flex items-center gap-1 text-purple-300/80">
                  <FileText className="w-3 h-3" />
                  {concern.citations.length} clause citation(s) attached
                </span>
                <span className="flex items-center gap-0.5 text-white/50 hover:text-white">
                  Inspect <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
