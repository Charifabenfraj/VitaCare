'use client';

import AdminModal from '@/components/admin/AdminModal';
import ImageUpload from '@/components/ImageUpload';
import { ToastContainer, useToast } from '@/components/Toast';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

export default function AdminCategories() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { toasts, removeToast, success, error, info } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      error('Erreur', 'Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        fetchCategories();
        resetForm();
        setShowModal(false);
        success(
          editingCategory ? 'Catégorie modifiée !' : 'Catégorie créée !',
          editingCategory 
            ? `${formData.name} a été mise à jour avec succès`
            : `${formData.name} a été ajoutée au catalogue`
        );
      } else {
        error('Erreur', data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      error('Erreur', 'Impossible d\'enregistrer la catégorie');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: category.image || '',
    });
    setShowModal(true);
    info('Mode édition', `Modification de "${category.name}"`);
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        success('Catégorie supprimée', `${categoryName} a été retirée`);
      } else {
        error('Erreur', 'Impossible de supprimer la catégorie');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      error('Erreur', 'Une erreur est survenue lors de la suppression');
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      image: '',
    });
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  Gestion des Catégories
                </h1>
                <p className="text-[#6a6a6a]">
                  Organisez vos {categories.length} catégories de produits
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
                  <span className="block font-semibold">Nouvelle Catégorie</span>
                  <span className="block text-sm text-white/80">Créer une catégorie</span>
                </div>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
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
                    placeholder="Rechercher une catégorie..."
                    className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all placeholder:text-[#B6AE9F]"
                  />
                </div>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Réinitialiser
                </button>
              )}
            </div>
            <div className="mt-4 text-sm text-[#6a6a6a]">
              <span className="font-semibold text-[#96A78D]">{filteredCategories.length}</span> catégorie{filteredCategories.length > 1 ? 's' : ''} trouvée{filteredCategories.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent mx-auto"></div>
                <p className="mt-4 text-[#6a6a6a]">Chargement des catégories...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.length > 0 ? filteredCategories.map((category, index) => (
                <div 
                  key={category._id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Container */}
                  <div className="h-48 bg-gradient-to-br from-[#F9F8F6] to-[#ebe7e3] relative overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/50 rounded-2xl flex items-center justify-center">
                          <svg className="w-10 h-10 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-[#4a4a4a] group-hover:text-[#96A78D] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-[#B6AE9F] mt-1 font-mono">
                          /{category.slug}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-[#96A78D]/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-[#F9F8F6]">
                      <button
                        onClick={() => handleEdit(category)}
                        className="flex-1 px-4 py-2.5 bg-[#96A78D]/10 text-[#96A78D] rounded-xl hover:bg-[#96A78D] hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDelete(category._id, category.name)}
                        className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
                        title="Supprimer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-12 text-center">
                    <div className="w-20 h-20 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-[#6a6a6a] text-lg font-medium">Aucune catégorie trouvée</p>
                    <p className="text-[#B6AE9F] mt-1">Essayez de modifier votre recherche</p>
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
        title={editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
        subtitle={editingCategory ? `Modification de "${editingCategory.name}"` : 'Créez une nouvelle catégorie pour vos produits'}
        icon={
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Nom de la catégorie
              </span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all"
              placeholder="Ex: Soins Visage"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Image de la catégorie"
              required
            />
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
                  <span>{editingCategory ? 'Enregistrer' : 'Ajouter'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
