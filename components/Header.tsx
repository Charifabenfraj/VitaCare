'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import UserMenu from './UserMenu';

export default function Header() {
  const { getItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F8F6]/98 backdrop-blur-md border-b border-[#D9CFC7] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo-vitacare.svg" alt="VitaCare" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
            >
              Accueil
            </Link>
            <Link
              href="/categories"
              className="text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
            >
              Catégories
            </Link>
            <Link
              href="/products"
              className="text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
            >
              Produits
            </Link>
            <Link
              href="/promotions"
              className="text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
            >
              Promotions
            </Link>
          </nav>

          {/* Right: User Menu + Cart */}
          <div className="flex items-center space-x-2">
            {/* User Menu (includes admin access) */}
            <UserMenu />

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
            >
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
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#96A78D] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#D9CFC7]">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/categories"
                className="text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Catégories
              </Link>
              <Link
                href="/products"
                className="text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Produits
              </Link>
              <Link
                href="/promotions"
                className="text-[#4a4a4a] hover:text-[#96A78D] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Promotions
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
