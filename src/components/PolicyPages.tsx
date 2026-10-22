import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft, HelpCircle, Shield, Truck, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PolicyPagesProps {
  view: 'about' | 'shipping' | 'returns' | 'terms' | 'privacy' | 'faq' | 'contact';
  onBack: () => void;
}

export function PolicyPages({ view, onBack }: PolicyPagesProps) {
  const { settings } = useStore();

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactName('');
      setContactPhone('');
      setContactSubject('');
      setContactMessage('');
    }, 3000);
  };

  const policies = settings?.policies;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-10 shadow-sm">
        {/* ABOUT US */}
        {view === 'about' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl font-bold text-neutral-900 font-display">About KH SHOP ZONE</h1>
              <p className="text-xs text-neutral-500 mt-1">{settings?.tagline}</p>
            </div>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line space-y-4">
              {policies?.aboutUs}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200 text-center">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-xs text-neutral-900">100% Guaranteed Origin</h4>
                <p className="text-[11px] text-neutral-500 mt-1">Directly sourced authentic goods</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h4 className="font-bold text-xs text-neutral-900">64 Districts Reach</h4>
                <p className="text-[11px] text-neutral-500 mt-1">Dedicated courier network partnerships</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <RefreshCw className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <h4 className="font-bold text-xs text-neutral-900">7 Days Return</h4>
                <p className="text-[11px] text-neutral-500 mt-1">Unhappy with quality? Exchange easily</p>
              </div>
            </div>
          </div>
        )}

        {/* SHIPPING POLICY */}
        {view === 'shipping' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl font-bold text-neutral-900 font-display">Shipping & Delivery Policy</h1>
              <p className="text-xs text-neutral-500 mt-1">Nationwide Coverage & Delivery Timelines</p>
            </div>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {policies?.shippingPolicy}
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong className="block mb-1">Current Store Delivery Rates:</strong>
              <div>• Inside Dhaka: ৳{settings?.delivery.insideDhakaFee ?? 60} (Estimated: {settings?.delivery.estimatedDhaka})</div>
              <div>• Outside Dhaka: ৳{settings?.delivery.outsideDhakaFee ?? 120} (Estimated: {settings?.delivery.estimatedOutside})</div>
              <div>• Free Delivery Threshold: Orders over ৳{settings?.delivery.freeDeliveryThreshold ?? 2000}</div>
            </div>
          </div>
        )}

        {/* RETURN & REFUND POLICY */}
        {view === 'returns' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl font-bold text-neutral-900 font-display">Return & Refund Policy</h1>
              <p className="text-xs text-neutral-500 mt-1">7-Day Customer Exchange Guarantee</p>
            </div>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {policies?.returnPolicy}
            </div>
          </div>
        )}

        {/* TERMS & CONDITIONS */}
        {view === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl font-bold text-neutral-900 font-display">Terms and Conditions</h1>
              <p className="text-xs text-neutral-500 mt-1">Store Policies & Customer Agreements</p>
            </div>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {policies?.terms}
            </div>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {view === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl font-bold text-neutral-900 font-display">Privacy Policy</h1>
              <p className="text-xs text-neutral-500 mt-1">How KH SHOP ZONE Protects Your Personal Information</p>
            </div>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {policies?.privacy}
            </div>
          </div>
        )}

        {/* FAQ */}
        {view === 'faq' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl font-bold text-neutral-900 font-display">Frequently Asked Questions (FAQ)</h1>
              <p className="text-xs text-neutral-500 mt-1">Answers to common customer queries</p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-neutral-900 mb-1">How can I pay for my order?</h4>
                <p className="text-neutral-600">
                  We support Cash on Delivery (COD) everywhere in Bangladesh. You can also pay via bKash, Nagad, or Rocket Send Money by submitting your Transaction ID during checkout.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-neutral-900 mb-1">How do I track my delivery?</h4>
                <p className="text-neutral-600">
                  Click the "Track Order" link in our header or bottom bar. Enter your Order ID (e.g. KH-829104) or phone number to see live stages from placement to delivery.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-neutral-900 mb-1">How long does shipping take?</h4>
                <p className="text-neutral-600">
                  Inside Dhaka orders arrive within 24 to 48 hours. Outside Dhaka takes 3 to 5 business days via trusted couriers (Steadfast, Pathao, RedX).
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-neutral-900 mb-1">Can I cancel an order?</h4>
                <p className="text-neutral-600">
                  Yes, any order in 'Pending' status can be cancelled self-service via the Track Order portal or by calling customer care.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT US */}
        {view === 'contact' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl font-bold text-neutral-900 font-display">Contact Customer Support</h1>
              <p className="text-xs text-neutral-500 mt-1">We are here to assist with any questions or orders</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Contact Details */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-neutral-900">Head Office & Dispatch Center:</strong>
                      <span className="text-neutral-600">{settings?.officeAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-neutral-700 shrink-0" />
                    <div>
                      <strong className="block text-neutral-900">Customer Helpline:</strong>
                      <a href={`tel:${settings?.contactPhone}`} className="text-neutral-900 font-bold hover:underline">
                        {settings?.contactPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-neutral-700 shrink-0" />
                    <div>
                      <strong className="block text-neutral-900">Email Support:</strong>
                      <span className="text-neutral-600">{settings?.contactEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                  <h4 className="font-bold mb-1">WhatsApp Live Support</h4>
                  <p className="text-[11px] mb-3">Chat with our Dhaka support desk for quick questions or order confirmation.</p>
                  <a
                    href={`https://wa.me/${settings?.socialLinks.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold text-xs hover:bg-emerald-700 transition-colors"
                  >
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              {/* Right Message Form */}
              <div>
                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <h4 className="font-bold text-neutral-900 mb-2">Send us a message</h4>

                  {submitted && (
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Thank you! Your message has been dispatched to customer support.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactSubject}
                      onChange={e => setContactSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Your Message</label>
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
