'use client';

import { AnimatedSection, CategoryCard, HeroSection, ProductCard } from '@/components';
import { CategoryType, ProductType } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [promotions, setPromotions] = useState<ProductType[]>([]);
  const [packs, setPacks] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes, promotionsRes, packsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?limit=8'),
          fetch('/api/products?isPromotion=true&limit=8'),
          fetch('/api/products?isPack=true&limit=4'),
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();
        const promotionsData = await promotionsRes.json();
        const packsData = await packsRes.json();

        // Support both array response and success/data format
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
        
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData.success) {
          setProducts(productsData.data);
        }
        
        if (Array.isArray(promotionsData)) {
          setPromotions(promotionsData);
        } else if (promotionsData.success) {
          setPromotions(promotionsData.data);
        }
        
        if (Array.isArray(packsData)) {
          setPacks(packsData);
        } else if (packsData.success) {
          setPacks(packsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <AnimatedSection className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" delay={0}>
        <div id="categories">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#96A78D]/10 text-[#96A78D] text-sm font-semibold px-6 py-2 rounded-full mb-4 border border-[#96A78D]/20">
              🏪 Notre Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d2d2d] mb-4">
              Nos Catégories
            </h2>
            <p className="text-[#6a6a6a] max-w-2xl mx-auto text-lg">
              Explorez notre large gamme de produits de parapharmacie soigneusement sélectionnés pour vous
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent"></div>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category._id} category={category} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-[#F9F8F6] to-[#E8E4E0] rounded-2xl border border-[#D9CFC7]">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-[#6a6a6a] mb-4 text-lg">Aucune catégorie disponible pour le moment.</p>
              <Link href="/admin" className="inline-flex items-center gap-2 text-[#96A78D] hover:text-[#7d9175] font-semibold transition-colors">
                Ajouter des catégories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Promotions Section */}
      <AnimatedSection className="py-20 bg-gradient-to-br from-[#D9CFC7] via-[#E8E4E0] to-[#D9CFC7]" delay={0.1}>
        <div id="promotions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-[#96A78D] to-[#B6CEB4] text-white text-sm font-bold px-6 py-2 rounded-full mb-4 shadow-md">
              🔥 Offres Spéciales
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d2d2d] mb-4">
              Promotions du Moment
            </h2>
            <p className="text-[#6a6a6a] max-w-2xl mx-auto text-lg">
              Profitez de nos meilleures offres et réductions sur une sélection de produits
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent"></div>
            </div>
          ) : promotions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {promotions.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/50 rounded-2xl backdrop-blur-sm">
              <div className="text-6xl mb-4">🏷️</div>
              <p className="text-[#6a6a6a] text-lg">
                Aucune promotion disponible pour le moment.
              </p>
              <p className="text-sm text-[#96A78D] mt-2">Revenez bientôt pour découvrir nos offres!</p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Packs Section */}
      <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" delay={0.2}>
        <div className="text-center mb-12">
          <span className="inline-block bg-[#96A78D] text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
            Économisez Plus
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4a4a4a] mb-4">
            Nos Packs Recommandés
          </h2>
          <p className="text-[#6a6a6a] max-w-2xl mx-auto">
            Des combinaisons de produits sélectionnés pour un soin complet à prix avantageux
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent"></div>
          </div>
        ) : packs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {packs.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#6a6a6a] py-12">
            Aucun pack disponible pour le moment.
          </p>
        )}
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-16 bg-[#F9F8F6]" delay={0.3}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#96A78D] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#4a4a4a] mb-2">
                Livraison Rapide
              </h3>
              <p className="text-[#6a6a6a]">
                Livraison gratuite à partir de 49 DT d&apos;achat
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#96A78D] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#4a4a4a] mb-2">
                Produits Certifiés
              </h3>
              <p className="text-[#6a6a6a]">
                Tous nos produits sont certifiés et de haute qualité
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#96A78D] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#4a4a4a] mb-2">
                Support 24/7
              </h3>
              <p className="text-[#6a6a6a]">
                Notre équipe est disponible pour vous conseiller
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

    
    </div>
  );
}
