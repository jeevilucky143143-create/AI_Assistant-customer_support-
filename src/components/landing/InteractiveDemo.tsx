import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MOCK_TICKETS, MOCK_ANALYSES } from '../../data/mockData';
import { DecomposedConcern } from '../../types';
import { useInView } from '../../hooks/useInView';

interface InteractiveDemoProps {
  onLaunchStudioWithTicket: (ticketId: string) => void;
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({ onLaunchStudioWithTicket }) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [selectedTicketId, setSelectedTicketId] = useState<string>('CMP-2026-9042');
  const [selectedConcernIndex, setSelectedConcernIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const activeTicket =
    MOCK_TICKETS.find((t) => t.complaint_id === selectedTicketId) || MOCK_TICKETS[0];
  const activeAnalysis = MOCK_ANALYSES[selectedTicketId]?.empathetic;
  const activeConcern: DecomposedConcern | undefined =
    activeAnalysis?.decomposed_concerns[selectedConcernIndex];

  const handleSelectTicket = (id: string) => {
    if (id === selectedTicketId) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedTicketId(id);
      setSelectedConcernIndex(0);
      setIsTransitioning(false);
    }, 140);
  };

  return (
    <section id="demo" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-transparent">
      {/* Editorial Section Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08] mb-10 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] block mb-2">
            INTERACTIVE PREVIEW
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            See policy grounding in action.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-md font-sans font-normal leading-relaxed">
          Select an enterprise ticket scenario to inspect atomic decomposition, retrieved handbook citations, and commitment guardrails in real time.
        </p>
      </div>

      {/* Visual Flow Indicator between stages */}
      <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#a1a1aa] mb-6 px-1">
        <span className="flex items-center gap-1.5 text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Raw Inbound Statement
        </span>
        <span className="text-white/30">→</span>
        <span className="flex items-center gap-1.5 text-white/80">
          <Layers className="w-3 h-3 text-white/60" />
          Atomic Decomposition
        </span>
        <span className="text-white/30">→</span>
        <span className="flex items-center gap-1.5 text-amber-300">
          <FileText className="w-3 h-3" />
          RRF Policy Evidence
        </span>
        <span className="text-white/30">→</span>
        <span className="flex items-center gap-1.5 text-rose-300">
          <ShieldAlert className="w-3 h-3" />
          Guardrail Verification
        </span>
      </div>

      {/* Ticket Selector Pills with Smooth Transitions */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {MOCK_TICKETS.map((t) => {
          const isSelected = t.complaint_id === selectedTicketId;
          return (
            <button
              key={t.complaint_id}
              onClick={() => handleSelectTicket(t.complaint_id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'liquid-glass bg-white/10 text-white border-white/40 shadow-md scale-[1.02]'
                  : 'bg-white/[0.03] text-[#a1a1aa] hover:text-white border-white/[0.08] hover:border-white/20'
              }`}
            >
              <span className="font-mono opacity-50 mr-1.5">{t.complaint_id}:</span>
              <span>{t.customer_name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split Console Card with Cinematic Hairline Borders & Transition Fade */}
      <div
        className={`rounded-2xl bg-[#0E1322]/85 backdrop-blur-md border border-white/[0.08] overflow-hidden p-6 sm:p-8 transition-opacity duration-200 ${
          isTransitioning ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Raw Ticket & Decomposed Concerns (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Raw Ticket Statement Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-black/45 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono text-[10px] text-[#a1a1aa] uppercase tracking-wider">
                  Raw Inbound Statement
                </span>
                <span className="text-[10px] text-white/70 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase">
                  {activeTicket.channel}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-sans font-light italic">
                "{activeTicket.raw_text}"
              </p>
            </div>

            {/* Decomposed Sub-Concerns */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono text-[10px] text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-white/60" />
                  Decomposed Issues ({activeAnalysis?.decomposed_concerns.length})
                </span>
                <span className="text-[10px] text-white/40 font-mono">Select to inspect</span>
              </div>

              <div className="space-y-2">
                {activeAnalysis?.decomposed_concerns.map((concern, idx) => {
                  const isActive = idx === selectedConcernIndex;
                  return (
                    <div
                      key={concern.concern_id}
                      onClick={() => setSelectedConcernIndex(idx)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-white/[0.08] border-white/25 shadow-sm translate-x-1'
                          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-medium text-white truncate">
                          {concern.category}
                        </span>
                        <Badge status={concern.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-[#a1a1aa] line-clamp-1 font-light">
                        {concern.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Evidence Citation & Guardrail Report (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6 p-6 rounded-xl bg-black/40 border border-white/[0.06]">
            {/* Cited Clause Panel */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06] text-xs">
                <span className="font-mono text-[10px] text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  Retrieved Policy Evidence
                </span>
                {activeConcern?.citations[0] && (
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Match Confidence: {(activeConcern.citations[0].confidence_score * 100).toFixed(0)}% (Benchmark Fixture)
                  </span>
                )}
              </div>

              {activeConcern?.citations[0] ? (
                <div className="p-4 rounded-xl bg-[#121727] border border-white/[0.08] space-y-2.5 transition-all duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium text-amber-200">
                      {activeConcern.citations[0].clause_id}
                    </span>
                    <span className="text-white/40 text-[10px] font-mono">
                      Page {activeConcern.citations[0].page_number}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/50 font-mono">
                    {activeConcern.citations[0].document_title} • {activeConcern.citations[0].section_name}
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border-l-2 border-amber-400 text-xs text-white/85 font-mono leading-relaxed">
                    "{activeConcern.citations[0].excerpt}"
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-white/40 font-mono">
                  No matching policy clause indexed. Issue tagged for human review.
                </div>
              )}
            </div>

            {/* Guardrail Safety Status */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs transition-all duration-200 ${
                activeAnalysis?.guardrail_report.verdict === 'FLAGGED'
                  ? 'bg-rose-950/25 border-rose-500/30 text-rose-200'
                  : 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200'
              }`}
            >
              {activeAnalysis?.guardrail_report.verdict === 'FLAGGED' ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Guardrail Verdict: {activeAnalysis?.guardrail_report.verdict}</span>
                  {activeAnalysis?.guardrail_report.verdict === 'FLAGGED' && (
                    <span className="text-rose-300 font-semibold">Commitment Blocked</span>
                  )}
                </div>
                {activeAnalysis?.guardrail_report.verdict === 'FLAGGED' ? (
                  <p className="text-[11px] text-white/80 font-light">
                    {activeAnalysis?.guardrail_report.unsupported_commitments_detected[0]?.reason}
                  </p>
                ) : (
                  <p className="text-[11px] text-white/80 font-light">
                    Zero unauthorized commitments detected. All draft remedies strictly ground in policy.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom action to open in full review studio */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/[0.06]">
              <span className="text-[10px] text-white/40 font-mono">
                Mandatory human review prior to customer dispatch.
              </span>
              <button
                onClick={() => onLaunchStudioWithTicket(selectedTicketId)}
                className="liquid-glass inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white hover:scale-[1.02] transition-all duration-200 cursor-pointer self-start sm:self-auto"
              >
                <span>Review in Agent Studio</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
