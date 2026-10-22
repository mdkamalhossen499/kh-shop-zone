import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
    deliveryZone,
    setDeliveryZone,
    deliveryFee,
    total,
    itemCount,
    freeDeliveryRemaining
  } = useCart();

  const { settings, language } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
  };

  const freeThreshold = settings?.delivery.freeDeliveryThreshold ?? 2000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold text-neutral-900">
                {language === 'bn' ? 'আপনার শপিং ব্যাগ' : 'Shopping Cart'}
              </h2>
              <span className="text-xs bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded-full tabular-nums">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-100 text-xs">
            {freeDeliveryRemaining > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-amber-900 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Add <strong className="tabular-nums">৳{freeDeliveryRemaining.toLocaleString()}</strong> more for FREE delivery!
                  </span>
                  <span className="tabular-nums font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You unlocked FREE Nationwide Delivery! 🎉</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <ShoppingBag className="w-16 h-16 stroke-[1.2] mb-3 text-neutral-300" />
                <h3 className="text-base font-bold text-neutral-700 mb-1">
                  {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mb-4">
                  Explore our curated collections of authentic fragrances, fashion, skincare, and electronics.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const variantKey = `${item.selectedVariant?.size || ''}_${item.selectedVariant?.color || ''}`;
                return (
                  <div
                    key={`${item.productId}_${index}`}
                    className="flex gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 items-center justify-between"
                  >
                    <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-neutral-200">
                      <img
                        src={item.product.images?.[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-semibold text-neutral-900 truncate">
                        {item.product.name}
                      </h4>

                      {(item.selectedVariant?.size || item.selectedVariant?.color) && (
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {item.selectedVariant.size && <span>Size: {item.selectedVariant.size}</span>}
                          {item.selectedVariant.size && item.selectedVariant.color && <span> · </span>}
                          {item.selectedVariant.color && <span>Color: {item.selectedVariant.color}</span>}
                        </div>
                      )}

                      <div className="text-xs font-bold text-neutral-900 tabular-nums mt-1">
                        ৳{item.product.salePrice.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.productId, variantKey)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Stepper */}
                      <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, variantKey)}
                          className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, variantKey)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Module (Only if cart has items) */}
          {cart.length > 0 && (
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-3">
              {/* Delivery Zone Selector */}
              <div className="bg-white p-2.5 rounded-lg border border-neutral-200 space-y-1.5">
                <div className="text-[11px] font-semibold text-neutral-700">Delivery Zone:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryZone('inside_dhaka')}
                    className={`py-1.5 px-2 rounded-md border text-center transition-all ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    Inside Dhaka (৳{settings?.delivery.insideDhakaFee ?? 60})
                  </button>
                  <button
                    onClick={() => setDeliveryZone('outside_dhaka')}
                    className={`py-1.5 px-2 rounded-md border text-center transition-all ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    Outside Dhaka (৳{settings?.delivery.outsideDhakaFee ?? 120})
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="space-y-1">
                {couponCode ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      Coupon: <strong>{couponCode}</strong> ({couponMessage})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-neutral-500 hover:text-red-600 underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. KH10, FREESHIP)"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg uppercase placeholder:normal-case focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && !couponCode && (
                  <p className="text-[11px] text-red-600 pl-1">{couponMessage}</p>
                )}
              </div>

              {/* Order Calculations */}
              <div className="space-y-1 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold tabular-nums">-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Grand Total</span>
                  <span className="tabular-nums text-base">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{language === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
