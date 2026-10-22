import React, { useState, useEffect } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldAlert, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';
import { Order } from '../types/ecommerce';
import { LocalStoreManager } from '../utils/localStoreFallback';

interface TrackOrderViewProps {
  initialOrderId?: string;
  onBackToHome: () => void;
}

export function TrackOrderView({ initialOrderId, onBackToHome }: TrackOrderViewProps) {
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Cancellation modal state
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelPhone, setCancelPhone] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  const fetchOrderTracking = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    let foundOrders: Order[] = [];

    try {
      const isOrderId = query.trim().toUpperCase().startsWith('KH-');
      const param = isOrderId ? `orderId=${encodeURIComponent(query.trim())}` : `phone=${encodeURIComponent(query.trim())}`;
      const res = await fetch(`/api/orders/track?${param}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          foundOrders = data;
        }
      }
    } catch {
      // Fallback for Vercel/offline mode
    }

    if (foundOrders.length === 0) {
      // Search in LocalStoreManager
      const allOrders = LocalStoreManager.getOrders();
      const q = query.trim().toLowerCase();
      const cleanQPhone = query.replace(/\D/g, '');

      foundOrders = allOrders.filter(o => {
        const matchId = o.id.toLowerCase() === q;
        const matchPhone = cleanQPhone.length >= 6 && o.customerPhone.replace(/\D/g, '').includes(cleanQPhone);
        return matchId || matchPhone;
      });
    }

    if (foundOrders.length > 0) {
      setOrders(foundOrders);
    } else {
      setOrders([]);
      setErrorMessage(`No orders found matching '${query}'. Please check your Order ID (e.g. KH-829104) or phone number.`);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId);
      fetchOrderTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderTracking(searchInput);
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;
    setCancelling(true);
    setCancelError('');
    setCancelSuccess('');

    let cancelDone = false;

    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: cancellingOrder.id,
          phone: cancelPhone.trim(),
          reason: cancelReason.trim() || 'Customer requested cancellation'
        })
      });

      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          cancelDone = true;
        }
      }
    } catch {
      // server unreachable
    }

    if (!cancelDone) {
      // Verify phone against order
      const cleanOrderPhone = cancellingOrder.customerPhone.replace(/\D/g, '');
      const cleanInputPhone = cancelPhone.replace(/\D/g, '');

      if (!cleanOrderPhone.endsWith(cleanInputPhone) && !cleanInputPhone.endsWith(cleanOrderPhone)) {
        setCancelError('Phone number does not match order record.');
        setCancelling(false);
        return;
      }

      if (cancellingOrder.orderStatus !== 'pending') {
        setCancelError(`Orders with status '${cancellingOrder.orderStatus}' cannot be self-cancelled.`);
        setCancelling(false);
        return;
      }

      const allOrders = LocalStoreManager.getOrders();
      const updated = allOrders.map(o => {
        if (o.id === cancellingOrder.id) {
          return {
            ...o,
            orderStatus: 'cancelled' as const,
            cancellationReason: cancelReason.trim() || 'Customer requested cancellation',
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      });
      LocalStoreManager.saveOrders(updated);
      cancelDone = true;
    }

    if (cancelDone) {
      setCancelSuccess('Order was successfully cancelled.');
      setOrders(prev => prev.map(o => o.id === cancellingOrder.id ? { ...o, orderStatus: 'cancelled' } : o));
      setTimeout(() => {
        setCancellingOrder(null);
        setCancelSuccess('');
        setCancelPhone('');
        setCancelReason('');
      }, 1500);
    }
    setCancelling(false);
  };

  const getStepProgress = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'processing': return 3;
      case 'shipped': return 4;
      case 'delivered': return 5;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm mb-6 text-center">
        <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Truck className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 font-display">
          Track Your Order Live
        </h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-6">
          Enter your Order Number (e.g. <strong>KH-829104</strong>) or the mobile phone number used during checkout.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. KH-829104 or 017XXXXXXXX"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white uppercase placeholder:normal-case font-mono"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {errorMessage && (
          <p className="text-xs text-red-600 mt-3 font-medium">{errorMessage}</p>
        )}
      </div>

      {/* Order Results */}
      {hasSearched && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map(order => {
            const currentStep = getStepProgress(order.orderStatus);
            const isCancelled = order.orderStatus === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900 font-mono">{order.id}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCancelled
                          ? 'bg-red-100 text-red-800'
                          : order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 mt-0.5 block">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.orderStatus === 'pending' && (
                      <button
                        onClick={() => {
                          setCancellingOrder(order);
                          setCancelPhone(order.customerPhone);
                        }}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 underline transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Tracking Stepper (if not cancelled) */}
                {!isCancelled ? (
                  <div className="py-6">
                    <div className="relative">
                      {/* Connecting Line */}
                      <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-200 -z-0">
                        <div
                          className="h-full bg-neutral-900 transition-all duration-500"
                          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                        />
                      </div>

                      {/* Step Nodes */}
                      <div className="grid grid-cols-5 text-center relative z-10">
                        {[
                          { title: 'Order Placed', desc: 'Received' },
                          { title: 'Confirmed', desc: 'Payment Check' },
                          { title: 'Processing', desc: 'Quality Check' },
                          { title: 'Shipped', desc: 'In Transit' },
                          { title: 'Delivered', desc: 'Completed' }
                        ].map((step, idx) => {
                          const stepNumber = idx + 1;
                          const isDone = currentStep >= stepNumber;
                          const isCurrent = currentStep === stepNumber;

                          return (
                            <div key={idx} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                                  isDone
                                    ? 'bg-neutral-900 text-white'
                                    : 'bg-neutral-100 border border-neutral-300 text-neutral-400'
                                } ${isCurrent ? 'ring-4 ring-neutral-200' : ''}`}
                              >
                                {isDone ? '✓' : stepNumber}
                              </div>
                              <span className={`text-xs mt-2 font-semibold ${isDone ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                {step.title}
                              </span>
                              <span className="text-[10px] text-neutral-400 hidden sm:block">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>This order has been cancelled</span>
                    </div>
                    <p className="text-red-700">Reason: {order.cancellationReason || 'Cancelled upon customer request.'}</p>
                  </div>
                )}

                {/* Courier & Payment Status Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                  <div>
                    <span className="text-neutral-400 font-semibold block uppercase text-[10px] mb-1">Courier & Delivery</span>
                    {order.courierName ? (
                      <p className="text-neutral-900 font-bold">
                        {order.courierName}
                        {order.courierTrackingCode && (
                          <span className="font-mono text-neutral-600 font-normal ml-1">
                            (Tracking: <strong>{order.courierTrackingCode}</strong>)
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-neutral-500 italic">Courier assignment in progress...</p>
                    )}
                    <p className="text-neutral-600 mt-1">
                      To: {order.address}, {order.upazila}, {order.district}
                    </p>
                  </div>

                  <div>
                    <span className="text-neutral-400 font-semibold block uppercase text-[10px] mb-1">Payment Details</span>
                    <p className="text-neutral-900 font-bold uppercase">
                      {order.paymentMethod} ·{' '}
                      <span className={
                        order.paymentDetails.status === 'verified' || order.paymentDetails.status === 'paid'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }>
                        Status: {order.paymentDetails.status.toUpperCase()}
                      </span>
                    </p>
                    {order.paymentDetails.trxId && (
                      <p className="font-mono text-neutral-600 mt-0.5">
                        TrxID: {order.paymentDetails.trxId}
                      </p>
                    )}
                    <p className="text-neutral-900 font-bold mt-1">
                      Total Payable: ৳{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="mt-4 pt-3 border-t border-neutral-200">
                  <span className="text-xs font-semibold text-neutral-700 block mb-2">Items in Parcel:</span>
                  <div className="divide-y divide-neutral-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-400 tabular-nums">{item.quantity}x</span>
                          <span className="font-medium text-neutral-900">{item.productName}</span>
                          {(item.variant?.size || item.variant?.color) && (
                            <span className="text-neutral-500 text-[11px]">
                              ({item.variant.size || ''} {item.variant.color || ''})
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-neutral-900 tabular-nums">
                          ৳{item.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-xl">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Cancel Order {cancellingOrder.id}?</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Orders can only be cancelled while in 'Pending' status. Please verify your mobile number to confirm.
            </p>

            {cancelError && <p className="text-xs text-red-600 mb-3">{cancelError}</p>}
            {cancelSuccess && <p className="text-xs text-emerald-600 mb-3">{cancelSuccess}</p>}

            <form onSubmit={handleConfirmCancel} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Confirm Mobile Phone:</label>
                <input
                  type="tel"
                  value={cancelPhone}
                  onChange={e => setCancelPhone(e.target.value)}
                  required
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Reason for cancellation:</label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g. Changed mind, ordered wrong item..."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
