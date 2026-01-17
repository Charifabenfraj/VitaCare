'use client';

import { CategoryType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: CategoryType[];
}

export default function Sidebar({ isOpen, onClose, categories: propCategories }: SidebarProps) {
  const [categories, setCategories] = useState<CategoryType[]>(propCategories || []);

  useEffect(() => {
    // Use prop categories if provided, otherwise fetch
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
      return;
    }
    
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        // Support both array response and success/data format
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [propCategories]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:shadow-none lg:border-r lg:border-[#D9CFC7]`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold text-[#4a4a4a] mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
            Catégories
          </h2>

          <nav className="space-y-1">
            <Link
              href="/products"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4a4a4a] hover:bg-[#96A78D]/10 hover:text-[#96A78D] transition-colors"
            >
              <span className="w-8 h-8 bg-[#96A78D] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
                  />
                </svg>
              </span>
              Tous les produits
            </Link>

            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category._id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4a4a4a] hover:bg-[#96A78D]/10 hover:text-[#96A78D] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm">{category.name}</span>
              </Link>
            ))}
          </nav>

          <hr className="my-4 border-[#D9CFC7]" />

          {/* Quick Links */}
          <h3 className="text-sm font-semibold text-[#6a6a6a] mb-3 uppercase tracking-wider">
            Offres Spéciales
          </h3>
          <nav className="space-y-1">
            <Link
              href="/promotions"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4a4a4a] hover:bg-[#B6CEB4]/20 transition-colors"
            >
              <span className="w-8 h-8 bg-[#B6CEB4] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6z"
                  />
                </svg>
              </span>
              <span className="text-sm">Promotions</span>
              <span className="ml-auto bg-[#B6CEB4] text-[#2d4a2d] text-xs font-bold px-2 py-0.5 rounded-full">
                -20%
              </span>
            </Link>

            <Link
              href="/packs"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4a4a4a] hover:bg-[#96A78D]/10 transition-colors"
            >
              <span className="w-8 h-8 bg-[#96A78D] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
              </span>
              <span className="text-sm">Packs</span>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
