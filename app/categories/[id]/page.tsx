'use client';

import { AnimatedSection, ProductCard } from '@/components';
import { CategoryType, ProductType } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productsRes] = await Promise.all([
          fetch(`/api/categories/${params.id}`),
          fetch(`/api/products?categoryId=${params.id}`),
        ]);

        const categoryData = await categoryRes.json();
        const productsData = await productsRes.json();

        if (categoryData.success) setCategory(categoryData.data);
        if (productsData.success) setProducts(productsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-[#4a4a4a] mb-4">
          Catégorie non trouvée
        </h1>
        <Link href="/categories" className="btn btn-primary">
          Retour aux catégories
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-[#6a6a6a]">
          <li>
            <Link href="/" className="hover:text-[#96A78D] transition-colors">
              Accueil
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/categories" className="hover:text-[#96A78D] transition-colors">
              Catégories
            </Link>
          </li>
          <li>/</li>
          <li className="text-[#4a4a4a] font-medium">{category.name}</li>
        </ol>
      </nav>

      <AnimatedSection>
        {/* Category Header */}
        <div
          className="relative h-64 rounded-2xl overflow-hidden mb-12"
          style={{
            backgroundImage: `url(${category.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {category.name}
            </h1>
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#4a4a4a] mb-6">
            Produits dans cette catégorie ({products.length})
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#D9CFC7] rounded-2xl">
            <p className="text-[#6a6a6a] text-lg mb-4">
              Aucun produit disponible dans cette catégorie.
            </p>
            <Link href="/products" className="btn btn-primary">
              Voir tous les produits
            </Link>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
