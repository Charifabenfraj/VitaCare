'use client';

import AdminModal from '@/components/admin/AdminModal';
import ImageUpload from '@/components/ImageUpload';
import { ToastContainer, useToast } from '@/components/Toast';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  composition?: string;
  price: number;
  image: string;
  categoryId: { _id: string; name: string } | string | null;
  stock: number;
  isPromotion: boolean;
  promotionPercentage: number;
  isPack: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminProducts() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { toasts, removeToast, success, error, info } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    composition: '',
    price: '',
    image: '',
    categoryId: '',
    stock: '',
    isPromotion: false,
    promotionPercentage: '',
    isPack: false,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchCategories();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      error('Erreur', 'Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const productData = {
      name: formData.name,
      description: formData.description,
      composition: formData.composition || 'Non spécifiée',
      price: parseFloat(formData.price),
      image: formData.image,
      categoryId: formData.categoryId,
      stock: parseInt(formData.stock),
      isPromotion: formData.isPromotion,
      promotionPercentage: formData.promotionPercentage ? parseFloat(formData.promotionPercentage) : 0,
      isPack: formData.isPack,
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchProducts();
        resetForm();
        setShowModal(false);
        success(
          editingProduct ? 'Produit modifié !' : 'Produit créé !',
          editingProduct 
            ? `${formData.name} a été mis à jour avec succès`
            : `${formData.name} a été ajouté au catalogue`
        );
      } else {
        error('Erreur', data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      error('Erreur', 'Impossible d\'enregistrer le produit');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      composition: product.composition || '',
      price: product.price.toString(),
      image: product.image || '',
      categoryId: product.categoryId 
        ? (typeof product.categoryId === 'object' 
          ? product.categoryId._id 
          : product.categoryId)
        : '',
      stock: product.stock.toString(),
      isPromotion: product.isPromotion,
      promotionPercentage: product.promotionPercentage?.toString() || '',
      isPack: product.isPack,
    });
    setShowModal(true);
    info('Mode édition', `Modification de "${product.name}"`);
  };

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
        success('Produit supprimé', `${productName} a été retiré du catalogue`);
      } else {
        error('Erreur', 'Impossible de supprimer le produit');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      error('Erreur', 'Une erreur est survenue lors de la suppression');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      composition: '',
      price: '',
      image: '',
      categoryId: '',
      stock: '',
      isPromotion: false,
      promotionPercentage: '',
      isPack: false,
    });
  };

  const getCategoryName = (categoryId: Product['categoryId']): string => {
    if (!categoryId) return 'N/A';
    if (typeof categoryId === 'object' && categoryId !== null) {
      return categoryId.name || 'N/A';
    }
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'N/A';
  };

  // Filtrer les produits
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let productCategoryId = '';
    if (product.categoryId) {
      productCategoryId = typeof product.categoryId === 'object' 
        ? product.categoryId._id 
        : product.categoryId;
    }
    const matchesCategory = !filterCategory || productCategoryId === filterCategory;
    
    let matchesStock = true;
    if (filterStock === 'in-stock') matchesStock = product.stock > 5;
    else if (filterStock === 'low-stock') matchesStock = product.stock > 0 && product.stock <= 5;
    else if (filterStock === 'out-of-stock') matchesStock = product.stock === 0;
    
    let matchesType = true;
    if (filterType === 'promo') matchesType = product.isPromotion;
    else if (filterType === 'pack') matchesType = product.isPack;
    
    return matchesSearch && matchesCategory && matchesStock && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterStock, filterType]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilterStock('');
    setFilterType('');
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
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D9CFC7]/10 rounded-full blur-3xl" />
        </div>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-[#4a4a4a] mb-2">
                  Gestion des Produits
                </h1>
                <p className="text-[#6a6a6a]">
                  Gérez votre catalogue de {products.length} produits
                </p>
              </div>
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="group px-6 py-4 bg-gradient-to-r from-[#96A78D] to-[#7d9175] text-white rounded-xl hover:shadow-xl hover:shadow-[#96A78D]/25 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block font-semibold">Ajouter un Produit</span>
                  <span className="block text-sm text-white/80">Nouveau dans le catalogue</span>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{products.length}</p>
                  <p className="text-sm text-[#6a6a6a]">Total produits</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{products.filter(p => p.isPromotion).length}</p>
                  <p className="text-sm text-[#6a6a6a]">En promotion</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{products.filter(p => p.stock <= 5).length}</p>
                  <p className="text-sm text-[#6a6a6a]">Stock faible</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{products.filter(p => p.isPack).length}</p>
                  <p className="text-sm text-[#6a6a6a]">Packs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
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
                    placeholder="Rechercher un produit..."
                    className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all placeholder:text-[#B6AE9F]"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all min-w-[160px]"
                >
                  <option value="">Toutes catégories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>

                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="px-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all min-w-[140px]"
                >
                  <option value="">Tout stock</option>
                  <option value="in-stock">En stock (&gt;5)</option>
                  <option value="low-stock">Stock faible (≤5)</option>
                  <option value="out-of-stock">Rupture</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all min-w-[130px]"
                >
                  <option value="">Tous types</option>
                  <option value="promo">Promotions</option>
                  <option value="pack">Packs</option>
                </select>

                {(searchQuery || filterCategory || filterStock || filterType) && (
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

            {/* Results summary */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-[#6a6a6a]">
                <span className="font-semibold text-[#96A78D]">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </span>
              {filteredProducts.length !== products.length && (
                <span className="text-[#B6AE9F]">sur {products.length} au total</span>
              )}
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent mx-auto"></div>
                <p className="mt-4 text-[#6a6a6a]">Chargement des produits...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#96A78D]/10 to-[#96A78D]/5 border-b border-[#D9CFC7]/50">
                      <th className="text-left py-4 px-6 text-[#4a4a4a] text-sm font-semibold">Produit</th>
                      <th className="text-left py-4 px-6 text-[#4a4a4a] text-sm font-semibold">Catégorie</th>
                      <th className="text-left py-4 px-6 text-[#4a4a4a] text-sm font-semibold">Prix</th>
                      <th className="text-left py-4 px-6 text-[#4a4a4a] text-sm font-semibold">Stock</th>
                      <th className="text-left py-4 px-6 text-[#4a4a4a] text-sm font-semibold">Statut</th>
                      <th className="text-right py-4 px-6 text-[#4a4a4a] text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F9F8F6]">
                    {paginatedProducts.length > 0 ? paginatedProducts.map((product) => (
                      <tr 
                        key={product._id} 
                        className="hover:bg-[#96A78D]/5 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#F9F8F6] rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm group-hover:ring-[#96A78D]/30 transition-all">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#B6AE9F]">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#4a4a4a] truncate">{product.name}</p>
                              <p className="text-sm text-[#6a6a6a] truncate max-w-[200px]">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1.5 bg-[#F9F8F6] text-[#6a6a6a] rounded-lg text-sm">
                            {getCategoryName(product.categoryId)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-[#96A78D]">{product.price.toFixed(2)} DT</p>
                            {product.isPromotion && product.promotionPercentage > 0 && (
                              <p className="text-xs text-orange-500 font-medium">-{product.promotionPercentage}%</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                            ${product.stock === 0 ? 'bg-red-100 text-red-700' : 
                              product.stock <= 5 ? 'bg-amber-100 text-amber-700' : 
                              'bg-emerald-100 text-emerald-700'}
                          `}>
                            <span className={`w-2 h-2 rounded-full ${
                              product.stock === 0 ? 'bg-red-500' : 
                              product.stock <= 5 ? 'bg-amber-500' : 
                              'bg-emerald-500'
                            }`} />
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5">
                            {product.isPromotion && (
                              <span className="px-2.5 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-lg text-xs font-semibold">
                                🏷️ Promo
                              </span>
                            )}
                            {product.isPack && (
                              <span className="px-2.5 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-lg text-xs font-semibold">
                                📦 Pack
                              </span>
                            )}
                            {!product.isPromotion && !product.isPack && (
                              <span className="text-[#B6AE9F] text-sm">Standard</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2.5 text-[#96A78D] bg-[#96A78D]/10 hover:bg-[#96A78D] hover:text-white rounded-xl transition-all duration-200"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product._id, product.name)}
                              className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200"
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="py-16 text-center">
                          <div className="w-20 h-20 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <p className="text-[#6a6a6a] text-lg font-medium">Aucun produit trouvé</p>
                          <p className="text-[#B6AE9F] mt-1">Essayez de modifier vos filtres de recherche</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#F9F8F6]">
                  <p className="text-sm text-[#6a6a6a]">
                    Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredProducts.length)} sur {filteredProducts.length} produits
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[#D9CFC7] text-[#6a6a6a] hover:bg-[#F9F8F6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-[#96A78D] text-white'
                              : 'border border-[#D9CFC7] text-[#6a6a6a] hover:bg-[#F9F8F6]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[#D9CFC7] text-[#6a6a6a] hover:bg-[#F9F8F6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
        subtitle={editingProduct ? `Modification de "${editingProduct.name}"` : 'Ajoutez un nouveau produit à votre catalogue'}
        icon={
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Nom du produit
                </span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all"
                placeholder="Ex: Crème hydratante visage"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all resize-none h-24"
                placeholder="Description détaillée du produit..."
                required
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Prix (DT)
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all"
                placeholder="0.00"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Catégorie
                </span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Stock
                </span>
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all"
                placeholder="0"
                required
              />
            </div>

            {/* Composition */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Composition
                </span>
              </label>
              <textarea
                value={formData.composition}
                onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all resize-none h-20"
                placeholder="Ingrédients et composition du produit"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Image du produit"
                required
              />
            </div>

            {/* Options */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-3">Options</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl cursor-pointer hover:border-[#96A78D] transition-all group">
                  <input
                    type="checkbox"
                    checked={formData.isPromotion}
                    onChange={(e) => setFormData({ ...formData, isPromotion: e.target.checked })}
                    className="w-5 h-5 text-[#96A78D] border-[#D9CFC7] rounded focus:ring-[#96A78D]"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏷️</span>
                    <span className="text-sm font-medium text-[#4a4a4a] group-hover:text-[#96A78D]">En promotion</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl cursor-pointer hover:border-[#96A78D] transition-all group">
                  <input
                    type="checkbox"
                    checked={formData.isPack}
                    onChange={(e) => setFormData({ ...formData, isPack: e.target.checked })}
                    className="w-5 h-5 text-[#96A78D] border-[#D9CFC7] rounded focus:ring-[#96A78D]"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📦</span>
                    <span className="text-sm font-medium text-[#4a4a4a] group-hover:text-[#96A78D]">Pack</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Promotion Percentage */}
            {formData.isPromotion && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                    </svg>
                    Pourcentage de réduction
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={formData.promotionPercentage}
                    onChange={(e) => setFormData({ ...formData, promotionPercentage: e.target.value })}
                    className="w-32 px-4 py-3 bg-white border-2 border-orange-200 rounded-xl focus:ring-0 focus:border-orange-400 transition-all"
                    placeholder="20"
                    min="1"
                    max="99"
                  />
                  <span className="text-[#6a6a6a]">%</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#D9CFC7]">
            <button
              type="button"
              onClick={() => setShowModal(false)}
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
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{editingProduct ? 'Enregistrer' : 'Ajouter'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
