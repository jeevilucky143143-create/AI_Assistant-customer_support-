import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from '@clerk/clerk-react';
import { apiService, setAuthTokenGetter } from '../../services/api';
import { AgentProfile } from '../../types';

interface AgentAuthContextType {
  isSignedIn: boolean;
  isLoaded: boolean;
  agentProfile: AgentProfile | null;
  role: 'support_agent' | 'supervisor';
  displayName: string;
  email: string;
  isSupervisor: boolean;
  isClerkConfigured: boolean;
  refreshProfile: () => Promise<void>;
}

const AgentAuthContext = createContext<AgentAuthContextType>({
  isSignedIn: false,
  isLoaded: true,
  agentProfile: null,
  role: 'support_agent',
  displayName: 'Support Agent',
  email: 'agent@support.internal',
  isSupervisor: false,
  isClerkConfigured: false,
  refreshProfile: async () => {},
});

export const useAgentAuth = () => useContext(AgentAuthContext);

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function InnerAgentAuthProvider({
  children,
  isClerkConfigured,
}: {
  children: React.ReactNode;
  isClerkConfigured: boolean;
}) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);

  // Wire Clerk token retriever into apiService
  useEffect(() => {
    if (isClerkConfigured && getToken) {
      setAuthTokenGetter(async () => {
        try {
          return await getToken();
        } catch (err) {
          console.warn('Failed to retrieve Clerk JWT:', err);
          return null;
        }
      });
    }
  }, [getToken, isClerkConfigured]);

  // Sync agent profile from backend when signed in
  const fetchProfile = async () => {
    if (isSignedIn) {
      try {
        const profile = await apiService.getCurrentAgent();
        if (profile) {
          setAgentProfile(profile);
        }
      } catch (err) {
        console.warn('Could not sync agent profile from backend:', err);
      }
    } else {
      setAgentProfile(null);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProfile();
    }
  }, [isLoaded, isSignedIn]);

  const displayName =
    agentProfile?.display_name ||
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'Support Agent';

  const email =
    agentProfile?.email ||
    user?.primaryEmailAddress?.emailAddress ||
    'agent@support.internal';

  const role = agentProfile?.role || 'support_agent';
  const isSupervisor = role === 'supervisor';

  return (
    <AgentAuthContext.Provider
      value={{
        isSignedIn: !!isSignedIn,
        isLoaded,
        agentProfile,
        role,
        displayName,
        email,
        isSupervisor,
        isClerkConfigured,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AgentAuthContext.Provider>
  );
}

function FallbackMockAuthProvider({ children }: { children: React.ReactNode }) {
  // Graceful fallback when CLERK_PUBLISHABLE_KEY is not yet supplied in environment
  return (
    <AgentAuthContext.Provider
      value={{
        isSignedIn: true,
        isLoaded: true,
        agentProfile: {
          id: '00000000-0000-0000-0000-000000000042',
          clerk_user_id: 'dev_mock_agent',
          email: 'agent@support.internal',
          display_name: 'Agent Marcus Aurelius',
          role: 'support_agent',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        role: 'support_agent',
        displayName: 'Agent Marcus Aurelius',
        email: 'agent@support.internal',
        isSupervisor: false,
        isClerkConfigured: false,
        refreshProfile: async () => {},
      }}
    >
      {children}
    </AgentAuthContext.Provider>
  );
}

export const AgentAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isConfigured = Boolean(
    CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY.startsWith('pk_')
  );

  if (!isConfigured) {
    return <FallbackMockAuthProvider>{children}</FallbackMockAuthProvider>;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <InnerAgentAuthProvider isClerkConfigured={true}>{children}</InnerAgentAuthProvider>
    </ClerkProvider>
  );
};
