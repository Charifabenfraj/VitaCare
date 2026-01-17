'use client';

import { useCart } from '@/context/CartContext';
import { ProductType } from '@/types';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface ProductCardProps {
  product: ProductType;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const discountedPrice = product.isPromotion && product.promotionPercentage
    ? product.price * (1 - product.promotionPercentage / 100)
    : product.price;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        y: -8,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Entry animation
    gsap.fromTo(
      card,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.08,
        ease: 'power3.out',
      }
    );

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [index]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);

    // Button animation
    const button = e.currentTarget;
    gsap.fromTo(
      button,
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      }
    );
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#E8E4E0] hover:border-[#96A78D]/30 transition-colors"
    >
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F9F8F6] to-[#E8E4E0]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 hover:scale-110"
            priority={index < 4}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isPromotion && (
              <span className="bg-gradient-to-r from-[#96A78D] to-[#B6CEB4] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                -{product.promotionPercentage}%
              </span>
            )}
            {product.isPack && (
              <span className="bg-gradient-to-r from-[#D9CFC7] to-[#B6AE9F] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Pack
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Plus que {product.stock}!
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">Rupture de stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-[#2d2d2d] mb-2 line-clamp-2 hover:text-[#96A78D] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-[#6a6a6a] mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.isPromotion ? (
              <>
                <span className="text-sm text-[#B6AE9F] line-through">
                  {product.price.toFixed(2)} DT
                </span>
                <span className="text-xl font-bold text-[#96A78D]">
                  {discountedPrice.toFixed(2)} DT
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-[#2d2d2d]">
                {product.price.toFixed(2)} DT
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-3 rounded-full transition-all duration-300 shadow-md ${
              product.stock === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#96A78D] text-white hover:bg-[#7d9175] hover:shadow-lg'
            }`}
            aria-label="Ajouter au panier"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
