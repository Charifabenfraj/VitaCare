'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');

  // Vérifier si un admin existe
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/setup');
        const data = await response.json();
        setHasAdmin(data.hasAdmin);
      } catch {
        setHasAdmin(true); // En cas d'erreur, on suppose qu'il y a un admin
      }
    };
    checkAdmin();
  }, []);

  // Créer l'admin par défaut
  const handleSetupAdmin = async () => {
    setSetupLoading(true);
    setSetupMessage('');
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: 'parapharma-setup-2024' }),
      });
      const data = await response.json();
      if (data.success) {
        setSetupMessage('✓ Admin créé! Utilisez admin@parapharma.com / admin123');
        setHasAdmin(true);
        setEmail('admin@parapharma.com');
      } else {
        setSetupMessage('Erreur: ' + data.error);
      }
    } catch {
      setSetupMessage('Erreur de connexion au serveur');
    }
    setSetupLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError(result.error || 'Email ou mot de passe incorrect');
    }
    
    setLoading(false);
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#96A78D] via-[#7d9175] to-[#5a6b54] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/20 rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <span className="text-5xl font-bold">Para</span>
            <span className="text-5xl font-light">Pharma</span>
          </div>
          <h1 className="text-3xl font-light mb-4">Espace Administration</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Gérez votre boutique de parapharmacie en toute simplicité. 
            Produits, catégories, commandes et promotions, tout est à portée de main.
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Gestion des produits et catégories</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Suivi des commandes en temps réel</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Gestion des promotions et packs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F9F8F6]">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <span className="text-3xl font-bold text-[#96A78D]">Para</span>
              <span className="text-3xl font-light text-[#4a4a4a]">Pharma</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#D9CFC7]/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#96A78D]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#4a4a4a]">Connexion</h2>
              <p className="text-[#6a6a6a] mt-2">Entrez vos identifiants administrateur</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4a4a4a] mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@parapharma.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#D9CFC7] focus:ring-2 focus:ring-[#96A78D] focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4a4a4a] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-[#D9CFC7] focus:ring-2 focus:ring-[#96A78D] focus:border-transparent transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#B6AE9F] hover:text-[#6a6a6a] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {setupMessage && (
                <div className={`flex items-center space-x-2 p-4 rounded-xl ${setupMessage.includes('✓') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-yellow-50 border border-yellow-200 text-yellow-700'}`}>
                  <span className="text-sm">{setupMessage}</span>
                </div>
              )}

              {/* Bouton de création admin si aucun admin n'existe */}
              {hasAdmin === false && (
                <button
                  type="button"
                  onClick={handleSetupAdmin}
                  disabled={setupLoading}
                  className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 mb-2"
                >
                  {setupLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Création...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Créer un compte admin</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#96A78D] text-white font-semibold rounded-xl hover:bg-[#7d9175] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-[#96A78D]/25"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-[#96A78D] hover:text-[#7d9175] transition-colors inline-flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Retour à la boutique</span>
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-[#B6AE9F] mt-6">
            © 2024 ParaPharma. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
