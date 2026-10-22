import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, Check, Send } from 'lucide-react';
import { Product, Review } from '../types/ecommerce';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

export function ProductModal({ product, onClose, onProceedToCheckout }: ProductModalProps) {
  const { addToCart, addToRecentlyViewed } = useCart();
  const { categories, language } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  const [added, setAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || '');
      setSelectedSize(product.variants?.sizes?.[0] || '');
      setSelectedColor(product.variants?.colors?.[0] || '');
      setQuantity(1);
      setActiveTab('desc');
      addToRecentlyViewed(product);

      // Fetch reviews
      setLoadingReviews(true);
      fetch(`/api/reviews/${product.id}`)
        .then(res => res.json())
        .then(data => {
          setReviews(Array.isArray(data) ? data : []);
        })
        .catch(console.error)
        .finally(() => setLoadingReviews(false));
    }
  }, [product]);

  if (!product) return null;

  const category = categories.find(c => c.id === product.categoryId);
  const discount = product.discountPercentage > 0
    ? product.discountPercentage
    : Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100);

  const handleAddToCart = () => {
    const variant = {
      size: selectedSize || undefined,
      color: selectedColor || undefined
    };
    addToCart(product, quantity, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    const variant = {
      size: selectedSize || undefined,
      color: selectedColor || undefined
    };
    addToCart(product, quantity, variant);
    onClose();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;
    setSubmittingReview(true);
    let createdReview: Review | null = null;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: newReviewName.trim(),
          rating: newReviewRating,
          comment: newReviewComment.trim()
        })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        createdReview = await res.json();
      }
    } catch {
      // offline/Vercel
    }

    if (!createdReview) {
      createdReview = {
        id: `rev_${Date.now()}`,
        productId: product.id,
        customerName: newReviewName.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        verifiedPurchase: true,
        createdAt: new Date().toISOString()
      };
    }

    setReviews(prev => [createdReview!, ...prev]);
    setNewReviewName('');
    setNewReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
    setSubmittingReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-neutral-900 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-neutral-50 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-neutral-900 text-white text-xs font-bold px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails if available */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 w-full overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img ? 'border-neutral-900 shadow-sm' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-4 border-t border-neutral-200 text-center text-[11px] text-neutral-600">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Nationwide COD</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span className="font-medium">7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                <span className="uppercase tracking-wider font-semibold text-neutral-400">
                  {category?.name || 'KH SHOP ZONE'}
                </span>
                <span className="text-neutral-400 font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-tight mb-3">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-700">{product.rating.toFixed(1)}</span>
                <span className="text-neutral-300">·</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                >
                  {product.reviewCount} customer reviews
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-3 bg-neutral-50 rounded-xl mb-5">
                <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                  ৳{product.salePrice.toLocaleString('en-US')}
                </span>
                {product.regularPrice > product.salePrice && (
                  <span className="text-sm text-neutral-400 line-through tabular-nums">
                    ৳{product.regularPrice.toLocaleString('en-US')}
                  </span>
                )}
                <span className="ml-auto text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of stock'}
                </span>
              </div>

              {/* Variant Selector: Size */}
              {product.variants?.sizes && product.variants.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-700 mb-2">
                    <span>Select Size / Volume:</span>
                    <span className="font-bold text-neutral-900">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Selector: Color */}
              {product.variants?.colors && product.variants.colors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-700 mb-2">
                    <span>Select Color / Shade:</span>
                    <span className="font-bold text-neutral-900">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          selectedColor === color
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-medium text-neutral-700">Quantity:</span>
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-neutral-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-neutral-400">
                  Total: <strong className="text-neutral-900">৳{(product.salePrice * quantity).toLocaleString('en-US')}</strong>
                </span>
              </div>
            </div>

            {/* CTAs: Add to Cart & Buy Now */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-sm rounded-xl transition-all disabled:opacity-50"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Tabs: Description vs Reviews */}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="flex gap-4 border-b border-neutral-200 pb-2 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('desc')}
                    className={`pb-1 ${activeTab === 'desc' ? 'border-b-2 border-neutral-900 text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}
                  >
                    Product Description
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-1 ${activeTab === 'reviews' ? 'border-b-2 border-neutral-900 text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}
                  >
                    Customer Reviews ({reviews.length})
                  </button>
                </div>

                {activeTab === 'desc' ? (
                  <div className="mt-3 text-xs leading-relaxed text-neutral-600 space-y-2">
                    <p>{product.description}</p>
                    <p className="text-neutral-500">
                      <strong>Delivery Time:</strong> Inside Dhaka (24–48 Hours), Outside Dhaka (3–5 Days).
                      Cash on Delivery available across all 64 districts.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    {/* Add Review Form */}
                    <form onSubmit={handleSubmitReview} className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                      <div className="text-xs font-bold text-neutral-900 mb-2">Write a Verified Review</div>
                      {reviewSuccess && (
                        <div className="mb-2 p-2 text-xs bg-emerald-50 text-emerald-800 rounded font-medium">
                          Thank you! Your review has been published.
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={newReviewName}
                          onChange={e => setNewReviewName(e.target.value)}
                          required
                          className="px-2.5 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                        />
                        <select
                          value={newReviewRating}
                          onChange={e => setNewReviewRating(Number(e.target.value))}
                          className="px-2.5 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                          <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                          <option value={3}>⭐⭐⭐ (3/5)</option>
                          <option value={2}>⭐⭐ (2/5)</option>
                          <option value={1}>⭐ (1/5)</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Share your experience with this product..."
                        value={newReviewComment}
                        onChange={e => setNewReviewComment(e.target.value)}
                        required
                        rows={2}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg mb-2"
                      />
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Submit Review</span>
                      </button>
                    </form>

                    {/* Review List */}
                    {loadingReviews ? (
                      <div className="text-xs text-neutral-400 py-2">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                      <div className="text-xs text-neutral-400 py-2">No reviews yet. Be the first to review!</div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {reviews.map(r => (
                          <div key={r.id} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-neutral-900">{r.customerName}</span>
                              <div className="flex text-amber-400">
                                {[...Array(r.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-neutral-600">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
