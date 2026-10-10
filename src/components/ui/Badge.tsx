import React from 'react';
import { IssueCoverageStatus, GuardrailVerdict } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  status?: IssueCoverageStatus;
  verdict?: GuardrailVerdict;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  verdict,
  size = 'md',
  className = '',
}) => {
  let styleClasses = 'bg-white/10 text-white/80 border-white/10';

  if (verdict === 'PASSED') {
    styleClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  } else if (verdict === 'FLAGGED') {
    styleClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  } else if (status) {
    switch (status) {
      case 'covered':
        styleClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        break;
      case 'partially_covered':
        styleClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        break;
      case 'uncovered':
        styleClasses = 'bg-slate-500/15 text-slate-300 border-slate-500/30';
        break;
      case 'prohibited':
        styleClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
        break;
      case 'conflict':
        styleClasses = 'bg-orange-500/15 text-orange-300 border-orange-500/30';
        break;
      case 'needs_human_review':
        styleClasses = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
        break;
    }
  } else {
    switch (variant) {
      case 'success':
        styleClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        break;
      case 'warning':
        styleClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        break;
      case 'danger':
        styleClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
        break;
      case 'info':
        styleClasses = 'bg-blue-500/15 text-blue-300 border-blue-500/30';
        break;
      case 'purple':
        styleClasses = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
        break;
      case 'outline':
        styleClasses = 'bg-transparent text-white/70 border-white/20';
        break;
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  // Format status string label if no children provided
  let label = children;
  if (!label && status) {
    label = status.replace(/_/g, ' ');
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border uppercase tracking-wider ${sizeClasses} ${styleClasses} ${className}`}
    >
      {label}
    </span>
  );
};
