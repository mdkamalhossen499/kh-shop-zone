import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types/ecommerce';
import { useStore } from './StoreContext';
import { LocalStoreManager } from '../utils/localStoreFallback';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: { size?: string; color?: string }) => void;
  removeFromCart: (productId: string, variantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  discount: number;
  couponCode: string;
  isFreeShipping: boolean;
  couponMessage: string;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  setDeliveryZone: (zone: 'inside_dhaka' | 'outside_dhaka') => void;
  deliveryFee: number;
  total: number;
  itemCount: number;
  freeDeliveryRemaining: number;
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getVariantKey(variant?: { size?: string; color?: string }): string {
  if (!variant) return 'default';
  return `${variant.size || ''}_${variant.color || ''}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { settings } = useStore();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kh_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);
  const [couponMessage, setCouponMessage] = useState<string>('');

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kh_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Persist recently viewed
  useEffect(() => {
    try {
      localStorage.setItem('kh_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error('Failed to save recently viewed:', e);
    }
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const addToCart = (product: Product, quantity = 1, variant?: { size?: string; color?: string }) => {
    setCart(prev => {
      const vKey = getVariantKey(variant);
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && getVariantKey(item.selectedVariant) === vKey
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(product.stock, newQty)
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            selectedVariant: variant,
            quantity: Math.min(product.stock, quantity)
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantKey?: string) => {
    setCart(prev =>
      prev.filter(
        item => !(item.productId === productId && (!variantKey || getVariantKey(item.selectedVariant) === variantKey))
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantKey?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantKey);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.productId === productId && (!variantKey || getVariantKey(item.selectedVariant) === variantKey)) {
          return { ...item, quantity: Math.min(item.product.stock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscount(0);
    setIsFreeShipping(false);
    setCouponMessage('');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const insideDhakaFee = settings?.delivery.insideDhakaFee ?? 60;
  const outsideDhakaFee = settings?.delivery.outsideDhakaFee ?? 120;
  const freeThreshold = settings?.delivery.freeDeliveryThreshold ?? 2000;

  let baseDeliveryFee = deliveryZone === 'inside_dhaka' ? insideDhakaFee : outsideDhakaFee;
  if (subtotal >= freeThreshold || isFreeShipping) {
    baseDeliveryFee = 0;
  }
  const deliveryFee = baseDeliveryFee;

  const total = Math.max(0, subtotal - discount + deliveryFee);
  const freeDeliveryRemaining = Math.max(0, freeThreshold - subtotal);

  const applyCoupon = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, subtotal })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.valid) {
          setCouponCode(cleanCode);
          setDiscount(data.discount || 0);
          setIsFreeShipping(data.freeShipping || false);
          setCouponMessage(data.message || 'Coupon applied successfully!');
          return true;
        } else {
          setCouponMessage(data.message || 'Invalid coupon code');
          return false;
        }
      }
    } catch {
      // offline/Vercel fallback
    }

    // Local fallback
    const coupons = LocalStoreManager.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!coupon) {
      setCouponMessage('Invalid coupon code');
      return false;
    }
    if (subtotal < coupon.minOrderAmount) {
      setCouponMessage(`Minimum order of ৳${coupon.minOrderAmount} required.`);
      return false;
    }

    setCouponCode(cleanCode);
    if (coupon.discountType === 'percentage') {
      let d = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && d > coupon.maxDiscount) d = coupon.maxDiscount;
      setDiscount(d);
      setIsFreeShipping(false);
      setCouponMessage(`${coupon.discountValue}% discount applied!`);
    } else if (coupon.discountType === 'fixed') {
      setDiscount(coupon.discountValue);
      setIsFreeShipping(false);
      setCouponMessage(`৳${coupon.discountValue} discount applied!`);
    } else if (coupon.discountType === 'free_shipping') {
      setDiscount(0);
      setIsFreeShipping(true);
      setCouponMessage('Free Shipping applied!');
    }
    return true;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setIsFreeShipping(false);
    setCouponMessage('');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        discount,
        couponCode,
        isFreeShipping,
        couponMessage,
        applyCoupon,
        removeCoupon,
        deliveryZone,
        setDeliveryZone,
        deliveryFee,
        total,
        itemCount,
        freeDeliveryRemaining,
        recentlyViewed,
        addToRecentlyViewed
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
