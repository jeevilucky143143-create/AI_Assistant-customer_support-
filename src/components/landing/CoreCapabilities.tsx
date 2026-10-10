import React from 'react';
import { Split, BookOpen, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

export const CoreCapabilities: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="capabilities" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-transparent">
      {/* Editorial Section Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08] mb-12 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] block mb-2">
            CORE PRINCIPLES
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Grounded resolution, <br className="hidden sm:inline" />
            <span className="italic font-light text-[#a1a1aa]">by design.</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-md font-sans font-normal leading-relaxed">
          Generic LLMs risk ungrounded promises and hallucinated refunds. PolicyPulse enforces strict clause-level verification at every stage of the complaint resolution lifecycle.
        </p>
      </div>

      {/* Asymmetrical Editorial Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Card 1: Multi-Concern Decomposition (Spans 7 cols) */}
        <div
          className={`editorial-card md:col-span-7 p-7 sm:p-9 rounded-2xl bg-[#0E1322]/80 backdrop-blur-md border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all duration-700 delay-100 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs text-white/40 font-mono mb-6">
              <span>01 / DECOMPOSITION</span>
              <Split className="w-4 h-4 text-white/60" />
            </div>
            <h3
              className="text-2xl text-white font-normal mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Multi-Concern Decomposition
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light leading-relaxed max-w-xl mb-6">
              Inbound tickets frequently bundle multiple grievances into a single emotional statement. Our decomposition engine separates independent issues—such as delivery delays, transit damage, and courier conduct—so no customer concern is neglected.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/45 border border-white/[0.06] text-xs font-mono text-white/70">
            <div className="flex items-center justify-between text-[11px] text-white/40 pb-2 mb-2 border-b border-white/[0.05]">
              <span>Sample Grievance Pipeline</span>
              <span className="text-emerald-400">Atomic Issues Isolated</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Issue A: Damaged Espresso Machine</span>
                <span className="text-emerald-400/90 text-[10px]">COVERED (Clause 3.2)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Issue B: 3-Day Fulfillment Delay</span>
                <span className="text-amber-400/90 text-[10px]">PARTIALLY COVERED (Clause 2.1)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Issue C: $100 Inconvenience Demand</span>
                <span className="text-rose-400/90 text-[10px]">PROHIBITED (Clause 7.1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Policy Grounding & Citations (Spans 5 cols) */}
        <div
          className={`editorial-card md:col-span-5 p-7 sm:p-9 rounded-2xl bg-[#0E1322]/80 backdrop-blur-md border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all duration-700 delay-200 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs text-white/40 font-mono mb-6">
              <span>02 / EVIDENCE</span>
              <BookOpen className="w-4 h-4 text-white/60" />
            </div>
            <h3
              className="text-2xl text-white font-normal mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Clause-Level Policy Grounding
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light leading-relaxed mb-6">
              Combines dense semantic vectors with full-text keyword indexing through Reciprocal Rank Fusion ($k=60$). Every drafted sentence is anchored directly to active handbook clauses and section numbers.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/45 border border-white/[0.06] text-[11px] font-mono text-white/60 space-y-1">
            <div className="text-white/40 text-[10px]">CITATION ANCHOR:</div>
            <div className="text-amber-300 font-semibold">Clause 3.2 (Transit Damage) • Page 4</div>
            <div className="text-white/40 text-[10px]">Enterprise Return & Refund Policy v2.4</div>
          </div>
        </div>

        {/* Card 3: Unsupported Commitment Blocker (Spans 5 cols) */}
        <div
          className={`editorial-card md:col-span-5 p-7 sm:p-9 rounded-2xl bg-[#0E1322]/80 backdrop-blur-md border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs text-white/40 font-mono mb-6">
              <span>03 / GUARDRAIL</span>
              <ShieldAlert className="w-4 h-4 text-rose-400/80" />
            </div>
            <h3
              className="text-2xl text-white font-normal mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Unsupported-Commitment Blocker
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light leading-relaxed mb-6">
              Proactively intercepts unauthorized promises, cash compensation, or warranty waivers. Any proposed remedy that lacks supporting policy authorization is halted before dispatch.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-[11px] font-mono text-rose-300/90 space-y-1">
            <div className="font-semibold text-rose-200">VERDICT: FLAGGED</div>
            <div className="text-white/60 text-[10px]">Unauthorized goodwill demand blocked by Clause 7.1 limits.</div>
          </div>
        </div>

        {/* Card 4: Human-in-the-Loop Studio (Spans 7 cols) */}
        <div
          className={`editorial-card md:col-span-7 p-7 sm:p-9 rounded-2xl bg-[#0E1322]/80 backdrop-blur-md border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all duration-700 delay-400 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs text-white/40 font-mono mb-6">
              <span>04 / HUMAN SIGN-OFF</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400/80" />
            </div>
            <h3
              className="text-2xl text-white font-normal mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Human-in-the-Loop Agent Studio
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light leading-relaxed max-w-xl mb-6">
              No communication is ever transmitted automatically to a customer. Support agents inspect retrieved evidence, calibrate tone (Empathetic, Concise, Formal), edit responses inline, and provide certified authorization with an auditable compliance trail.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/45 border border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/70">
            <span>Mandatory Human Certification</span>
            <span className="text-emerald-400">100% Agent Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
};
