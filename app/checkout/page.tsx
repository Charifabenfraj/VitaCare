'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [wantsNotifications, setWantsNotifications] = useState(true);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push('/cart');
    }
  }, [items, router, success]);

  const getItemPrice = (item: typeof items[0]) => {
    return item.isPromotion && item.promotionPercentage
      ? item.price * (1 - item.promotionPercentage / 100)
      : item.price;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        productId: item._id,
        name: item.name,
        price: getItemPrice(item),
        quantity: item.quantity,
      }));

      const totalPrice = getTotal() + (getTotal() >= 49 ? 0 : 4.99);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: orderItems,
          totalPrice,
          wantsNotifications,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        clearCart();
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch {
      setError('Une erreur est survenue lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F8F6] to-white pt-24">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl shadow-xl border border-[#E8E4E0] p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-[#96A78D] to-[#7d9175] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#96A78D]/30">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#4a4a4a] mb-4">
              Commande confirmée! 🎉
            </h1>
            <p className="text-[#6a6a6a] mb-2">
              Merci pour votre confiance.
            </p>
            <p className="text-[#6a6a6a] mb-6">
              Un email de confirmation a été envoyé à <span className="font-semibold text-[#96A78D]">{formData.email}</span>
            </p>
            
            {wantsNotifications && (
              <div className="bg-[#96A78D]/10 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-center gap-2 text-[#96A78D]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="font-medium">Notifications activées</span>
                </div>
                <p className="text-sm text-[#6a6a6a] mt-2">
                  Vous recevrez des mises à jour sur le statut de votre commande par email.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#96A78D] text-white font-semibold rounded-xl hover:bg-[#7d9175] transition-all shadow-lg shadow-[#96A78D]/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Retour à l&apos;accueil
              </Link>
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#96A78D] text-[#96A78D] font-semibold rounded-xl hover:bg-[#96A78D]/10 transition-all"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F8F6] to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-[#6a6a6a] hover:text-[#96A78D] transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au panier
          </Link>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Finaliser ma commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4E0] p-6">
                <h2 className="text-lg font-bold text-[#4a4a4a] mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#96A78D] text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Informations de contact
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-[#4a4a4a] mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      placeholder="Mohamed Ben Ali"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E4E0] bg-[#F9F8F6] focus:ring-2 focus:ring-[#96A78D] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#4a4a4a] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E4E0] bg-[#F9F8F6] focus:ring-2 focus:ring-[#96A78D] focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-[#9a9a9a] mt-1">
                      Vous recevrez la confirmation de commande à cette adresse
                    </p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#4a4a4a] mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E4E0] bg-[#F9F8F6] focus:ring-2 focus:ring-[#96A78D] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4E0] p-6">
                <h2 className="text-lg font-bold text-[#4a4a4a] mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#96A78D] text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Adresse de livraison
                </h2>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-[#4a4a4a] mb-2">
                    Adresse complète *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Rue, numéro, ville, code postal..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E4E0] bg-[#F9F8F6] focus:ring-2 focus:ring-[#96A78D] focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              {/* Notifications Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4E0] p-6">
                <h2 className="text-lg font-bold text-[#4a4a4a] mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#96A78D] text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Notifications
                </h2>
                
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={wantsNotifications}
                      onChange={(e) => setWantsNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-6 border-2 border-[#D9CFC7] rounded-lg peer-checked:bg-[#96A78D] peer-checked:border-[#96A78D] transition-all">
                      {wantsNotifications && (
                        <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-[#4a4a4a] group-hover:text-[#96A78D] transition-colors">
                      Recevoir les notifications par email
                    </span>
                    <p className="text-sm text-[#6a6a6a] mt-1">
                      Soyez informé à chaque étape : confirmation de commande, préparation, expédition et livraison.
                    </p>
                  </div>
                </label>

                <div className="mt-4 bg-[#96A78D]/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#96A78D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-[#6a6a6a]">
                      <p className="font-medium text-[#4a4a4a]">Votre email est sécurisé</p>
                      <p>Nous ne partageons jamais vos informations avec des tiers. Vous pouvez vous désabonner à tout moment.</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#96A78D] text-white font-semibold rounded-xl hover:bg-[#7d9175] transition-all duration-300 shadow-lg shadow-[#96A78D]/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Confirmer la commande</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-[#E8E4E0] p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#4a4a4a] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Votre commande
              </h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3 p-3 bg-[#F9F8F6] rounded-xl">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                      {item.isPromotion && (
                        <div className="absolute -top-1 -left-1 bg-gradient-to-r from-orange-400 to-red-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          -{item.promotionPercentage}%
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#4a4a4a] line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#6a6a6a] mt-1">
                        Qté: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-[#4a4a4a]">
                      {(getItemPrice(item) * item.quantity).toFixed(2)} DT
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8E4E0] pt-4 space-y-3">
                <div className="flex justify-between text-[#6a6a6a]">
                  <span>Sous-total</span>
                  <span className="font-medium text-[#4a4a4a]">{getTotal().toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between text-[#6a6a6a]">
                  <span>Livraison</span>
                  <span className={`font-medium ${getTotal() >= 49 ? 'text-[#96A78D]' : 'text-[#4a4a4a]'}`}>
                    {getTotal() >= 49 ? 'Gratuite' : '4.99 DT'}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E8E4E0] mt-4 pt-4">
                <div className="flex justify-between text-xl font-bold text-[#4a4a4a]">
                  <span>Total</span>
                  <span className="text-[#96A78D]">
                    {(getTotal() + (getTotal() >= 49 ? 0 : 4.99)).toFixed(2)} DT
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-[#E8E4E0]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#6a6a6a]">
                    <div className="w-10 h-10 bg-[#96A78D]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#4a4a4a]">Paiement sécurisé</p>
                      <p className="text-xs">Paiement à la livraison disponible</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#6a6a6a]">
                    <div className="w-10 h-10 bg-[#96A78D]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#4a4a4a]">Livraison rapide</p>
                      <p className="text-xs">2-5 jours ouvrables</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
