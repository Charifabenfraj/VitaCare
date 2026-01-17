'use client';

import AdminModal from '@/components/admin/AdminModal';
import { ToastContainer, useToast } from '@/components/Toast';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isPromotion: boolean;
  promotionPercentage?: number;
  stock: number;
  categoryId: { _id: string; name: string } | string;
}

export default function AdminPromotions() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { toasts, removeToast, success, error, warning, info } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDiscount, setFilterDiscount] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    promotionPercentage: '',
    originalPrice: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setAllProducts(data.data);
        setProducts(data.data.filter((p: Product) => p.isPromotion));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      error('Erreur', 'Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotion = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      promotionPercentage: product.promotionPercentage?.toString() || '10',
      originalPrice: product.originalPrice?.toString() || product.price.toString(),
    });
    setShowModal(true);
    if (!product.isPromotion) {
      info('Nouvelle promotion', `Configuration pour "${product.name}"`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);

    const originalPrice = parseFloat(formData.originalPrice);
    const percentage = parseFloat(formData.promotionPercentage);
    const newPrice = originalPrice * (1 - percentage / 100);

    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPromotion: true,
          originalPrice: originalPrice,
          price: Math.round(newPrice * 100) / 100,
          promotionPercentage: percentage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts();
        setShowModal(false);
        setShowAddModal(false);
        setEditingProduct(null);
        success(
          'Promotion appliquée !',
          `${editingProduct.name} est maintenant à -${percentage}%`
        );
      } else {
        error('Erreur', data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Error updating promotion:', err);
      error('Erreur', 'Impossible de mettre à jour la promotion');
    } finally {
      setSaving(false);
    }
  };

  const removePromotion = async (productId: string, productName: string, originalPrice: number) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer la promotion ?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPromotion: false,
          price: originalPrice,
          promotionPercentage: null,
          originalPrice: null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts();
        success('Promotion retirée', `${productName} n'est plus en promotion`);
      } else {
        error('Erreur', 'Impossible de retirer la promotion');
      }
    } catch (err) {
      console.error('Error removing promotion:', err);
      error('Erreur', 'Une erreur est survenue');
    }
  };

  const nonPromoProducts = allProducts.filter((p) => !p.isPromotion);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDiscount = true;
    if (filterDiscount) {
      const discount = product.promotionPercentage || 0;
      if (filterDiscount === '10') matchesDiscount = discount >= 10 && discount < 20;
      else if (filterDiscount === '20') matchesDiscount = discount >= 20 && discount < 30;
      else if (filterDiscount === '30') matchesDiscount = discount >= 30 && discount < 50;
      else if (filterDiscount === '50') matchesDiscount = discount >= 50;
    }
    
    return matchesSearch && matchesDiscount;
  });

  // Calculate stats
  const totalSavings = products.reduce((sum, p) => {
    if (p.originalPrice && p.price) {
      return sum + (p.originalPrice - p.price);
    }
    return sum;
  }, 0);

  const avgDiscount = products.length > 0 
    ? Math.round(products.reduce((sum, p) => sum + (p.promotionPercentage || 0), 0) / products.length)
    : 0;

  const clearFilters = () => {
    setSearchQuery('');
    setFilterDiscount('');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F8F6] via-[#f5f3f0] to-[#ebe7e3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#96A78D] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-[#6a6a6a]">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] via-[#f5f3f0] to-[#ebe7e3]">
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#96A78D]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#96A78D]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#D9CFC7]/10 rounded-full blur-3xl" />
        </div>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-[#4a4a4a] mb-2">
                  Gestion des Promotions
                </h1>
                <p className="text-[#6a6a6a]">
                  Gérez vos offres spéciales et réductions
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="group px-6 py-4 bg-gradient-to-r from-[#96A78D] to-[#7d9175] text-white rounded-xl hover:shadow-xl hover:shadow-[#96A78D]/25 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block font-semibold">Nouvelle Promotion</span>
                  <span className="block text-sm text-white/80">Ajouter une offre</span>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#B6CEB4] to-[#96A78D] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{products.length}</p>
                  <p className="text-sm text-[#6a6a6a]">Promotions actives</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{totalSavings.toFixed(0)} DT</p>
                  <p className="text-sm text-[#6a6a6a]">Économies totales</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D9CFC7] to-[#c4b8ae] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{avgDiscount}%</p>
                  <p className="text-sm text-[#6a6a6a]">Réduction moyenne</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#a5b8c7] to-[#8fa3b4] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{nonPromoProducts.length}</p>
                  <p className="text-sm text-[#6a6a6a]">Sans promotion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une promotion..."
                    className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all placeholder:text-[#B6AE9F]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={filterDiscount}
                  onChange={(e) => setFilterDiscount(e.target.value)}
                  className="px-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all min-w-[160px]"
                >
                  <option value="">Toutes réductions</option>
                  <option value="10">10-19%</option>
                  <option value="20">20-29%</option>
                  <option value="30">30-49%</option>
                  <option value="50">50% et plus</option>
                </select>

                {(searchQuery || filterDiscount) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 text-sm text-[#6a6a6a]">
              <span className="font-semibold text-[#96A78D]">{filteredProducts.length}</span> promotion{filteredProducts.length > 1 ? 's' : ''} affichée{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent mx-auto"></div>
                <p className="mt-4 text-[#6a6a6a]">Chargement des promotions...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Active Promotions */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#B6CEB4] to-[#96A78D] rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#4a4a4a]">Promotions Actives</h2>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <div 
                        key={product._id} 
                        className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Image */}
                        <div className="h-44 bg-gradient-to-br from-[#F9F8F6] to-[#ebe7e3] relative overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-16 h-16 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          {/* Badge */}
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#96A78D] to-[#7d9175] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            -{product.promotionPercentage || 0}%
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-bold text-lg text-[#4a4a4a] mb-3 group-hover:text-[#96A78D] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          
                          {/* Prices */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl font-bold text-[#96A78D]">{product.price.toFixed(2)} DT</span>
                            {product.originalPrice && (
                              <span className="text-lg text-[#B6AE9F] line-through">{product.originalPrice.toFixed(2)} DT</span>
                            )}
                          </div>

                          {/* Savings */}
                          {product.originalPrice && (
                            <div className="bg-green-50 rounded-lg p-2.5 mb-4 flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm text-green-700 font-medium">
                                Économie: {(product.originalPrice - product.price).toFixed(2)} DT
                              </span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-3 border-t border-[#F9F8F6]">
                            <button
                              onClick={() => handleAddPromotion(product)}
                              className="flex-1 px-4 py-2.5 bg-[#96A78D]/10 text-[#96A78D] rounded-xl hover:bg-[#96A78D] hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Modifier
                            </button>
                            <button
                              onClick={() => removePromotion(product._id, product.name, product.originalPrice || product.price)}
                              className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
                              title="Retirer la promotion"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-12 text-center">
                    <div className="w-20 h-20 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <p className="text-[#6a6a6a] text-lg font-medium">Aucune promotion active</p>
                    <p className="text-[#B6AE9F] mt-1">Ajoutez une promotion pour commencer</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Edit/Create Promotion Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingProduct(null); }}
        title={editingProduct?.isPromotion ? 'Modifier la Promotion' : 'Créer une Promotion'}
        subtitle={editingProduct ? `Configuration pour "${editingProduct.name}"` : ''}
        icon={
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
        size="md"
      >
        {editingProduct && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Info */}
            <div className="bg-gradient-to-r from-[#F9F8F6] to-[#ebe7e3] p-4 rounded-xl flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0">
                {editingProduct.image ? (
                  <img src={editingProduct.image} alt={editingProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#B6AE9F]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-[#4a4a4a]">{editingProduct.name}</p>
                <p className="text-sm text-[#6a6a6a]">Prix actuel: {editingProduct.price.toFixed(2)} DT</p>
              </div>
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Prix original (DT)
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all"
                required
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                  </svg>
                  Pourcentage de réduction (%)
                </span>
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.promotionPercentage}
                onChange={(e) => setFormData({ ...formData, promotionPercentage: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all"
                required
              />
            </div>

            {/* Preview */}
            {formData.originalPrice && formData.promotionPercentage && (
              <div className="bg-gradient-to-r from-[#F9F8F6] to-[#ebe7e3] p-5 rounded-xl border border-[#D9CFC7]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#6a6a6a]">Aperçu de la promotion</span>
                  <span className="px-3 py-1 bg-[#96A78D] text-white rounded-full text-sm font-bold">
                    -{formData.promotionPercentage}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#96A78D]">
                    {(parseFloat(formData.originalPrice) * (1 - parseFloat(formData.promotionPercentage) / 100)).toFixed(2)} DT
                  </span>
                  <span className="text-lg text-[#B6AE9F] line-through">
                    {parseFloat(formData.originalPrice).toFixed(2)} DT
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Économie: {(parseFloat(formData.originalPrice) * parseFloat(formData.promotionPercentage) / 100).toFixed(2)} DT
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#D9CFC7]">
              <button
                type="button"
                onClick={() => { setShowModal(false); setEditingProduct(null); }}
                className="flex-1 px-6 py-3.5 border-2 border-[#D9CFC7] text-[#4a4a4a] rounded-xl hover:bg-[#F9F8F6] transition-all font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#96A78D] to-[#7d9175] text-white rounded-xl hover:shadow-lg hover:shadow-[#96A78D]/25 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Application...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Appliquer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Add Promotion Modal - Select Product */}
      <AdminModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter une Promotion"
        subtitle="Sélectionnez un produit pour créer une promotion"
        icon={
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
        size="lg"
      >
        <div className="space-y-4">
          {/* Search in modal */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all placeholder:text-[#B6AE9F]"
            />
          </div>

          {/* Products list */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {nonPromoProducts.length > 0 ? (
              nonPromoProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => {
                    setShowAddModal(false);
                    handleAddPromotion(product);
                  }}
                  className="flex items-center gap-4 p-4 bg-[#F9F8F6] rounded-xl hover:bg-[#ebe7e3] cursor-pointer transition-colors group"
                >
                  <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#B6AE9F]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#4a4a4a] group-hover:text-[#96A78D] transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-[#6a6a6a]">{product.price.toFixed(2)} DT</p>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-[#96A78D] rounded-full flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#6a6a6a]">
                <p>Tous les produits sont déjà en promotion</p>
              </div>
            )}
          </div>
        </div>
      </AdminModal>
    </>
  );
}
