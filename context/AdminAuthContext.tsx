'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pas de persistance de session - l'admin doit se connecter à chaque visite
    // Nettoyer toute ancienne session au démarrage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('parapharma-admin');
      sessionStorage.removeItem('parapharma-admin');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const adminUser: AdminUser = {
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          role: data.data.role,
        };
        setAdmin(adminUser);
        // Session en mémoire uniquement - pas de persistance
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Identifiants invalides' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  const logout = () => {
    setAdmin(null);
    // Session terminée - l'admin devra se reconnecter
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
