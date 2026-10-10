import React from 'react';
import { useInView } from '../../hooks/useInView';

export const ProcessSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  const steps = [
    {
      step: '01',
      title: 'Decompose Complaint',
      category: 'PARSING',
      desc: 'Raw customer messages from email, ticketing, or chat are split into atomic, traceable grievances so no sub-issue is missed.',
      delay: 'delay-100',
    },
    {
      step: '02',
      title: 'Retrieve Exact Clauses',
      category: 'RRF SEARCH',
      desc: 'Dense embeddings and full-text keyword indexing are combined through Reciprocal Rank Fusion (k=60) to pinpoint active clauses.',
      delay: 'delay-200',
    },
    {
      step: '03',
      title: 'Scan Commitments',
      category: 'GUARDRAILS',
      desc: 'Deterministic safety rules scan candidate drafts to catch and flag ungrounded financial promises or prohibited goodwill claims.',
      delay: 'delay-300',
    },
    {
      step: '04',
      title: 'Human Agent Approval',
      category: 'SIGN-OFF',
      desc: 'Support agents inspect evidence citations, adjust tone, edit responses, and formally certify dispatch with an immutable audit trail.',
      delay: 'delay-400',
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-transparent">
      {/* Header with subtle hairline divider and entrance animation */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08] mb-12 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] block mb-2">
            METHODOLOGY
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            The verification pipeline.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-md font-sans font-normal leading-relaxed">
          Four disciplined stages that transform raw customer frustration into compliant, verifiable resolution without hallucinated risk.
        </p>
      </div>

      {/* Animated Process Container with Connector Line */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0E1322]/80 backdrop-blur-md">
        {/* Animated Connector Line across top of steps */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.05] overflow-hidden z-10">
          <div
            className={`h-full bg-gradient-to-r from-emerald-400 via-white to-amber-300 transition-all duration-1000 ease-out ${
              isInView ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>

        {/* Compact numbered process steps with subtle dividers and staggered entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className={`editorial-card p-6 sm:p-8 flex flex-col justify-between hover:bg-white/[0.02] transition-all duration-700 cursor-default ${
                s.delay
              } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-8">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-2xl text-white/90 group-hover:text-white transition-colors"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {s.step}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/50 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                    {s.category}
                  </span>
                </div>
                <h3
                  className="text-xl text-white font-normal mb-3"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-xs text-[#a1a1aa] font-sans font-light leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>Phase {idx + 1} of 4</span>
                <span className="text-emerald-400/80">Deterministic</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
