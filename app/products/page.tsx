'use client';

import { AnimatedSection, ProductCard } from '@/components';
import { CategoryType, ProductType } from '@/types';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        if (productsData.success) setProducts(productsData.data);
        if (categoriesData.success) setCategories(categoriesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    let passCategory = true;
    let passFilter = true;
    let passSearch = true;

    if (selectedCategory) {
      const categoryId = typeof product.categoryId === 'object' && product.categoryId !== null
        ? product.categoryId._id 
        : product.categoryId;
      passCategory = categoryId === selectedCategory;
    }

    if (filter === 'promotion') {
      passFilter = product.isPromotion;
    } else if (filter === 'pack') {
      passFilter = product.isPack;
    }

    if (searchQuery) {
      passSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   product.description.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return passCategory && passFilter && passSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F8F6] to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#96A78D] via-[#7d9175] to-[#5a6b54] pt-28 pb-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-4">
                ✨ Large sélection
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Tous nos Produits
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Explorez notre gamme complète de produits de parapharmacie de qualité
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full px-6 py-4 pl-14 rounded-full bg-white/95 backdrop-blur-sm text-[#4a4a4a] placeholder-[#9a9a9a] border-0 shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
                  />
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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

      {/* Filters & Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4E0] p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-sm font-medium text-[#6a6a6a] whitespace-nowrap">Catégorie:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-[#E8E4E0] bg-[#F9F8F6] focus:ring-2 focus:ring-[#96A78D] focus:border-transparent text-[#4a4a4a] text-sm"
              >
                <option value="">Toutes</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-[#96A78D] text-white shadow-md'
                    : 'bg-[#F9F8F6] text-[#4a4a4a] hover:bg-[#96A78D]/10 border border-[#E8E4E0]'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter('promotion')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  filter === 'promotion'
                    ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md'
                    : 'bg-[#F9F8F6] text-[#4a4a4a] hover:bg-orange-50 border border-[#E8E4E0]'
                }`}
              >
                <span>🔥</span> Promotions
              </button>
              <button
                onClick={() => setFilter('pack')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  filter === 'pack'
                    ? 'bg-gradient-to-r from-[#96A78D] to-[#7d9175] text-white shadow-md'
                    : 'bg-[#F9F8F6] text-[#4a4a4a] hover:bg-[#96A78D]/10 border border-[#E8E4E0]'
                }`}
              >
                <span>📦</span> Packs
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#6a6a6a]">
            <span className="text-2xl font-bold text-[#4a4a4a]">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </p>
          {(selectedCategory || filter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setFilter('all');
                setSearchQuery('');
              }}
              className="text-sm text-[#96A78D] hover:text-[#7d9175] flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#96A78D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#6a6a6a]">Chargement des produits...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#D9CFC7] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#6a6a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[#6a6a6a] text-lg mb-4">
              Aucun produit ne correspond à vos critères.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setFilter('all');
                setSearchQuery('');
              }}
              className="text-[#96A78D] hover:text-[#7d9175] font-medium"
            >
              Voir tous les produits
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
