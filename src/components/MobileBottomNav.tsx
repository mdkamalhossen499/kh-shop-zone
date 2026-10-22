import React from 'react';
import { Home, ShoppingBag, Search, Package, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAdmin: () => void;
}

export function MobileBottomNav({ currentView, setCurrentView, onOpenAdmin }: MobileBottomNavProps) {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 h-14 flex items-center justify-around px-2 text-[10px] text-neutral-600 no-print">
      <button
        onClick={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center w-14 py-1 ${
          currentView === 'home' ? 'text-neutral-900 font-bold' : 'text-neutral-500'
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => {
          setCurrentView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center w-14 py-1 ${
          currentView === 'shop' ? 'text-neutral-900 font-bold' : 'text-neutral-500'
        }`}
      >
        <Search className="w-4 h-4 mb-0.5" />
        <span>Shop</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center w-14 py-1 relative text-neutral-700 font-semibold"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4 mb-0.5" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold tabular-nums">
              {itemCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <button
        onClick={() => {
          setCurrentView('track');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center w-14 py-1 ${
          currentView === 'track' ? 'text-neutral-900 font-bold' : 'text-neutral-500'
        }`}
      >
        <Package className="w-4 h-4 mb-0.5" />
        <span>Track</span>
      </button>

      <button
        onClick={onOpenAdmin}
        className="flex flex-col items-center justify-center w-14 py-1 text-neutral-500 hover:text-neutral-900"
      >
        <Shield className="w-4 h-4 mb-0.5" />
        <span>Admin</span>
      </button>
    </div>
  );
}
