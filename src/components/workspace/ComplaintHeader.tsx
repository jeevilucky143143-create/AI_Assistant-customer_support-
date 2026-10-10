import React from 'react';
import { Mail, Clock, AlertCircle, User, ShieldCheck } from 'lucide-react';
import { ComplaintTicket } from '../../types';
import { Badge } from '../ui/Badge';

interface ComplaintHeaderProps {
  ticket: ComplaintTicket;
}

export const ComplaintHeader: React.FC<ComplaintHeaderProps> = ({ ticket }) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#121218] border border-white/[0.08] shadow-sm mb-6">
      {/* Top Meta Line */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-mono text-sm font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">{ticket.customer_name}</h2>
              <span className="font-mono text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded">
                {ticket.complaint_id}
              </span>
            </div>
            <span className="text-xs text-white/50 font-mono">
              {ticket.customer_email || 'customer@example.com'} • ID: {ticket.customer_id}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-white/70 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-white/40" />
            <span>{ticket.received_at}</span>
          </div>

          <Badge
            variant={
              ticket.overall_severity === 'critical'
                ? 'danger'
                : ticket.overall_severity === 'high'
                ? 'warning'
                : 'info'
            }
            size="sm"
          >
            {ticket.overall_severity} Severity
          </Badge>

          <Badge variant="purple" size="sm">
            {ticket.overall_sentiment}
          </Badge>
        </div>
      </div>

      {/* Raw Customer Message Block */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-muted font-mono uppercase tracking-wider mb-2">
          <span>Inbound Customer Statement</span>
          <span className="text-purple-300/80">Channel: {ticket.channel}</span>
        </div>
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
          "{ticket.raw_text}"
        </p>
      </div>
    </div>
  );
};
