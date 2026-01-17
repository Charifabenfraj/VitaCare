'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ClientUser {
  email: string;
  name?: string;
  wantsNotifications: boolean;
}

interface ClientAuthContextType {
  client: ClientUser | null;
  isLoading: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateNotificationPreference: (wants: boolean) => void;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ClientUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing client session in localStorage
    const savedClient = localStorage.getItem('parapharma-client');
    if (savedClient) {
      try {
        const parsed = JSON.parse(savedClient);
        setClient(parsed);
      } catch {
        localStorage.removeItem('parapharma-client');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, name?: string) => {
    const clientUser: ClientUser = {
      email,
      name: name || email.split('@')[0],
      wantsNotifications: true,
    };
    setClient(clientUser);
    localStorage.setItem('parapharma-client', JSON.stringify(clientUser));
  };

  const logout = () => {
    setClient(null);
    localStorage.removeItem('parapharma-client');
  };

  const updateNotificationPreference = (wants: boolean) => {
    if (client) {
      const updated = { ...client, wantsNotifications: wants };
      setClient(updated);
      localStorage.setItem('parapharma-client', JSON.stringify(updated));
    }
  };

  return (
    <ClientAuthContext.Provider
      value={{
        client,
        isLoading,
        login,
        logout,
        isAuthenticated: !!client,
        updateNotificationPreference,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}
