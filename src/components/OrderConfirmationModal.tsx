import React from 'react';
import { CheckCircle2, Printer, ArrowRight, Package, MapPin, Phone, Calendar } from 'lucide-react';
import { Order } from '../types/ecommerce';
import { useStore } from '../context/StoreContext';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export function OrderConfirmationModal({ order, onClose, onTrackOrder }: OrderConfirmationModalProps) {
  const { settings } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full my-6 shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 print-container"
        onClick={e => e.stopPropagation()}
      >
        {/* Success Banner */}
        <div className="p-6 bg-emerald-600 text-white text-center no-print">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold font-display">Thank You! Order Confirmed</h2>
          <p className="text-xs text-emerald-100 mt-1">
            We have received your order and our fulfillment team is preparing it for shipment.
          </p>
          <div className="mt-3 inline-block bg-white text-neutral-900 font-mono text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Order Reference: {order.id}
          </div>
        </div>

        {/* Printable Invoice Header (Visible on print or modal view) */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Brand & Invoice Info */}
          <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
            <div>
              <h1 className="text-lg font-bold text-neutral-900 font-display">
                {settings?.siteName || 'KH SHOP ZONE'}
              </h1>
              <p className="text-xs text-neutral-500">{settings?.tagline}</p>
              <p className="text-[11px] text-neutral-500 mt-1">{settings?.officeAddress}</p>
              <p className="text-[11px] text-neutral-500">Helpline: {settings?.contactPhone}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-neutral-400 block uppercase">Official Invoice</span>
              <span className="text-sm font-bold text-neutral-900 font-mono block">{order.id}</span>
              <span className="text-[11px] text-neutral-500 block">
                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div>
              <span className="text-neutral-400 font-semibold block uppercase text-[10px] mb-1">Customer Details</span>
              <p className="font-bold text-neutral-900">{order.customerName}</p>
              <p className="text-neutral-600 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-neutral-400" />
                {order.customerPhone}
              </p>
              {order.customerEmail && <p className="text-neutral-600">{order.customerEmail}</p>}
            </div>

            <div>
              <span className="text-neutral-400 font-semibold block uppercase text-[10px] mb-1">Delivery Address</span>
              <p className="text-neutral-800">{order.address}</p>
              <p className="text-neutral-600 font-medium">
                {order.upazila}, {order.district} ({order.deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
              </p>
              {order.orderNotes && (
                <p className="text-neutral-500 italic mt-1 text-[11px]">Note: "{order.orderNotes}"</p>
              )}
            </div>
          </div>

          {/* Payment & Status Strip */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 bg-neutral-100 rounded-lg">
            <div>
              <span className="text-neutral-500 block text-[10px]">Payment Method</span>
              <strong className="text-neutral-900 uppercase">{order.paymentMethod}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Payment Status</span>
              <strong className={`uppercase ${
                order.paymentDetails.status === 'verified' || order.paymentDetails.status === 'paid'
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}>
                {order.paymentDetails.status}
              </strong>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Order Status</span>
              <strong className="text-blue-700 uppercase">{order.orderStatus}</strong>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <span className="text-xs font-bold text-neutral-800 uppercase block mb-2">Order Items</span>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-2 font-medium">Item</th>
                  <th className="py-2 text-center font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Price</th>
                  <th className="py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-2">
                      <span className="font-semibold text-neutral-900 block">{item.productName}</span>
                      {(item.variant?.size || item.variant?.color) && (
                        <span className="text-[11px] text-neutral-500">
                          {item.variant.size && `Size: ${item.variant.size} `}
                          {item.variant.color && `Color: ${item.variant.color}`}
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-center tabular-nums">{item.quantity}</td>
                    <td className="py-2 text-right tabular-nums">৳{item.unitPrice.toLocaleString()}</td>
                    <td className="py-2 text-right font-semibold text-neutral-900 tabular-nums">৳{item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-3 border-t border-neutral-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="tabular-nums font-semibold">৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Discount ({order.couponCode})</span>
                <span className="tabular-nums font-semibold">-৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Fee ({order.deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
              <span className="tabular-nums font-semibold">
                {order.deliveryCharge === 0 ? 'FREE' : `৳${order.deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Total Amount</span>
              <span className="tabular-nums text-base">৳{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons (Hidden when printed) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Receipt</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.id);
              }}
              className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Track This Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
