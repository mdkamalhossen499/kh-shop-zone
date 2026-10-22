import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Search, X, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types/ecommerce';

interface ShopViewProps {
  initialCategory?: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onQuickView: (product: Product) => void;
}

export function ShopView({ initialCategory, searchQuery, setSearchQuery, onQuickView }: ShopViewProps) {
  const { products, categories, language } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  // Update if initialCategory changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
      );
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Max Price filter
    result = result.filter(p => p.salePrice <= maxPrice);

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, inStockOnly, maxPrice, sortBy]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setMaxPrice(10000);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Category Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
            {activeCategoryObj ? activeCategoryObj.name : 'All Products Catalog'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {activeCategoryObj?.description || 'Browse all authentic products available for nationwide home delivery.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900"
          >
            <option value="featured">Featured / Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Main Grid with Filter Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </span>
              <button
                onClick={resetAllFilters}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
              >
                Reset
              </button>
            </div>

            {/* Categories Filter */}
            <div>
              <span className="font-semibold text-neutral-800 block mb-2">Category:</span>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[11px] opacity-75">{products.length}</span>
                </button>
                {categories.map(cat => {
                  const count = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-neutral-900 text-white font-semibold'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-[11px] opacity-75 tabular-nums">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="pt-3 border-t border-neutral-200">
              <div className="flex justify-between items-center mb-2 font-semibold text-neutral-800">
                <span>Max Price:</span>
                <span className="font-bold tabular-nums text-neutral-900">৳{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={10000}
                step={250}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-neutral-900"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>৳1,000</span>
                <span>৳10,000</span>
              </div>
            </div>

            {/* Stock Availability */}
            <div className="pt-3 border-t border-neutral-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="rounded border-neutral-300 accent-neutral-900"
                />
                <span className="font-medium text-neutral-700">In-Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Column: Products Results Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Filter Chips */}
          {(selectedCategory !== 'all' || searchQuery || inStockOnly) && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-neutral-400">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-200 text-neutral-800 rounded-md font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-200 text-neutral-800 rounded-md font-medium">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-200 text-neutral-800 rounded-md font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Product Cards Count */}
          <div className="text-xs text-neutral-500 font-medium">
            Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> products
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-base font-bold text-neutral-800 mb-1">No products match your criteria</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
                Try clearing search terms or selecting a different category to view available stock.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
