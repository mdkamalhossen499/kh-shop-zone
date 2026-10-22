import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '../types/ecommerce';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { categories, language } = useStore();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const category = categories.find(c => c.id === product.categoryId);
  const discount = product.discountPercentage > 0 ? product.discountPercentage : Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-xl border border-neutral-200/80 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      {/* Visual Image Container (65-75% height) */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden flex items-center justify-center">
        {!imageError && product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400">
            <span className="text-2xl mb-1">✨</span>
            <span className="text-xs font-medium text-neutral-500 text-center line-clamp-1">{product.name}</span>
          </div>
        )}

        {/* Subtle Discount / Tag */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 text-[11px] font-bold tracking-tight bg-neutral-900 text-white px-2 py-0.5 rounded shadow-sm">
            {discount}% OFF
          </span>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold tracking-wider uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white text-neutral-900 text-xs font-semibold rounded-lg hover:bg-neutral-100 transition-colors shadow-md whitespace-nowrap"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'যোগ হয়েছে' : 'Added!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'কার্টে নিন' : 'Quick Add'}</span>
              </>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 bg-white/90 text-neutral-800 rounded-lg hover:bg-white transition-colors shadow-md"
            title="Quick Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
            <span className="font-medium tracking-wide uppercase text-[11px] text-neutral-400">
              {category?.name || 'Collection'}
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-amber-900 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing Baseline with Tabular Figures */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-neutral-900 tabular-nums">
              ৳{product.salePrice.toLocaleString('en-US')}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                ৳{product.regularPrice.toLocaleString('en-US')}
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            {product.stock > 0 ? (language === 'bn' ? 'স্টকে আছে' : 'In Stock') : (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock')}
          </span>
        </div>
      </div>
    </div>
  );
}
