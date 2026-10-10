import React, { useState } from 'react';
import {
  Inbox,
  Search,
  BookOpen,
  Mail,
  MessageSquare,
  Ticket,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ComplaintTicket, PolicyDocument } from '../../types';
import { Badge } from '../ui/Badge';

interface TicketSidebarProps {
  tickets: ComplaintTicket[];
  selectedTicketId: string;
  onSelectTicket: (ticketId: string) => void;
  policies: PolicyDocument[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const TicketSidebar: React.FC<TicketSidebarProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  policies,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(
    (t) =>
      t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.raw_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
      case 'chat':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Ticket className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SIMULATED_DISPATCH':
        return <Badge variant="success" size="sm">Simulated Dispatch</Badge>;
      case 'DISPATCHED':
      case 'APPROVED':
        return <Badge variant="success" size="sm">Dispatched</Badge>;
      case 'ESCALATED':
        return <Badge variant="purple" size="sm">Escalated</Badge>;
      case 'REJECTED':
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="warning" size="sm">Pending Review</Badge>;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-80 bg-[#101015] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-purple-400" />
              Ticket Queue ({filteredTickets.length})
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Tier-1 Review
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by customer, ID or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredTickets.map((ticket) => {
            const isSelected = ticket.complaint_id === selectedTicketId;
            return (
              <div
                key={ticket.complaint_id}
                onClick={() => {
                  onSelectTicket(ticket.complaint_id);
                  onCloseMobile();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#1e1e2b] border-purple-500/40 shadow-md shadow-purple-950/20'
                    : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04] hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {getChannelIcon(ticket.channel)}
                    <span className="font-mono text-[11px] text-white/90 font-medium">
                      {ticket.complaint_id}
                    </span>
                  </div>
                  {getStatusBadge(ticket.review_status)}
                </div>

                <div className="text-xs font-semibold text-white/95 truncate mb-1">
                  {ticket.customer_name}
                </div>

                <p className="text-[11px] text-white/50 line-clamp-2 leading-snug mb-2 font-sans">
                  {ticket.raw_text}
                </p>

                <div className="flex items-center justify-between text-[10px] text-white/40 pt-1.5 border-t border-white/[0.04] font-mono">
                  <span>{ticket.received_at.split(' ')[1]}</span>
                  <span
                    className={`uppercase font-semibold ${
                      ticket.overall_severity === 'critical'
                        ? 'text-rose-400'
                        : ticket.overall_severity === 'high'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                    }`}
                  >
                    {ticket.overall_severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Policies Footnote */}
        <div className="p-3.5 border-t border-white/[0.08] bg-black/30">
          <div className="flex items-center justify-between text-[11px] text-white/60 mb-1.5">
            <span className="font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Indexed Policies ({policies.length})
            </span>
            <span className="font-mono text-[10px] text-emerald-400">pgvector ready</span>
          </div>
          <div className="space-y-1">
            {policies.slice(0, 3).map((pol) => (
              <div
                key={pol.policy_id}
                className="text-[10px] text-white/45 truncate flex items-center justify-between"
              >
                <span>{pol.title}</span>
                <span className="font-mono text-white/30">{pol.version}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
