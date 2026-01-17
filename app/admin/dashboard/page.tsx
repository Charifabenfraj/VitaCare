'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StatsData {
  overview: {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalRevenue: number;
    promotionProducts: number;
    packProducts: number;
  };
  ordersByStatus: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
  };
  recentOrders: Array<{
    _id: string;
    customerName: string;
    email: string;
    totalPrice: number;
    status: string;
    createdAt: string;
  }>;
  bestSellers: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    stock: number;
  }>;
}

const defaultStats: StatsData = {
  overview: {
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    promotionProducts: 0,
    packProducts: 0,
  },
  ordersByStatus: {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
  },
  recentOrders: [],
  bestSellers: [],
  lowStockProducts: [],
};

// Simple Pie Chart Component
const PieChart = ({ data, colors, size = 160 }: { data: number[], colors: string[], size?: number }) => {
  const total = data.reduce((a, b) => a + b, 0);
  if (total === 0) return null;
  
  let currentAngle = -90;
  const radius = size / 2;
  const center = size / 2;
  
  const createArc = (startAngle: number, endAngle: number, color: string) => {
    const start = ((startAngle) * Math.PI) / 180;
    const end = ((endAngle) * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return (
      <path
        key={`${startAngle}-${endAngle}`}
        d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
        fill={color}
        className="transition-all duration-300 hover:opacity-80"
      />
    );
  };

  const arcs = data.map((value, index) => {
    if (value === 0) return null;
    const angle = (value / total) * 360;
    const arc = createArc(currentAngle, currentAngle + angle, colors[index]);
    currentAngle += angle;
    return arc;
  });

  return (
    <svg width={size} height={size} className="drop-shadow-lg">
      {arcs}
      <circle cx={center} cy={center} r={radius * 0.5} fill="white" />
    </svg>
  );
};

// Mini Calendar Component
const MiniCalendar = () => {
  const [currentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === currentDate.getDate();
    days.push(
      <div
        key={i}
        className={`h-8 w-8 flex items-center justify-center text-sm rounded-lg transition-all ${
          isToday 
            ? 'bg-[#96A78D] text-white font-bold shadow-md' 
            : 'text-[#4a4a4a] hover:bg-[#96A78D]/10'
        }`}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#4a4a4a]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="w-8 h-8 bg-[#96A78D]/10 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-[#B6AE9F]">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};

// Bar Chart Component
const BarChart = ({ data, labels, color = '#96A78D' }: { data: number[], labels: string[], color?: string }) => {
  const maxValue = Math.max(...data, 1);
  
  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
            style={{ 
              height: `${(value / maxValue) * 100}%`,
              background: `linear-gradient(to top, ${color}, ${color}dd)`,
              minHeight: value > 0 ? '8px' : '0'
            }}
          />
          <span className="text-xs text-[#6a6a6a] truncate w-full text-center">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [stats, setStats] = useState<StatsData>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const result = await response.json();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
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

  const statusConfig = {
    pending: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'En attente' },
    confirmed: { color: 'text-sky-700', bg: 'bg-sky-100', label: 'Confirmée' },
    shipped: { color: 'text-violet-700', bg: 'bg-violet-100', label: 'Expédiée' },
    delivered: { color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Livrée' },
    cancelled: { color: 'text-rose-700', bg: 'bg-rose-100', label: 'Annulée' },
  };

  // Calculate order status percentages for pie chart
  const orderStatusData = [
    stats.ordersByStatus.pending,
    stats.ordersByStatus.confirmed,
    stats.ordersByStatus.shipped,
    stats.ordersByStatus.delivered,
  ];
  const orderStatusColors = ['#fbbf24', '#38bdf8', '#a78bfa', '#34d399'];
  const orderStatusLabels = ['En attente', 'Confirmées', 'Expédiées', 'Livrées'];

  // Product distribution data
  const productDistribution = [
    stats.overview.totalProducts - stats.overview.promotionProducts - stats.overview.packProducts,
    stats.overview.promotionProducts,
    stats.overview.packProducts,
  ];
  const productColors = ['#96A78D', '#fb923c', '#a78bfa'];
  const productLabels = ['Standards', 'Promotions', 'Packs'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] via-[#f5f3f0] to-[#ebe7e3]">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#96A78D]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D9CFC7]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4a4a4a] mb-2">Tableau de bord</h1>
          <p className="text-[#6a6a6a]">Bienvenue ! Voici un aperçu de votre activité</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#96A78D] border-t-transparent mx-auto"></div>
              <p className="mt-4 text-[#6a6a6a]">Chargement des statistiques...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#B6CEB4] to-[#96A78D] rounded-2xl flex items-center justify-center shadow-lg shadow-[#96A78D]/20">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#4a4a4a]">{stats.overview.totalProducts}</p>
                    <p className="text-sm text-[#6a6a6a]">Total Produits</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F9F8F6]">
                  <span className="text-sm text-[#96A78D] font-medium">{stats.overview.promotionProducts} en promotion</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-300 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#4a4a4a]">{stats.overview.totalOrders}</p>
                    <p className="text-sm text-[#6a6a6a]">Commandes</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F9F8F6]">
                  <span className="text-sm text-amber-600 font-medium">{stats.ordersByStatus.pending} en attente</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#4a4a4a]">{stats.overview.totalRevenue.toFixed(0)}</p>
                    <p className="text-sm text-[#6a6a6a]">Revenus (DT)</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F9F8F6]">
                  <span className="text-sm text-emerald-600 font-medium">↑ Chiffre d&apos;affaires</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-300 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#4a4a4a]">{stats.overview.totalCategories}</p>
                    <p className="text-sm text-[#6a6a6a]">Catégories</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F9F8F6]">
                  <span className="text-sm text-violet-600 font-medium">{stats.overview.packProducts} packs</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Order Status Pie Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#4a4a4a]">Statuts des Commandes</h3>
                </div>
                <div className="flex flex-col items-center">
                  <PieChart data={orderStatusData} colors={orderStatusColors} size={140} />
                  <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                    {orderStatusLabels.map((label, index) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: orderStatusColors[index] }} />
                        <span className="text-sm text-[#6a6a6a]">{label}</span>
                        <span className="text-sm font-bold text-[#4a4a4a] ml-auto">{orderStatusData[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Distribution */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#96A78D]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#4a4a4a]">Distribution Produits</h3>
                </div>
                <div className="flex flex-col items-center">
                  <PieChart data={productDistribution} colors={productColors} size={140} />
                  <div className="grid grid-cols-1 gap-3 mt-6 w-full">
                    {productLabels.map((label, index) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: productColors[index] }} />
                        <span className="text-sm text-[#6a6a6a]">{label}</span>
                        <span className="text-sm font-bold text-[#4a4a4a] ml-auto">{productDistribution[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <MiniCalendar />
            </div>

            {/* Best Sellers Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#96A78D]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#4a4a4a]">Meilleurs Vendeurs</h3>
                </div>
                {stats.bestSellers.length > 0 ? (
                  <>
                    <BarChart 
                      data={stats.bestSellers.slice(0, 5).map(p => p.quantity)}
                      labels={stats.bestSellers.slice(0, 5).map(p => p.name.slice(0, 8))}
                      color="#96A78D"
                    />
                    <div className="mt-6 space-y-3">
                      {stats.bestSellers.slice(0, 3).map((product, index) => (
                        <div key={product.productId} className="flex items-center gap-3 p-3 bg-[#F9F8F6] rounded-xl">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-[#96A78D]' : index === 1 ? 'bg-[#B6AE9F]' : 'bg-[#D9CFC7]'
                          }`}>
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#4a4a4a] truncate">{product.name}</p>
                            <p className="text-sm text-[#6a6a6a]">{product.quantity} vendus</p>
                          </div>
                          <p className="font-bold text-[#96A78D]">{product.revenue.toFixed(0)} DT</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-[#6a6a6a]">
                    <svg className="w-12 h-12 mx-auto text-[#B6AE9F] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>Aucune vente enregistrée</p>
                  </div>
                )}
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#4a4a4a]">Alertes de Stock</h3>
                  {stats.lowStockProducts.length > 0 && (
                    <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      {stats.lowStockProducts.length} alertes
                    </span>
                  )}
                </div>
                {stats.lowStockProducts.length > 0 ? (
                  <div className="space-y-3">
                    {stats.lowStockProducts.map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <p className="font-medium text-[#4a4a4a]">{product.name}</p>
                        </div>
                        <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-bold">
                          {product.stock} restants
                        </span>
                      </div>
                    ))}
                    <Link href="/admin/products" className="block text-center text-sm text-[#96A78D] hover:underline mt-4">
                      Gérer le stock →
                    </Link>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[#6a6a6a]">Tous les stocks sont suffisants</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#4a4a4a]">Commandes Récentes</h3>
                </div>
                <Link href="/admin/orders" className="px-4 py-2 bg-[#96A78D]/10 text-[#96A78D] rounded-lg hover:bg-[#96A78D] hover:text-white transition-all text-sm font-medium">
                  Voir tout →
                </Link>
              </div>
              {stats.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#F9F8F6]">
                        <th className="text-left py-3 px-4 text-[#6a6a6a] text-sm font-semibold">Client</th>
                        <th className="text-left py-3 px-4 text-[#6a6a6a] text-sm font-semibold">Email</th>
                        <th className="text-left py-3 px-4 text-[#6a6a6a] text-sm font-semibold">Total</th>
                        <th className="text-left py-3 px-4 text-[#6a6a6a] text-sm font-semibold">Statut</th>
                        <th className="text-left py-3 px-4 text-[#6a6a6a] text-sm font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => {
                        const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                        return (
                          <tr key={order._id} className="border-b border-[#F9F8F6] hover:bg-[#F9F8F6]/50 transition-colors">
                            <td className="py-4 px-4">
                              <span className="font-medium text-[#4a4a4a]">{order.customerName}</span>
                            </td>
                            <td className="py-4 px-4 text-sm text-[#6a6a6a]">{order.email}</td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-[#96A78D]">{order.totalPrice.toFixed(2)} DT</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${status.bg} ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-[#6a6a6a]">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-[#6a6a6a]">
                  <svg className="w-12 h-12 mx-auto text-[#B6AE9F] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p>Aucune commande récente</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <Link href="/admin/products" className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-[#96A78D]/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#96A78D] transition-colors">
                  <svg className="w-6 h-6 text-[#96A78D] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-semibold text-[#4a4a4a]">Ajouter Produit</p>
                <p className="text-sm text-[#6a6a6a]">Nouveau au catalogue</p>
              </Link>

              <Link href="/admin/categories" className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-violet-500 transition-colors">
                  <svg className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="font-semibold text-[#4a4a4a]">Catégories</p>
                <p className="text-sm text-[#6a6a6a]">Gérer les catégories</p>
              </Link>

              <Link href="/admin/promotions" className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-[#D9CFC7]/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#D9CFC7] transition-colors">
                  <svg className="w-6 h-6 text-[#6a6a6a] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <p className="font-semibold text-[#4a4a4a]">Promotions</p>
                <p className="text-sm text-[#6a6a6a]">Gérer les offres</p>
              </Link>

              <Link href="/admin/orders" className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white p-5 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-sky-500 transition-colors">
                  <svg className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="font-semibold text-[#4a4a4a]">Commandes</p>
                <p className="text-sm text-[#6a6a6a]">Voir les commandes</p>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
