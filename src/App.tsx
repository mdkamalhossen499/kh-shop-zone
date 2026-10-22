import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { CategoriesView } from './components/CategoriesView';
import { TrackOrderView } from './components/TrackOrderView';
import { PolicyPages } from './components/PolicyPages';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminPanel } from './components/AdminPanel';
import { Product, Order } from './types/ecommerce';
import { Wrench, Phone } from 'lucide-react';

function StoreApp() {
  const { settings, isLoading } = useStore();
  const { isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAdmin();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  // Check URL query parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || window.location.pathname === '/admin') {
      setIsAdminOpen(true);
    }
    const trackParam = params.get('track');
    if (trackParam) {
      setTrackingOrderId(trackParam);
      setCurrentView('track');
    }
  }, []);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToShop = () => {
    setSelectedCategory('all');
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromConfirmation = (orderId: string) => {
    setTrackingOrderId(orderId);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Maintenance mode handling
  if (!isLoading && settings?.maintenanceMode && !isAuthenticated && !isAdminOpen) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-display">{settings.siteName}</h1>
        <p className="text-sm text-neutral-300 max-w-md mx-auto mt-2">
          We are currently performing routine catalog maintenance and server upgrades. We will be back online shortly!
        </p>
        <div className="mt-6 p-4 bg-neutral-800 rounded-xl text-xs text-neutral-400 flex items-center gap-2">
          <Phone className="w-4 h-4 text-amber-400" />
          <span>Urgent Orders & Assistance: <strong>{settings.contactPhone}</strong></span>
        </div>
        <button
          onClick={() => setIsAdminOpen(true)}
          className="mt-6 text-xs text-neutral-500 hover:text-neutral-300 underline"
        >
          Staff / Admin Login
        </button>
        {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* 1. Header Bar */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Main Page Content Viewport */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectCategory={handleSelectCategory}
            onNavigateToShop={handleNavigateToShop}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            initialCategory={selectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesView
            onSelectCategory={handleSelectCategory}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'track' && (
          <TrackOrderView
            initialOrderId={trackingOrderId}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {(['about', 'shipping', 'returns', 'terms', 'privacy', 'faq', 'contact'].includes(currentView)) && (
          <PolicyPages
            view={currentView as any}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 4. Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 5. Drawers and Modals */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setConfirmedOrder(order)}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={handleTrackOrderFromConfirmation}
      />

      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <AdminProvider>
          <StoreApp />
        </AdminProvider>
      </CartProvider>
    </StoreProvider>
  );
}
