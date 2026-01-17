'use client';

import { CategoryType } from '@/types';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface CategoryCardProps {
  category: CategoryType;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.03,
        y: -5,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
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
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power3.out',
      }
    );

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [index]);

  return (
    <Link
      ref={cardRef}
      href={`/categories/${category._id}`}
      className="block bg-[#D9CFC7] rounded-2xl overflow-hidden shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 hover:scale-110"
          priority={index < 4}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#4a4a4a] text-center">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
