import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  setCurrentView: (view: string) => void;
  onOpenAdmin: () => void;
}

export function Footer({ setCurrentView, onOpenAdmin }: FooterProps) {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 text-xs no-print">
      {/* Trust Highlights Strip */}
      <div className="border-b border-neutral-800 bg-neutral-950/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Nationwide Delivery</h4>
              <p className="text-neutral-400 text-[11px] mt-0.5">24–48h Dhaka · 3–5d All 64 Districts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">100% Authentic</h4>
              <p className="text-neutral-400 text-[11px] mt-0.5">Direct from verified suppliers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
              <span className="text-base">💵</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Cash on Delivery</h4>
              <p className="text-neutral-400 text-[11px] mt-0.5">Pay safely upon unboxing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">7-Day Easy Return</h4>
              <p className="text-neutral-400 text-[11px] mt-0.5">Hassle-free exchange policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-neutral-900 flex items-center justify-center font-bold text-sm">
              KH
            </div>
            <span className="text-base font-bold text-white font-display tracking-tight">
              {settings?.siteName || 'KH SHOP ZONE'}
            </span>
          </div>

          <p className="text-neutral-400 leading-relaxed max-w-sm text-xs">
            {settings?.tagline || "Bangladesh's premier multi-category e-commerce store with authentic perfumes, designer ethnic fashion, skincare, and daily lifestyle essentials."}
          </p>

          <div className="space-y-1.5 text-neutral-400 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>{settings?.officeAddress || 'Banani, Dhaka-1213, Bangladesh'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>{settings?.contactPhone || '+880 1711-223344'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>{settings?.contactEmail || 'support@khshopzone.com'}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Top Collections</h4>
          <ul className="space-y-2 text-neutral-400">
            {categories.slice(0, 5).map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <button onClick={() => setCurrentView('track')} className="hover:text-white transition-colors">
                Track Your Order
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('shipping')} className="hover:text-white transition-colors">
                Shipping & Delivery
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('returns')} className="hover:text-white transition-colors">
                Return & Refund Policy
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('faq')} className="hover:text-white transition-colors">
                Help & FAQs
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">
                Contact Customer Support
              </button>
            </li>
          </ul>
        </div>

        {/* Payment Methods & Legal */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Payment Methods</h4>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            We accept Cash on Delivery (COD) nationwide, as well as bKash, Nagad, and Rocket mobile banking.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2 py-1 bg-neutral-800 text-neutral-200 rounded text-[11px] font-medium border border-neutral-700">
              Cash on Delivery
            </span>
            <span className="px-2 py-1 bg-pink-950/80 text-pink-300 rounded text-[11px] font-medium border border-pink-800">
              bKash
            </span>
            <span className="px-2 py-1 bg-amber-950/80 text-amber-300 rounded text-[11px] font-medium border border-amber-800">
              Nagad
            </span>
            <span className="px-2 py-1 bg-purple-950/80 text-purple-300 rounded text-[11px] font-medium border border-purple-800">
              Rocket
            </span>
          </div>

          <div className="pt-2 text-[11px] space-x-2 text-neutral-500">
            <button onClick={() => setCurrentView('terms')} className="hover:underline">Terms</button>
            <span>·</span>
            <button onClick={() => setCurrentView('privacy')} className="hover:underline">Privacy</button>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-neutral-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} {settings?.siteName || 'KH SHOP ZONE'}. All Rights Reserved. Made for Bangladesh.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300 transition-colors"
              title="Restricted Staff Console"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
