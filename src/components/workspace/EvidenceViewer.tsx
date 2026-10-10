import React from 'react';
import { BookOpen, FileText, CheckCircle2, AlertCircle, Percent } from 'lucide-react';
import { DecomposedConcern } from '../../types';
import { Badge } from '../ui/Badge';

interface EvidenceViewerProps {
  concern?: DecomposedConcern;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ concern }) => {
  if (!concern) {
    return (
      <div className="p-6 rounded-2xl bg-[#121218] border border-white/[0.08] text-center text-xs text-white/40">
        Select a decomposed issue to view its grounded policy evidence.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#121218] border border-white/[0.08] shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Policy Evidence & Clause Lineage
          </h3>
        </div>
        <Badge status={concern.status} size="sm" />
      </div>

      <div className="text-xs text-white/70">
        Active focus: <strong className="text-white">{concern.category}</strong>
      </div>

      {concern.citations.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">No Matching Policy Clauses Found</span>
            <p className="text-white/70 leading-relaxed">
              Active enterprise manuals do not provide specific guidance for this inquiry. Flagged for human supervisor review.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {concern.citations.map((cit) => (
            <div
              key={cit.citation_id}
              className="p-3.5 rounded-xl bg-[#171720] border border-white/[0.08] space-y-2.5"
            >
              {/* Header with Clause and Match Score */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-amber-300">
                  {cit.clause_id}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <Percent className="w-2.5 h-2.5" />
                  {(cit.confidence_score * 100).toFixed(0)}% RRF match (Benchmark Fixture)
                </span>
              </div>

              {/* Document metadata */}
              <div className="text-[11px] text-white/50 space-y-0.5 font-mono">
                <div>Doc: <span className="text-white/80">{cit.document_title}</span></div>
                <div>Section: <span className="text-white/70">{cit.section_name}</span> {cit.page_number && `(Page ${cit.page_number})`}</div>
              </div>

              {/* Exact Quote */}
              <div className="p-3 rounded-lg bg-black/50 border-l-2 border-amber-400 text-xs text-white/85 font-mono leading-relaxed">
                "{cit.excerpt}"
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-white/[0.04] text-[10px] text-white/35 font-mono">
        * Policy clauses and similarity rankings represent illustrative enterprise benchmark fixtures for PS-40 evaluation.
      </div>
    </div>
  );
};
