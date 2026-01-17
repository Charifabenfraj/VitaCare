'use client';

import { AnimatedSection, ProductCard } from '@/components';
import { ProductType } from '@/types';
import { useEffect, useState } from 'react';

export default function PacksPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await fetch('/api/products?isPack=true');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching packs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection>
        <div className="text-center mb-12">
          <span className="inline-block bg-[#96A78D] text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
            Économisez Plus
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#4a4a4a] mb-4">
            Nos Packs
          </h1>
          <p className="text-[#6a6a6a] max-w-2xl mx-auto">
            Des combinaisons de produits sélectionnés pour un soin complet à prix avantageux
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#6a6a6a] text-lg">
              Aucun pack disponible pour le moment.
            </p>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
