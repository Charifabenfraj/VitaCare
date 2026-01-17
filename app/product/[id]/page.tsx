'use client';

import { AnimatedSection, ProductCard } from '@/components';
import { useCart } from '@/context/CartContext';
import { CategoryType, ProductType } from '@/types';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);

          // Fetch related products
          const categoryId = typeof data.data.categoryId === 'object'
            ? data.data.categoryId._id
            : data.data.categoryId;
          
          const relatedRes = await fetch(`/api/products?categoryId=${categoryId}&limit=4`);
          const relatedData = await relatedRes.json();
          if (relatedData.success) {
            setRelatedProducts(
              relatedData.data.filter((p: ProductType) => p._id !== data.data._id).slice(0, 4)
            );
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  useEffect(() => {
    if (!loading && product) {
      // Animate content on load
      gsap.fromTo(
        imageRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo(
        contentRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [loading, product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const discountedPrice = product?.isPromotion && product?.promotionPercentage
    ? product.price * (1 - product.promotionPercentage / 100)
    : product?.price;

  const category = product?.categoryId as CategoryType | undefined;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-[#4a4a4a] mb-4">
          Produit non trouvé
        </h1>
        <Link href="/products" className="btn btn-primary">
          Retour aux produits
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
            <Link href="/products" className="hover:text-[#96A78D] transition-colors">
              Produits
            </Link>
          </li>
          {category && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/categories/${category._id}`}
                  className="hover:text-[#96A78D] transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-[#4a4a4a] font-medium truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div ref={imageRef} className="relative">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#F9F8F6] to-[#E8E4E0]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isPromotion && (
                <span className="bg-[#B6CEB4] text-[#2d4a2d] text-sm font-bold px-4 py-2 rounded-full">
                  -{product.promotionPercentage}%
                </span>
              )}
              {product.isPack && (
                <span className="bg-[#96A78D] text-white text-sm font-bold px-4 py-2 rounded-full">
                  Pack
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex flex-col justify-center">
          {category && (
            <Link
              href={`/categories/${category._id}`}
              className="text-[#96A78D] text-sm font-medium mb-2 hover:underline"
            >
              {category.name}
            </Link>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-[#4a4a4a] mb-4">
            {product.name}
          </h1>

          <p className="text-[#6a6a6a] text-lg mb-6">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-6">
            {product.isPromotion ? (
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#96A78D]">
                  {discountedPrice?.toFixed(2)} DT
                </span>
                <span className="text-xl text-[#9a9a9a] line-through">
                  {product.price.toFixed(2)} DT
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-[#4a4a4a]">
                {product.price.toFixed(2)} DT
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[#4a4a4a] font-medium">Quantité:</span>
            <div className="flex items-center border border-[#D9CFC7] rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-[#4a4a4a] hover:bg-[#D9CFC7] transition-colors rounded-l-lg"
              >
                -
              </button>
              <span className="px-6 py-2 text-[#4a4a4a] font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-[#4a4a4a] hover:bg-[#D9CFC7] transition-colors rounded-r-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full md:w-auto px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
              addedToCart
                ? 'bg-[#B6CEB4] text-[#2d4a2d]'
                : 'bg-[#96A78D] text-white hover:bg-[#7d9175]'
            }`}
          >
            {addedToCart ? '✓ Ajouté au panier' : 'Ajouter au panier'}
          </button>

          {/* Composition */}
          <div className="mt-8 p-6 bg-[#D9CFC7] rounded-2xl">
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-3">
              Composition
            </h3>
            <p className="text-[#6a6a6a]">{product.composition}</p>
          </div>

          {/* Stock info */}
          <div className="mt-4 flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-[#6a6a6a]">
              {product.stock > 0
                ? `En stock (${product.stock} disponibles)`
                : 'Rupture de stock'}
            </span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <AnimatedSection className="border-t border-[#D9CFC7] pt-12">
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-8">
            Produits similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
