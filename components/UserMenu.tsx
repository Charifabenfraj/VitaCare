'use client';

import { useClientAuth } from '@/context/ClientAuthContext';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const { client, isAuthenticated, login, logout } = useClientAuth();

  // Fermer le menu en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, name);
      setShowLoginModal(false);
      setEmail('');
      setName('');
    }
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* User Icon Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#4a4a4a] hover:text-[#96A78D] transition-all duration-300 relative group"
          aria-label="Menu utilisateur"
        >
          {isAuthenticated ? (
            <div className="w-8 h-8 bg-[#96A78D] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {client?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
          
          {/* Indicator when menu is open */}
          {isOpen && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#96A78D] rounded-full"></div>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop overlay for mobile */}
            <div 
              className="fixed inset-0 z-40 md:hidden" 
              onClick={() => setIsOpen(false)}
            />
            
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#D9CFC7] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Info Section */}
              {isAuthenticated ? (
                <div className="px-4 py-3 border-b border-[#D9CFC7]">
                  <p className="text-sm font-medium text-[#4a4a4a]">Bonjour, {client?.name}</p>
                  <p className="text-xs text-[#6a6a6a] mt-1">{client?.email}</p>
                </div>
              ) : (
                <div className="px-4 py-3 border-b border-[#D9CFC7]">
                  <p className="text-sm font-medium text-[#4a4a4a]">Bienvenue</p>
                  <p className="text-xs text-[#6a6a6a] mt-1">Connectez-vous pour un suivi personnalisé</p>
                </div>
              )}

              {/* Menu Items */}
              <div className="py-2">
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#96A78D] hover:bg-[#96A78D]/10 transition-colors w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Se connecter</span>
                  </button>
                )}

                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a4a4a] hover:bg-[#F9F8F6] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Accueil</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a4a4a] hover:bg-[#F9F8F6] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Mon Panier</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <div className="my-2 border-t border-[#D9CFC7]"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Se déconnecter</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Login Modal - Improved Design */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowLoginModal(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Decorative Header Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#96A78D] via-[#7d9175] to-[#5a6b54]">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="relative pt-20 pb-8 px-8">
              {/* Avatar Icon */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-[#96A78D]/20 to-[#96A78D]/5 rounded-xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Header Text */}
              <div className="text-center mb-8 mt-8">
                <h3 className="text-2xl font-bold text-[#4a4a4a] mb-2">Bienvenue chez VitaCare</h3>
                <p className="text-[#6a6a6a]">
                  Connectez-vous pour un suivi personnalisé de vos commandes
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-name" className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                    Votre nom
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="login-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre prénom"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#E8E4E0] bg-[#F9F8F6] focus:ring-2 focus:ring-[#96A78D]/50 focus:border-[#96A78D] transition-all text-[#4a4a4a] placeholder:text-[#B6AE9F]"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                    Adresse email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="votre@email.com"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#E8E4E0] bg-[#F9F8F6] focus:ring-2 focus:ring-[#96A78D]/50 focus:border-[#96A78D] transition-all text-[#4a4a4a] placeholder:text-[#B6AE9F]"
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-[#96A78D]/10 to-[#96A78D]/5 rounded-xl p-4 border border-[#96A78D]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#96A78D]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#4a4a4a] mb-1">Connexion sécurisée</p>
                      <p className="text-xs text-[#6a6a6a]">
                        Suivez vos commandes en temps réel et recevez des notifications personnalisées.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#96A78D] to-[#7d9175] text-white font-semibold rounded-xl hover:from-[#7d9175] hover:to-[#5a6b54] transition-all duration-300 shadow-lg shadow-[#96A78D]/30 hover:shadow-xl hover:shadow-[#96A78D]/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>Se connecter</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-xs text-[#B6AE9F] mt-6">
                En continuant, vous acceptez nos conditions d&apos;utilisation
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}