import React, { useState, useEffect } from 'react';
import { Mail, Clock, AlertCircle, User, ShieldCheck, UserCheck, ArrowRightLeft } from 'lucide-react';
import { ComplaintTicket, AgentProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { apiService } from '../../services/api';

interface ComplaintHeaderProps {
  ticket: ComplaintTicket;
  onTicketUpdated?: (updatedTicket: Partial<ComplaintTicket>) => void;
}

export const ComplaintHeader: React.FC<ComplaintHeaderProps> = ({ ticket, onTicketUpdated }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [assignedAgentName, setAssignedAgentName] = useState<string>(
    ticket.assigned_to_agent_name || 'Agent Marcus Aurelius'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ticket.assigned_to_agent_name) {
      setAssignedAgentName(ticket.assigned_to_agent_name);
    }
  }, [ticket.assigned_to_agent_name]);

  const handleOpenAssign = async () => {
    setIsAssigning(true);
    try {
      const list = await apiService.listAgents();
      setAgents(list.filter((a) => a.is_active));
    } catch (e) {
      console.warn('Could not list agents for assignment:', e);
    }
  };

  const handleSelectAgent = async (agentId: string, agentName: string) => {
    setIsSaving(true);
    try {
      await apiService.assignComplaint(ticket.complaint_id, agentId);
      setAssignedAgentName(agentName);
      if (onTicketUpdated) {
        onTicketUpdated({
          assigned_to_agent_id: agentId,
          assigned_to_agent_name: agentName,
        });
      }
      setIsAssigning(false);
    } catch (err) {
      console.warn('Failed to assign complaint:', err);
      // Fallback local update
      setAssignedAgentName(agentName);
      setIsAssigning(false);
    } finally {
      setIsSaving(false);
    }
  };

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
          {/* Ownership & Accountability Badges */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/80 text-[11px] font-mono">
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-white/50">Assigned:</span>
            <span className="font-semibold text-purple-300">{assignedAgentName}</span>
            <button
              onClick={handleOpenAssign}
              className="ml-1 p-0.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Reassign Complaint"
            >
              <ArrowRightLeft className="w-3 h-3" />
            </button>
          </div>

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

      {/* Assignment Dropdown / Modal Bar */}
      {isAssigning && (
        <div className="p-3 mb-3 rounded-xl bg-purple-950/25 border border-purple-500/30 text-xs flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-medium text-purple-200">Reassign Case to Agent:</span>
            {agents.length > 0 ? (
              <select
                onChange={(e) => {
                  const ag = agents.find((a) => a.id === e.target.value);
                  if (ag) handleSelectAgent(ag.id, ag.display_name);
                }}
                defaultValue=""
                disabled={isSaving}
                className="bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 font-sans"
              >
                <option value="" disabled>
                  Select Active Support Agent...
                </option>
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.display_name} ({ag.role === 'supervisor' ? 'Supervisor' : 'Agent'})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-white/50 text-[11px] font-mono">
                Loading agent list or running in standalone mode...
              </span>
            )}
          </div>
          <button
            onClick={() => setIsAssigning(false)}
            className="text-white/40 hover:text-white px-2 py-1 text-xs"
          >
            Cancel
          </button>
        </div>
      )}

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
