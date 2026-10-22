export interface ProductVariant {
  sizes?: string[];
  colors?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  sku: string;
  stock: number;
  categoryId: string;
  subcategory: string;
  images: string[];
  variants?: ProductVariant;
  isFeatured: boolean;
  isBestSeller: boolean;
  isFlashSale: boolean;
  flashSaleEndsAt?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;

  // Sensitive/Admin only fields (filtered out for customers):
  supplierName?: string;
  purchaseCost?: number;
  internalNotes?: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedVariant?: {
    size?: string;
    color?: string;
  };
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variant?: {
    size?: string;
    color?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'verified' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket';

export interface Order {
  id: string; // e.g. KH-849201
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  district: string;
  upazila: string;
  address: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    senderNumber?: string;
    trxId?: string;
    status: PaymentStatus;
    verifiedAt?: string;
    verifiedBy?: string;
  };
  orderStatus: OrderStatus;
  courierName?: string;
  courierTrackingCode?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  usageCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface HeroBannerSettings {
  title: string;
  subtitle: string;
  badgeText: string;
  imageUrl: string;
  primaryBtnText: string;
  primaryBtnLink?: string;
  secondaryBtnText: string;
  secondaryBtnLink?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  currency: string;
  currencySymbol: string;
  announcement: string;
  showAnnouncement: boolean;
  maintenanceMode: boolean;
  contactPhone: string;
  contactEmail: string;
  officeAddress: string;
  heroBanner?: HeroBannerSettings;
  socialLinks: {
    facebook: string;
    instagram: string;
    whatsapp: string;
    youtube?: string;
  };
  delivery: {
    insideDhakaFee: number;
    outsideDhakaFee: number;
    freeDeliveryThreshold: number;
    estimatedDhaka: string;
    estimatedOutside: string;
  };
  paymentMethods: {
    cod: { enabled: boolean; title: string; instructions: string };
    bkash: { enabled: boolean; title: string; number: string; accountType: string; instructions: string };
    nagad: { enabled: boolean; title: string; number: string; accountType: string; instructions: string };
    rocket: { enabled: boolean; title: string; number: string; accountType: string; instructions: string };
  };
  homepageSections: {
    showHero: boolean;
    showCategories: boolean;
    showFlashSale: boolean;
    showFeatured: boolean;
    showBestSellers: boolean;
    showReviews: boolean;
    showWhyUs: boolean;
  };
  policies: {
    aboutUs: string;
    shippingPolicy: string;
    returnPolicy: string;
    terms: string;
    privacy: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'manager';
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
}
