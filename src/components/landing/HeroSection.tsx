import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onLaunchStudio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchStudio }) => {
  return (
    <section className="relative z-10 flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-6 py-[90px] text-center my-auto">
      {/* Main Headline */}
      <h1
        className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-white select-none"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Every response{' '}
        <span className="italic text-[#a1a1aa] block sm:inline font-light">
          grounded in policy.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-rise-delay text-base sm:text-lg text-[#a1a1aa] max-w-2xl mt-8 leading-relaxed font-sans font-normal">
        Intelligent AI agents designed for enterprise customer support — decomposing complex complaints, grounding every response in policy evidence, and flagging unauthorized commitments for human review.
      </p>

      {/* Hero CTA Group */}
      <div className="animate-fade-rise-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
        {/* Primary Action: Liquid-glass Launch Agent Studio */}
        <button
          onClick={onLaunchStudio}
          className="group liquid-glass rounded-full px-12 sm:px-14 py-4 sm:py-5 text-base font-medium text-white hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center gap-3 shadow-2xl"
        >
          <span>Launch Agent Studio</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </button>

        {/* Secondary Action: Explore the Workflow */}
        <a
          href="#how-it-works"
          className="group inline-flex items-center gap-2 px-6 py-4 text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors duration-200"
        >
          <span>Explore the Workflow</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
        </a>
      </div>
    </section>
  );
};
