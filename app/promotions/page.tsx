'use client';

import { AnimatedSection, ProductCard } from '@/components';
import { ProductType } from '@/types';
import { useEffect, useState } from 'react';

export default function PromotionsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch('/api/products?isPromotion=true');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F8F6] to-white">
      {/* Hero Header with Fire Theme */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 pt-28 pb-24 overflow-hidden">
        {/* Animated Fire Effect */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-5 py-2.5 rounded-full mb-6">
                <span className="text-xl animate-bounce">🔥</span>
                <span>Offres Exceptionnelles</span>
                <span className="text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>🔥</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Promotions
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-6">
                Profitez de nos meilleures offres et réductions exclusives sur une sélection de produits premium
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="text-3xl font-bold text-white">{products.length}</div>
                  <div className="text-white/80 text-sm">Produits en promo</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="text-3xl font-bold text-white">-50%</div>
                  <div className="text-white/80 text-sm">Jusqu&apos;à</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="text-3xl font-bold text-white">⚡</div>
                  <div className="text-white/80 text-sm">Offres limitées</div>
                </div>
              </div>
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

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#6a6a6a]">Chargement des promotions...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-[#6a6a6a]">
                <span className="text-2xl font-bold text-[#4a4a4a]">{products.length}</span> offres disponibles
              </p>
              <div className="hidden sm:flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Offres à durée limitée
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🏷️</span>
            </div>
            <p className="text-[#6a6a6a] text-lg mb-2">
              Aucune promotion disponible pour le moment.
            </p>
            <p className="text-[#9a9a9a] text-sm">
              Revenez bientôt pour découvrir nos offres exceptionnelles!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
