import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BackendStatus } from '../../services/api';

interface NavbarProps {
  onLaunchStudio: () => void;
  backendStatus: BackendStatus;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchStudio, backendStatus }) => {
  return (
    <header className="relative z-20 w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex flex-row items-center justify-between">
        {/* Brand: PolicyPulse® + TENSOR TITANS · PS-40 */}
        <div className="flex items-baseline gap-3">
          <a
            href="#overview"
            className="text-2xl sm:text-3xl tracking-tight text-white hover:opacity-90 transition-opacity font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            PolicyPulse<sup className="text-xs ml-0.5 font-sans font-normal opacity-70">®</sup>
          </a>
          <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase text-white/45 pl-2 border-l border-white/15">
            TENSOR TITANS · PS-40
          </span>
        </div>

        {/* Central Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#a1a1aa] font-sans">
          <a href="#overview" className="hover:text-white transition-colors duration-200">
            Overview
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors duration-200">
            Policy Engine
          </a>
          <a href="#capabilities" className="hover:text-white transition-colors duration-200">
            Guardrails
          </a>
          <a href="#demo" className="hover:text-white transition-colors duration-200">
            Live Preview
          </a>
          <a href="#architecture" className="hover:text-white transition-colors duration-200">
            Taxonomy
          </a>
        </nav>

        {/* Right-side Controls: Backend Status Pill & Launch CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border backdrop-blur-md ${
              backendStatus.isLive
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/25'
            }`}
            title={backendStatus.message}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendStatus.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{backendStatus.isLive ? 'API Ready' : 'Demo Mode'}</span>
          </div>

          <button
            onClick={onLaunchStudio}
            className="group liquid-glass inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white hover:text-white hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer shadow-lg"
          >
            <span>Launch Agent Studio</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </header>
  );
};
