import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  onLaunchStudio: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLaunchStudio }) => {
  return (
    <footer className="w-full bg-[#070b14] border-t border-white/[0.08] pt-20 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Restrained Cinematic CTA Banner */}
        <div className="p-8 sm:p-14 rounded-3xl bg-[#0E1322]/80 backdrop-blur-md border border-white/[0.08] text-center mb-16 relative overflow-hidden">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] block mb-3">
            ENTERPRISE DEPLOYMENT READY
          </span>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4 max-w-2xl mx-auto font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Experience policy-grounded resolution.
          </h2>

          <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-lg mx-auto mb-8 font-sans font-normal leading-relaxed">
            Decompose compound customer complaints, cite active policy clauses, and eliminate unauthorized commitments with human verification.
          </p>

          <button
            onClick={onLaunchStudio}
            className="liquid-glass inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-medium text-white hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer shadow-lg"
          >
            <span>Launch Agent Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Minimalist Editorial Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/[0.06] text-xs font-sans text-white/45">
          <div className="flex items-center gap-3">
            <span
              className="text-white/90 text-base font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              PolicyPulse AI
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[11px] font-mono text-[#a1a1aa]">TENSOR TITANS · PS-40 / CBC 2.0</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono text-[#a1a1aa]">
            <span>React + Vite + TypeScript</span>
            <span className="text-white/20">•</span>
            <span>FastAPI + Supabase RRF RAG</span>
            <span className="text-white/20">•</span>
            <span>Human-in-the-Loop</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
