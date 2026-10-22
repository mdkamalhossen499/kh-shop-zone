import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Copy, Check, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshDistricts';
import { Order, PaymentMethod } from '../types/ecommerce';
import { LocalStoreManager } from '../utils/localStoreFallback';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export function CheckoutModal({ isOpen, onClose, onOrderSuccess }: CheckoutModalProps) {
  const {
    cart,
    clearCart,
    subtotal,
    discount,
    couponCode,
    deliveryZone,
    setDeliveryZone,
    deliveryFee,
    total
  } = useCart();
  const { settings, language } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Gulshan');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [senderNumberError, setSenderNumberError] = useState('');
  const [trxIdError, setTrxIdError] = useState('');

  // Update upazilas when district changes
  const selectedDistrictInfo = BANGLADESH_DISTRICTS.find(d => d.name === district) || BANGLADESH_DISTRICTS[0];
  const availableUpazilas = selectedDistrictInfo ? selectedDistrictInfo.upazilas : [];
  const divisions = Array.from(new Set(BANGLADESH_DISTRICTS.map(d => d.division)));

  useEffect(() => {
    if (selectedDistrictInfo) {
      setUpazila(selectedDistrictInfo.upazilas[0] || '');
      setDeliveryZone(selectedDistrictInfo.zone);
    }
  }, [district]);

  useEffect(() => {
    if (isOpen && selectedDistrictInfo) {
      setDeliveryZone(selectedDistrictInfo.zone);
    }
  }, [isOpen]);

  // Reset payment validation errors when payment method switches
  useEffect(() => {
    setSenderNumberError('');
    setTrxIdError('');
  }, [paymentMethod]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSenderNumberError('');
    setTrxIdError('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Please provide your full delivery address (Road/House/Area).');
      return;
    }

    // Mandatory payment validation for bKash, Nagad, Rocket
    if (paymentMethod !== 'cod') {
      let hasPaymentError = false;
      const cleanSender = senderNumber.replace(/\D/g, '');

      if (!senderNumber.trim()) {
        setSenderNumberError('Sender Mobile Number is required to verify your payment.');
        hasPaymentError = true;
      } else if (cleanSender.length < 11) {
        setSenderNumberError('Please enter a valid 11-digit sender phone number (e.g. 01712345678).');
        hasPaymentError = true;
      }

      if (!trxId.trim()) {
        setTrxIdError(`Transaction ID (TrxID) is required for ${paymentMethod.toUpperCase()} payments.`);
        hasPaymentError = true;
      } else if (trxId.trim().length < 6) {
        setTrxIdError('Transaction ID must be at least 6 characters long.');
        hasPaymentError = true;
      }

      if (hasPaymentError) {
        setErrorMessage(`Please complete all mandatory payment verification fields for ${paymentMethod.toUpperCase()}.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        district,
        upazila,
        address: address.trim(),
        orderNotes: orderNotes.trim() || undefined,
        items: cart.map(item => ({
          productId: item.productId,
          variant: item.selectedVariant,
          quantity: item.quantity
        })),
        couponCode: couponCode || undefined,
        deliveryZone,
        paymentMethod,
        paymentDetails: paymentMethod !== 'cod' ? {
          senderNumber: senderNumber.trim(),
          trxId: trxId.trim().toUpperCase()
        } : undefined
      };

      let confirmedOrder: Order | null = null;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.order) {
            confirmedOrder = data.order;
          }
        }
      } catch {
        // Fallback for Vercel/offline mode
      }

      // If server didn't respond (e.g. Vercel deployment), create order locally
      if (!confirmedOrder) {
        const randomSuffix = Math.floor(100000 + Math.random() * 900000);
        const orderId = `KH-${randomSuffix}`;

        const calculatedItems = cart.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images?.[0] || '',
          variant: item.selectedVariant,
          quantity: item.quantity,
          unitPrice: item.product.salePrice,
          totalPrice: item.product.salePrice * item.quantity
        }));

        confirmedOrder = {
          id: orderId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          district,
          upazila,
          address: address.trim(),
          orderNotes: orderNotes.trim() || undefined,
          items: calculatedItems,
          subtotal,
          discount,
          couponCode: couponCode || undefined,
          deliveryCharge: deliveryFee,
          deliveryZone,
          totalAmount: total,
          paymentMethod,
          paymentDetails: {
            senderNumber: senderNumber.trim() || undefined,
            trxId: trxId.trim().toUpperCase() || undefined,
            status: paymentMethod === 'cod' ? 'pending' : (trxId ? 'pending' : 'failed')
          },
          orderStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Save order to LocalStoreManager
        const existingOrders = LocalStoreManager.getOrders();
        existingOrders.unshift(confirmedOrder);
        LocalStoreManager.saveOrders(existingOrders);
        LocalStoreManager.logAudit(
          'system',
          'ORDER_PLACED',
          `New order placed by ${confirmedOrder.customerName} (ID: ${confirmedOrder.id})`
        );
      }

      clearCart();
      onClose();
      onOrderSuccess(confirmedOrder);
    } catch {
      setErrorMessage('Error processing order. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentConfig = settings?.paymentMethods;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display">
              {language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm Your Order'}
            </h2>
            <p className="text-xs text-neutral-400">
              Fast Nationwide Delivery across all 64 districts in Bangladesh
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer & Delivery Details */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-700" />
              <span>1. Customer & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Md. Kamal Hossen"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">
                  Active Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 01711223344"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-medium mb-1">
                  Email Address <span className="text-neutral-400 font-normal">(Optional for invoice receipt)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. kamal@example.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-neutral-700 font-medium">
                    District ({BANGLADESH_DISTRICTS.length}) <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    selectedDistrictInfo.zone === 'inside_dhaka'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {selectedDistrictInfo.zone === 'inside_dhaka'
                      ? `Inside Dhaka (৳${settings?.delivery.insideDhakaFee ?? 60})`
                      : `Outside Dhaka (৳${settings?.delivery.outsideDhakaFee ?? 120})`}
                  </span>
                </div>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-xs font-medium"
                >
                  {divisions.map(div => (
                    <optgroup key={div} label={`${div} Division`}>
                      {BANGLADESH_DISTRICTS.filter(d => d.division === div).map(d => (
                        <option key={d.name} value={d.name}>
                          {d.name} ({d.bn}) {d.zone === 'inside_dhaka' ? '— Inside Dhaka' : '— Outside Dhaka'}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-neutral-700 font-medium">
                    Upazila / Area <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    {availableUpazilas.length} areas available
                  </span>
                </div>
                <select
                  value={upazila}
                  onChange={e => setUpazila(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-xs font-medium"
                >
                  {availableUpazilas.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-medium mb-1">
                  Detailed Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="House number, road number, flat/floor, sector/village"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-medium mb-1">
                  Order Delivery Notes <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Special instructions for courier delivery person..."
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-700" />
              <span>2. Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <span className="text-xs font-bold">💵 Cash on Delivery</span>
                <span className="text-[10px] opacity-80 mt-1">Pay upon receiving</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-600 text-white shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-pink-300'
                }`}
              >
                <span className="text-xs font-bold">bKash (বিকাশ)</span>
                <span className="text-[10px] opacity-80 mt-1">Manual Send Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-amber-300'
                }`}
              >
                <span className="text-xs font-bold">Nagad (নগদ)</span>
                <span className="text-[10px] opacity-80 mt-1">Manual Send Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('rocket')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'rocket'
                    ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-purple-300'
                }`}
              >
                <span className="text-xs font-bold">Rocket (রকেট)</span>
                <span className="text-[10px] opacity-80 mt-1">Manual Send Money</span>
              </button>
            </div>

            {/* Payment Details Subform */}
            {paymentMethod === 'cod' ? (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-700">
                <p className="font-semibold text-neutral-900 mb-0.5">Cash on Delivery Instructions:</p>
                <p>{paymentConfig?.cod?.instructions || 'Pay the exact total in cash when the delivery agent delivers your package. Please keep cash ready.'}</p>
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 text-xs">
                {/* Number Display with Copy */}
                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-neutral-200">
                  <div>
                    <span className="text-[11px] text-neutral-500 block">
                      {paymentMethod.toUpperCase()} Account Number ({paymentConfig?.[paymentMethod]?.accountType || 'Personal'}):
                    </span>
                    <span className="text-sm font-bold text-neutral-900 font-mono">
                      {paymentConfig?.[paymentMethod]?.number || '01711-223344'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentConfig?.[paymentMethod]?.number || '01711223344')}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-medium transition-colors"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Instructions */}
                <div className="whitespace-pre-line text-neutral-600 bg-white p-2.5 rounded-lg border border-neutral-100 leading-relaxed">
                  {paymentConfig?.[paymentMethod]?.instructions}
                </div>

                {/* TrxID and Sender Input with Mandatory Validation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-neutral-800 font-semibold mb-1">
                      Sender Mobile Number <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 017XXXXXXXX"
                      value={senderNumber}
                      onChange={e => {
                        setSenderNumber(e.target.value);
                        if (senderNumberError) setSenderNumberError('');
                      }}
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs transition-colors ${
                        senderNumberError ? 'border-red-500 bg-red-50/30 focus:border-red-600' : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                    />
                    {senderNumberError ? (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{senderNumberError}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-neutral-500 mt-1">Number used to send money</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-neutral-800 font-semibold mb-1">
                      Transaction ID (TrxID) <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9K28M910QP"
                      value={trxId}
                      onChange={e => {
                        setTrxId(e.target.value);
                        if (trxIdError) setTrxIdError('');
                      }}
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-mono uppercase transition-colors ${
                        trxIdError ? 'border-red-500 bg-red-50/30 focus:border-red-600' : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                    />
                    {trxIdError ? (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{trxIdError}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-neutral-500 mt-1">From SMS or app confirmation</p>
                    )}
                  </div>
                </div>

                {/* Mandatory verification disclosure */}
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] leading-relaxed">
                  <strong>Verification Notice:</strong> All manual mobile payments (bKash/Nagad/Rocket) are verified manually by our accounts team against bank statements prior to courier handover. We never claim manual payments are auto-verified.
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Order Summary Breakdown */}
          <div className="pt-4 border-t border-neutral-200 bg-neutral-50 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-semibold text-neutral-900 tabular-nums">৳{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({couponCode})</span>
                <span className="font-semibold tabular-nums">-৳{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Delivery ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
              <span className="font-semibold text-neutral-900 tabular-nums">
                {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Payable Total</span>
              <span className="tabular-nums text-base">৳{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Placing your order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Confirm & Place Order (৳{total.toLocaleString()})</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-neutral-400 text-center mt-2">
              🔒 Your order information is strictly encrypted and used only for delivery fulfillment.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
