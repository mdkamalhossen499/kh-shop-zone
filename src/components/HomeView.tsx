import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Flame, Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types/ecommerce';

interface HomeViewProps {
  onQuickView: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateToShop: () => void;
}

export function HomeView({ onQuickView, onSelectCategory, onNavigateToShop }: HomeViewProps) {
  const { products, categories, settings, language } = useStore();
  const { recentlyViewed } = useCart();

  const [activeTab, setActiveTab] = useState<string>('all');

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured);
  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const bestSellers = products.filter(p => p.isBestSeller);

  // Tab filtered products
  const tabFilteredProducts = activeTab === 'all'
    ? featuredProducts
    : products.filter(p => p.categoryId === activeTab);

  // Dynamic Hero Banner from Settings
  const heroBanner = settings?.heroBanner;
  const heroBadge = heroBanner?.badgeText || '100% Authentic Luxury & Daily Lifestyle';
  const heroTitle = heroBanner?.title || 'Elevate Your Lifestyle with KH SHOP ZONE';
  const heroSubtitle = heroBanner?.subtitle || 'Authentic Arabian Oud, Designer Festive Silk Panjabis & Sarees, Clinical Skincare, and Modern Gadgets — delivered directly to your doorstep with Cash on Delivery nationwide.';
  const heroImage = heroBanner?.imageUrl || '/src/assets/images/hero_kh_shop_zone_1792643165977.jpg';

  const primaryBtnText = heroBanner?.primaryBtnText || (language === 'bn' ? 'সব পণ্য দেখুন' : 'Explore Collections');
  const handlePrimaryHeroAction = () => {
    const link = heroBanner?.primaryBtnLink || 'shop';
    if (!link || link === 'shop') {
      onNavigateToShop();
    } else if (categories.some(c => c.id === link)) {
      onSelectCategory(link);
    } else if (link.startsWith('http://') || link.startsWith('https://')) {
      window.location.href = link;
    } else {
      onNavigateToShop();
    }
  };

  const secondaryBtnText = heroBanner?.secondaryBtnText !== undefined
    ? heroBanner.secondaryBtnText
    : (language === 'bn' ? 'পারফিউম কালেকশন' : 'Arabian Perfumes');

  const handleSecondaryHeroAction = () => {
    const link = heroBanner?.secondaryBtnLink || 'cat_perfumes';
    if (link === 'shop') {
      onNavigateToShop();
    } else if (categories.some(c => c.id === link)) {
      onSelectCategory(link);
    } else if (link.startsWith('http://') || link.startsWith('https://')) {
      window.location.href = link;
    } else {
      onSelectCategory('cat_perfumes');
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. STOREFRONT HERO CAMPAIGN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl min-h-[440px] md:min-h-[500px] flex items-center">
          {/* Background Photography with Scrim */}
          <img
            src={heroImage}
            alt={heroTitle}
            className="absolute inset-0 w-full h-full object-cover opacity-45 sm:opacity-50 object-center transition-all duration-500"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/70 to-transparent" />

          {/* Hero Copy Content */}
          <div className="relative z-10 max-w-2xl p-6 sm:p-12 md:p-16 text-white space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight leading-[1.15] text-balance">
              {heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handlePrimaryHeroAction}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 group"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {secondaryBtnText && (
                <button
                  onClick={handleSecondaryHeroAction}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-md border border-white/20 transition-colors"
                >
                  {secondaryBtnText}
                </button>
              )}
            </div>

            {/* Quick Metrics Bar below CTA */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-6 text-[11px] text-neutral-300">
              <div>
                <strong className="text-white block text-xs">64 Districts</strong>
                <span>Full Delivery Coverage</span>
              </div>
              <span className="text-neutral-600">|</span>
              <div>
                <strong className="text-white block text-xs">Cash on Delivery</strong>
                <span>Pay After Inspection</span>
              </div>
              <span className="text-neutral-600">|</span>
              <div>
                <strong className="text-white block text-xs">7-Day Guarantee</strong>
                <span>Easy Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
              {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Browse Categories'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Explore our 10 curated collections</p>
          </div>
          <button
            onClick={onNavigateToShop}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map(cat => {
            const productCount = products.filter(p => p.categoryId === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group p-4 bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-400 hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center font-bold text-base mb-3">
                  {cat.id === 'cat_perfumes' ? '💎' :
                   cat.id === 'cat_womens_fashion' ? '👗' :
                   cat.id === 'cat_mens_fashion' ? '👔' :
                   cat.id === 'cat_beauty_skincare' ? '✨' :
                   cat.id === 'cat_health_care' ? '🌿' :
                   cat.id === 'cat_electronics' ? '⚡' :
                   cat.id === 'cat_home_kitchen' ? '🍳' :
                   cat.id === 'cat_footwear' ? '👞' :
                   cat.id === 'cat_bags_accessories' ? '👜' : '📦'}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    {productCount} items
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FLASH SALE SECTION WITH LIVE COUNTDOWN */}
      {flashSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-4 sm:p-6 text-white mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display leading-tight">
                  {language === 'bn' ? 'ফ্ল্যাশ সেল অফার — ২৫% পর্যন্ত ছাড়' : 'Limited-Time Flash Deals'}
                </h2>
                <p className="text-xs text-amber-100">Handpicked luxury items with instant discounts</p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">Ends In:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm">
                <span className="px-2 py-1 bg-black/30 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="px-2 py-1 bg-black/30 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="px-2 py-1 bg-black/30 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {flashSaleProducts.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. FEATURED PRODUCTS WITH SEGMENTED TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
              {language === 'bn' ? 'বিশেষ পণ্য সমূহ' : 'Featured Collections'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Verified quality, hand-picked for Bangladesh</p>
          </div>

          {/* Interactive Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Featured
            </button>
            <button
              onClick={() => setActiveTab('cat_perfumes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'cat_perfumes'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Perfumes
            </button>
            <button
              onClick={() => setActiveTab('cat_womens_fashion')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'cat_womens_fashion'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Women's Wear
            </button>
            <button
              onClick={() => setActiveTab('cat_mens_fashion')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'cat_mens_fashion'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Men's Panjabi
            </button>
            <button
              onClick={() => setActiveTab('cat_beauty_skincare')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'cat_beauty_skincare'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Skincare
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {tabFilteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
              {language === 'bn' ? 'বেস্ট সেলার' : 'Customer Best Sellers'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Our most loved customer favorites</p>
          </div>
          <button
            onClick={onNavigateToShop}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 underline flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 6. RECENTLY VIEWED PRODUCTS (if any) */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-neutral-200 pt-8">
            <h3 className="text-lg font-bold text-neutral-900 font-display mb-4">
              Recently Viewed Products
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-50 rounded-3xl border border-neutral-200 p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Trusted By Shoppers</span>
            <h2 className="text-2xl font-bold text-neutral-900 font-display mt-1">
              What Our Customers Say
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Real feedback from verified orders across Bangladesh</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic">
                "Ordered the Royal Oud perfume and received it in Banani within 24 hours. The packaging was immaculate and the fragrance lasts all day. Highly trustworthy store!"
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-900">Kazi Mahbub</span>
                <span className="text-emerald-600 font-medium text-[11px]">✓ Verified Buyer (Dhaka)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic">
                "The Mulberry silk panjabi exceeded my expectations. Size 40 was exact fit. Paid via bKash and admin verified my TrxID smoothly."
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-900">Shahriar Kabir</span>
                <span className="text-emerald-600 font-medium text-[11px]">✓ Verified Buyer (Chittagong)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic">
                "The organza saree is lightweight, delicate, and looks stunning. Cash on Delivery gave complete peace of mind. Will purchase again!"
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-900">Nusrat Jahan</span>
                <span className="text-emerald-600 font-medium text-[11px]">✓ Verified Buyer (Sylhet)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
