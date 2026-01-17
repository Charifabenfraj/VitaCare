'use client';

import { AnimatedSection, CategoryCard } from '@/components';
import { CategoryType } from '@/types';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F8F6] to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#96A78D] via-[#7d9175] to-[#5a6b54] pt-28 pb-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-4">
                🏷️ Explorez nos rayons
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Nos Catégories
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Découvrez toutes nos catégories de produits de parapharmacie soigneusement sélectionnés pour votre bien-être
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9F8F6"/>
          </svg>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#96A78D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#6a6a6a]">Chargement des catégories...</p>
            </div>
          </div>
        ) : categories.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-[#6a6a6a]">
                <span className="text-2xl font-bold text-[#4a4a4a]">{categories.length}</span> catégories disponibles
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category._id} category={category} index={index} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#D9CFC7] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#6a6a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-[#6a6a6a] text-lg">
              Aucune catégorie disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
