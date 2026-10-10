import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Check, ShieldCheck, UserX, UserCheck, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { AgentProfile } from '../../types';
import { apiService } from '../../services/api';
import { useAgentAuth } from './AgentAuthProvider';

interface SupervisorAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupervisorAdminModal: React.FC<SupervisorAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { agentProfile: currentAgent, isSupervisor, refreshProfile } = useAgentAuth();
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAgents = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const data = await apiService.listAgents();
      setAgents(data);
    } catch (err: any) {
      setActionError(err.message || 'Failed to list agents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAgents();
    }
  }, [isOpen]);

  const handleToggleRole = async (targetAgent: AgentProfile) => {
    const newRole = targetAgent.role === 'supervisor' ? 'support_agent' : 'supervisor';
    setActionError(null);
    setSuccessMsg(null);
    try {
      await apiService.updateAgentRole(targetAgent.id, newRole);
      setSuccessMsg(`Updated ${targetAgent.display_name}'s role to ${newRole}`);
      await loadAgents();
      await refreshProfile();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update agent role');
    }
  };

  const handleToggleStatus = async (targetAgent: AgentProfile) => {
    setActionError(null);
    setSuccessMsg(null);
    try {
      await apiService.updateAgentStatus(targetAgent.id, !targetAgent.is_active);
      setSuccessMsg(
        `${!targetAgent.is_active ? 'Activated' : 'Deactivated'} ${targetAgent.display_name}`
      );
      await loadAgents();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update agent status');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#13131c] border border-amber-500/25 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Supervisor Role & Agent Admin</h3>
            <span className="text-xs text-white/50 font-mono">
              Strict RBAC: Self-assignment prohibited • Historical audit logs preserved
            </span>
          </div>
        </div>

        {/* Informational security banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs mb-4 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Only verified supervisors may promote agents or deactivate accounts. Deactivated agents cannot access the API, while their historical audit entries remain immutable.
          </span>
        </div>

        {actionError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs mb-3">
            {actionError}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs mb-3">
            {successMsg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-white/50">
              Loading support agent roster...
            </div>
          ) : agents.length === 0 ? (
            <div className="py-12 text-center text-xs text-white/40">
              No registered agent profiles found in the database.
            </div>
          ) : (
            agents.map((agent) => {
              const isSelf = currentAgent?.id === agent.id;
              return (
                <div
                  key={agent.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    agent.is_active
                      ? 'bg-black/30 border-white/10'
                      : 'bg-rose-950/15 border-rose-500/25 opacity-75'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{agent.display_name}</span>
                      {isSelf && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/10 text-white/70">
                          (You)
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                          agent.role === 'supervisor'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        {agent.role === 'supervisor' ? 'Supervisor' : 'Support Agent'}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                          agent.is_active ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {agent.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/50 font-mono">
                      {agent.email} • ID: {agent.id.slice(0, 8)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role toggle button */}
                    <button
                      onClick={() => handleToggleRole(agent)}
                      disabled={isSelf}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/15 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title={isSelf ? 'Cannot modify your own supervisor role' : ''}
                    >
                      {agent.role === 'supervisor' ? 'Demote to Agent' : 'Promote to Supervisor'}
                    </button>

                    {/* Active toggle button */}
                    <button
                      onClick={() => handleToggleStatus(agent)}
                      disabled={isSelf}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                        agent.is_active
                          ? 'border-rose-500/30 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20'
                          : 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20'
                      }`}
                      title={isSelf ? 'Cannot deactivate yourself' : ''}
                    >
                      {agent.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
