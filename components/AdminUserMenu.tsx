'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function AdminUserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { logout, admin } = useAdminAuth();

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

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Admin Avatar/Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F9F8F6] transition-all duration-200 group"
                aria-label="Menu administrateur"
            >
                {/* Avatar Circle */}
                <div className="w-9 h-9 bg-gradient-to-br from-[#96A78D] to-[#7d9175] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                    {admin?.name?.charAt(0).toUpperCase() || 'A'}
                </div>

                {/* Name & Chevron */}
                <div className="hidden md:flex items-center gap-1">
                    <span className="text-sm font-medium text-[#4a4a4a]">{admin?.name || 'Admin'}</span>
                    <svg
                        className={`w-4 h-4 text-[#6a6a6a] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-[#D9CFC7] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* User Info Header */}
                        <div className="bg-gradient-to-br from-[#96A78D] to-[#7d9175] px-4 py-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg font-bold border-2 border-white/30">
                                    {admin?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <p className="font-semibold">{admin?.name || 'Administrateur'}</p>
                                    <p className="text-xs text-white/80">{admin?.email || 'admin@parapharma.com'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            {/* View Store */}
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-[#4a4a4a] hover:bg-[#F9F8F6] transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Voir la Boutique</p>
                                    <p className="text-xs text-[#6a6a6a]">Espace client</p>
                                </div>
                            </Link>

                            {/* Dashboard */}
                            <Link
                                href="/admin/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-[#4a4a4a] hover:bg-[#F9F8F6] transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Tableau de Bord</p>
                                    <p className="text-xs text-[#6a6a6a]">Statistiques</p>
                                </div>
                            </Link>

                            <div className="my-2 border-t border-[#D9CFC7]"></div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium">Déconnexion</p>
                                    <p className="text-xs text-red-500/70">Quitter l'administration</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
