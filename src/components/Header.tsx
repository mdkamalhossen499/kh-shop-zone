import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, Phone, Menu, X, ArrowRight, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAdmin: () => void;
}

export function Header({ currentView, setCurrentView, searchQuery, setSearchQuery, onOpenAdmin }: HeaderProps) {
  const { settings, categories, language, setLanguage } = useStore();
  const { itemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const siteName = settings?.siteName || 'KH SHOP ZONE';
  const showAnnouncement = settings?.showAnnouncement && !announcementDismissed;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* 1. Slim Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-neutral-900 text-neutral-100 text-xs py-1.5 px-4 flex items-center justify-between border-b border-neutral-800">
          <div className="mx-auto flex items-center gap-2 text-center text-xs font-medium">
            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate max-w-xs sm:max-w-md md:max-w-xl">
              {settings?.announcement || 'Free Delivery inside Dhaka on orders over ৳2,000! Cash on Delivery Available.'}
            </span>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss announcement"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 2. Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links) — Zone 3 (Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-base tracking-wider group-hover:bg-neutral-800 transition-colors shadow-sm">
              KH
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-neutral-900 font-display whitespace-nowrap">
                {siteName}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Official BD Store
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Concise Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => setCurrentView('home')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
              currentView === 'home' ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900 pb-0.5' : ''
            }`}
          >
            {language === 'bn' ? 'হোম' : 'Home'}
          </button>

          <button
            onClick={() => setCurrentView('shop')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
              currentView === 'shop' ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900 pb-0.5' : ''
            }`}
          >
            {language === 'bn' ? 'সব পণ্য' : 'Shop All'}
          </button>

          <button
            onClick={() => setCurrentView('categories')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
              currentView === 'categories' ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900 pb-0.5' : ''
            }`}
          >
            {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
          </button>

          <button
            onClick={() => setCurrentView('track')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
              currentView === 'track' ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900 pb-0.5' : ''
            }`}
          >
            {language === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order'}
          </button>

          <button
            onClick={() => setCurrentView('about')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
              currentView === 'about' ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900 pb-0.5' : ''
            }`}
          >
            {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </button>
        </nav>

        {/* Zone 3: Search, Language & Shopping Bag Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Trigger */}
          <div className="relative hidden lg:block w-48 xl:w-64">
            <input
              type="text"
              placeholder={language === 'bn' ? 'পণ্য সার্চ করুন...' : 'Search products...'}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (currentView !== 'shop') setCurrentView('shop');
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={() => setShowSearchModal(true)}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="text-xs font-semibold px-2 py-1 rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors whitespace-nowrap"
            title="Toggle Language"
          >
            {language === 'en' ? 'বাং' : 'EN'}
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all shadow-sm whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">
              {language === 'bn' ? 'কার্ট' : 'Cart'}
            </span>
            {itemCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-amber-400 text-neutral-950 rounded-full tabular-nums">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder={language === 'bn' ? 'পণ্য সার্চ করুন...' : 'Search products...'}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (currentView !== 'shop') setCurrentView('shop');
              }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-100 border border-neutral-200 rounded-lg focus:outline-none focus:bg-white"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => {
                setCurrentView('home');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 text-neutral-800"
            >
              🏠 {language === 'bn' ? 'হোম' : 'Home'}
            </button>
            <button
              onClick={() => {
                setCurrentView('shop');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 text-neutral-800"
            >
              🛍️ {language === 'bn' ? 'সব পণ্য' : 'Shop All'}
            </button>
            <button
              onClick={() => {
                setCurrentView('categories');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 text-neutral-800"
            >
              📂 {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
            </button>
            <button
              onClick={() => {
                setCurrentView('track');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 text-neutral-800"
            >
              📍 {language === 'bn' ? 'ট্র্যাক অর্ডার' : 'Track Order'}
            </button>
            <button
              onClick={() => {
                setCurrentView('about');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 text-neutral-800"
            >
              ℹ️ {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </button>
            <button
              onClick={() => {
                setCurrentView('contact');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 text-neutral-800"
            >
              📞 {language === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Customer Help: {settings?.contactPhone}</span>
            <button
              onClick={() => {
                onOpenAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="text-neutral-600 hover:text-neutral-900 font-medium underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-4 border border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-neutral-900">Search KH SHOP ZONE</span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search perfumes, sarees, panjabi, gadgets..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentView('shop');
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') setShowSearchModal(false);
                }}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-neutral-100 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="text-neutral-400 py-1">Popular:</span>
              {['Arabian Oud', 'Silk Panjabi', 'Organza Saree', 'Glow Serum', 'AirPods'].map(term => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setCurrentView('shop');
                    setShowSearchModal(false);
                  }}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
