'use client';

import { useCart } from '@/context/CartContext';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const getItemPrice = (item: typeof items[0]) => {
    return item.isPromotion && item.promotionPercentage
      ? item.price * (1 - item.promotionPercentage / 100)
      : item.price;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F8F6] to-white pt-24">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl shadow-xl border border-[#E8E4E0] p-12">
            <div className="w-24 h-24 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-12 h-12 text-[#96A78D]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#4a4a4a] mb-3">
              Votre panier est vide
            </h1>
            <p className="text-[#6a6a6a] mb-8">
              Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#96A78D] text-white font-semibold rounded-full hover:bg-[#7d9175] transition-all duration-300 shadow-lg shadow-[#96A78D]/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Découvrir nos produits
            </Link>
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
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Mon Panier</h1>
          <p className="text-[#6a6a6a] mt-1">{items.length} article{items.length > 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div ref={containerRef} className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-[#E8E4E0] hover:shadow-md transition-shadow"
              >
                <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#F9F8F6] to-[#E8E4E0]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                  {item.isPromotion && (
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{item.promotionPercentage}%
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item._id}`}
                    className="font-semibold text-[#4a4a4a] hover:text-[#96A78D] transition-colors line-clamp-2 text-lg"
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-center gap-3 mt-3">
                    {item.isPromotion ? (
                      <>
                        <span className="text-xl font-bold text-[#96A78D]">
                          {getItemPrice(item).toFixed(2)} DT
                        </span>
                        <span className="text-sm text-[#9a9a9a] line-through">
                          {item.price.toFixed(2)} DT
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-[#4a4a4a]">
                        {item.price.toFixed(2)} DT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-[#F9F8F6] rounded-xl border border-[#E8E4E0]">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-[#4a4a4a] hover:bg-[#E8E4E0] transition-colors rounded-l-xl"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-12 text-center text-[#4a4a4a] font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-[#4a4a4a] hover:bg-[#E8E4E0] transition-colors rounded-r-xl"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold text-[#4a4a4a]">
                    {(getItemPrice(item) * item.quantity).toFixed(2)} DT
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors mt-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Vider le panier
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-[#E8E4E0] p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#4a4a4a] mb-6">
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#6a6a6a]">
                  <span>Sous-total ({items.length} articles)</span>
                  <span className="font-medium text-[#4a4a4a]">{getTotal().toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between text-[#6a6a6a]">
                  <span>Livraison</span>
                  <span className={`font-medium ${getTotal() >= 49 ? 'text-[#96A78D]' : 'text-[#4a4a4a]'}`}>
                    {getTotal() >= 49 ? 'Gratuite' : '4.99 DT'}
                  </span>
                </div>
                {getTotal() < 49 && (
                  <div className="bg-[#96A78D]/10 rounded-xl p-3">
                    <p className="text-sm text-[#96A78D] flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Plus que {(49 - getTotal()).toFixed(2)} DT pour la livraison gratuite!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#E8E4E0] pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-[#4a4a4a]">
                  <span>Total</span>
                  <span>
                    {(getTotal() + (getTotal() >= 49 ? 0 : 4.99)).toFixed(2)} DT
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#96A78D] text-white font-semibold rounded-xl hover:bg-[#7d9175] transition-all duration-300 shadow-lg shadow-[#96A78D]/25"
              >
                <span>Passer la commande</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full mt-4 text-[#6a6a6a] hover:text-[#96A78D] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continuer mes achats
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-[#E8E4E0]">
                <div className="grid grid-cols-2 gap-3 text-xs text-[#6a6a6a]">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Paiement sécurisé
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#96A78D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    Livraison rapide
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
