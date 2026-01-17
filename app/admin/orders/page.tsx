'use client';

import AdminModal from '@/components/admin/AdminModal';
import { ToastContainer, useToast } from '@/components/Toast';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const statusConfig: Record<string, { color: string; bg: string; label: string; iconBg: string }> = {
  pending: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'En attente', iconBg: 'from-amber-200 to-amber-300' },
  confirmed: { color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', label: 'Confirmée', iconBg: 'from-sky-200 to-sky-300' },
  shipped: { color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', label: 'Expédiée', iconBg: 'from-violet-200 to-violet-300' },
  delivered: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', label: 'Livrée', iconBg: 'from-emerald-200 to-emerald-300' },
  cancelled: { color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', label: 'Annulée', iconBg: 'from-rose-200 to-rose-300' },
};

export default function AdminOrders() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { toasts, removeToast, success, error, info, warning } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      error('Erreur', 'Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, orderName: string, newStatus: string, oldStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        const statusInfo = statusConfig[newStatus];
        if (newStatus === 'cancelled') {
          warning('Commande annulée', `La commande de ${orderName} a été annulée`);
        } else if (newStatus === 'delivered') {
          success('Commande livrée !', `La commande de ${orderName} est maintenant livrée`);
        } else {
          info('Statut mis à jour', `Commande: ${statusInfo.label}`);
        }
      } else {
        error('Erreur', 'Impossible de mettre à jour le statut');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      error('Erreur', 'Une erreur est survenue');
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // Stats
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const shippedCount = orders.filter(o => o.status === 'shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#96A78D]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-[#4a4a4a] mb-2">
                  Gestion des Commandes
                </h1>
                <p className="text-[#6a6a6a]">
                  Suivez et gérez vos {orders.length} commandes
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-5 py-3 bg-gradient-to-r from-[#96A78D] to-[#7d9175] text-white rounded-xl">
                  <span className="block text-2xl font-bold">{totalRevenue.toFixed(0)} DT</span>
                  <span className="text-sm text-white/80">Revenus totaux</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => setFilterStatus('pending')}
              className={`cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border-2 p-5 transition-all hover:-translate-y-1 ${filterStatus === 'pending' ? 'border-amber-300' : 'border-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{pendingCount}</p>
                  <p className="text-sm text-[#6a6a6a]">En attente</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setFilterStatus('confirmed')}
              className={`cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border-2 p-5 transition-all hover:-translate-y-1 ${filterStatus === 'confirmed' ? 'border-sky-300' : 'border-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{confirmedCount}</p>
                  <p className="text-sm text-[#6a6a6a]">Confirmées</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setFilterStatus('shipped')}
              className={`cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border-2 p-5 transition-all hover:-translate-y-1 ${filterStatus === 'shipped' ? 'border-violet-300' : 'border-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{shippedCount}</p>
                  <p className="text-sm text-[#6a6a6a]">Expédiées</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setFilterStatus('delivered')}
              className={`cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border-2 p-5 transition-all hover:-translate-y-1 ${filterStatus === 'delivered' ? 'border-emerald-300' : 'border-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4a4a4a]">{deliveredCount}</p>
                  <p className="text-sm text-[#6a6a6a]">Livrées</p>
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
                    placeholder="Rechercher par client, email, téléphone ou ID..."
                    className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all placeholder:text-[#B6AE9F]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-[#F9F8F6] border-2 border-transparent rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all min-w-[160px]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="shipped">Expédiées</option>
                  <option value="delivered">Livrées</option>
                  <option value="cancelled">Annulées</option>
                </select>

                {(searchQuery || filterStatus !== 'all') && (
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
              <span className="font-semibold text-[#96A78D]">{filteredOrders.length}</span> commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent mx-auto"></div>
                <p className="mt-4 text-[#6a6a6a]">Chargement des commandes...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#F9F8F6] to-[#ebe7e3]">
                      <th className="text-left py-4 px-6 text-[#6a6a6a] text-sm font-semibold">Commande</th>
                      <th className="text-left py-4 px-6 text-[#6a6a6a] text-sm font-semibold">Client</th>
                      <th className="text-left py-4 px-6 text-[#6a6a6a] text-sm font-semibold">Total</th>
                      <th className="text-left py-4 px-6 text-[#6a6a6a] text-sm font-semibold">Statut</th>
                      <th className="text-left py-4 px-6 text-[#6a6a6a] text-sm font-semibold">Date</th>
                      <th className="text-left py-4 px-6 text-[#6a6a6a] text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length > 0 ? paginatedOrders.map((order, index) => {
                      const status = statusConfig[order.status] || statusConfig.pending;
                      return (
                        <tr 
                          key={order._id} 
                          className="border-b border-[#F9F8F6] hover:bg-[#F9F8F6]/50 transition-colors"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#96A78D] to-[#7d9175] rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-mono text-sm font-semibold text-[#4a4a4a]">#{order._id.slice(-8)}</p>
                                <p className="text-xs text-[#B6AE9F]">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-[#4a4a4a]">{order.customerName}</p>
                              <p className="text-sm text-[#6a6a6a]">{order.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-lg font-bold text-[#96A78D]">{order.totalPrice.toFixed(2)} DT</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.bg} ${status.color}`}>
                              <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${status.iconBg}`} />
                              {status.label}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="text-sm font-medium text-[#4a4a4a]">
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-xs text-[#B6AE9F]">
                                {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => viewOrderDetails(order)}
                                className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                title="Voir détails"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, order.customerName, e.target.value, order.status)}
                                className="px-3 py-2 bg-[#F9F8F6] border-2 border-transparent rounded-xl text-sm focus:ring-0 focus:border-[#96A78D] transition-all"
                              >
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="shipped">Expédiée</option>
                                <option value="delivered">Livrée</option>
                                <option value="cancelled">Annulée</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={6} className="py-16">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-10 h-10 text-[#B6AE9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <p className="text-[#6a6a6a] text-lg font-medium">Aucune commande trouvée</p>
                            <p className="text-[#B6AE9F] mt-1">Essayez de modifier vos filtres</p>
                          </div>
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
                    Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredOrders.length)} sur {filteredOrders.length} commandes
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

      {/* Order Detail Modal */}
      <AdminModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Commande #${selectedOrder?._id.slice(-8)}`}
        subtitle={selectedOrder ? `Passée le ${new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}` : ''}
        icon={
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F9F8F6] to-[#ebe7e3] rounded-xl">
              <div className="flex items-center gap-3">
                {(() => {
                  const status = statusConfig[selectedOrder.status] || statusConfig.pending;
                  return (
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${status.bg} ${status.color}`}>
                      <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${status.iconBg}`} />
                      {status.label}
                    </span>
                  );
                })()}
              </div>
              <div className="text-right">
                <p className="text-sm text-[#6a6a6a]">Total</p>
                <p className="text-2xl font-bold text-[#96A78D]">{selectedOrder.totalPrice.toFixed(2)} DT</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white border-2 border-[#F9F8F6] rounded-xl p-5">
              <h3 className="font-bold text-[#4a4a4a] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informations Client
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#B6AE9F] uppercase tracking-wide mb-1">Nom</p>
                  <p className="font-medium text-[#4a4a4a]">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#B6AE9F] uppercase tracking-wide mb-1">Email</p>
                  <p className="font-medium text-[#4a4a4a]">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#B6AE9F] uppercase tracking-wide mb-1">Téléphone</p>
                  <p className="font-medium text-[#4a4a4a]">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-[#B6AE9F] uppercase tracking-wide mb-1">Paiement</p>
                  <p className="font-medium text-[#4a4a4a] capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[#B6AE9F] uppercase tracking-wide mb-1">Adresse de livraison</p>
                  <p className="font-medium text-[#4a4a4a]">{selectedOrder.address}, {selectedOrder.city}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-[#4a4a4a] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Articles commandés ({selectedOrder.items.length})
              </h3>
              <div className="border-2 border-[#F9F8F6] rounded-xl overflow-hidden">
                <div className="divide-y divide-[#F9F8F6]">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-[#F9F8F6]/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F9F8F6] rounded-lg flex items-center justify-center text-[#B6AE9F] font-bold">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-medium text-[#4a4a4a]">{item.name}</p>
                          <p className="text-sm text-[#6a6a6a]">{item.price.toFixed(2)} DT / unité</p>
                        </div>
                      </div>
                      <p className="font-bold text-[#96A78D]">{(item.price * item.quantity).toFixed(2)} DT</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gradient-to-r from-[#96A78D] to-[#7d9175] flex items-center justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-xl font-bold text-white">{selectedOrder.totalPrice.toFixed(2)} DT</span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="pt-4 border-t border-[#F9F8F6]">
              <label className="block text-sm font-semibold text-[#4a4a4a] mb-2">
                Mettre à jour le statut
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(selectedOrder._id, selectedOrder.customerName, e.target.value, selectedOrder.status)}
                className="w-full px-4 py-3 bg-white border-2 border-[#D9CFC7] rounded-xl focus:ring-0 focus:border-[#96A78D] transition-all"
              >
                <option value="pending">⏳ En attente</option>
                <option value="confirmed">✓ Confirmée</option>
                <option value="shipped">🚚 Expédiée</option>
                <option value="delivered">✅ Livrée</option>
                <option value="cancelled">✕ Annulée</option>
              </select>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}
