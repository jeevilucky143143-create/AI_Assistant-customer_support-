import React from 'react';
import { User, ShieldCheck, ShieldAlert, LogIn, Lock } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import { useAgentAuth } from './AgentAuthProvider';

interface AgentProfileBadgeProps {
  onOpenSupervisorModal?: () => void;
  compact?: boolean;
}

export const AgentProfileBadge: React.FC<AgentProfileBadgeProps> = ({
  onOpenSupervisorModal,
  compact = false,
}) => {
  const {
    isSignedIn,
    displayName,
    role,
    isSupervisor,
    isClerkConfigured,
  } = useAgentAuth();

  if (!isClerkConfigured) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/80">
        <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold">
          A
        </div>
        <span className="font-medium text-[11px]">{displayName}</span>
        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-purple-500/15 text-purple-300 border border-purple-500/25">
          {role === 'supervisor' ? 'Supervisor' : 'Support Agent'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <SignedIn>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md">
          {/* Clerk user avatar menu */}
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-6 h-6 rounded-full ring-1 ring-white/20',
              },
            }}
          />

          {!compact && (
            <div className="flex flex-col text-left">
              <span className="text-xs font-medium text-white max-w-[120px] truncate leading-tight">
                {displayName}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider font-semibold border ${
                    isSupervisor
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {isSupervisor ? 'Supervisor' : 'Support Agent'}
                </span>
              </div>
            </div>
          )}

          {isSupervisor && onOpenSupervisorModal && (
            <button
              onClick={onOpenSupervisorModal}
              className="ml-1 p-1 rounded-md text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/15 transition-colors text-[10px] font-mono border border-amber-500/30 px-2 py-0.5"
              title="Supervisor Role Admin"
            >
              Manage Roles
            </button>
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-medium transition-all shadow-sm">
            <LogIn className="w-3.5 h-3.5" />
            <span>Agent Sign In</span>
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};
