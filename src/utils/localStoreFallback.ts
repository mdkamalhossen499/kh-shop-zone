import { Product, Category, Order, Coupon, Review, SiteSettings, AdminUser, AuditLog } from '../types/ecommerce';

// Initial Seed Settings
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'KH SHOP ZONE',
  tagline: 'Your Trusted Destination for Authentic Products in Bangladesh',
  logoUrl: '',
  primaryColor: '#0f172a',
  currency: 'BDT',
  currencySymbol: '৳',
  announcement: '🎉 Fast Nationwide Delivery! Free delivery inside Dhaka on orders over ৳2,000. Cash on Delivery Available.',
  showAnnouncement: true,
  maintenanceMode: false,
  contactPhone: '+880 1711-223344',
  contactEmail: 'support@khshopzone.com',
  officeAddress: 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  socialLinks: {
    facebook: 'https://facebook.com/khshopzone',
    instagram: 'https://instagram.com/khshopzone',
    whatsapp: '+8801711223344',
    youtube: 'https://youtube.com/@khshopzone'
  },
  delivery: {
    insideDhakaFee: 60,
    outsideDhakaFee: 120,
    freeDeliveryThreshold: 2000,
    estimatedDhaka: '24–48 Hours',
    estimatedOutside: '3–5 Working Days'
  },
  paymentMethods: {
    cod: {
      enabled: true,
      title: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)',
      instructions: 'Pay conveniently in cash when your parcel is delivered at your home or office address. Please inspect the parcel exterior before payment.'
    },
    bkash: {
      enabled: true,
      title: 'bKash (বিকাশ)',
      number: '01711-223344',
      accountType: 'Merchant / Personal',
      instructions: '1. Open your bKash app or dial *247#\n2. Select "Send Money" or "Payment" to 01711-223344\n3. Enter exact Order Amount\n4. Enter your phone number as reference\n5. Complete transaction and submit your 10-digit TrxID below for admin verification.'
    },
    nagad: {
      enabled: true,
      title: 'Nagad (নগদ)',
      number: '01811-223344',
      accountType: 'Personal',
      instructions: '1. Open Nagad app or dial *167#\n2. Select "Send Money" to 01811-223344\n3. Enter the total amount\n4. Confirm PIN & copy the 8-digit Transaction ID to paste below.'
    },
    rocket: {
      enabled: true,
      title: 'Rocket (রকেট)',
      number: '01911-223344-9',
      accountType: 'Personal',
      instructions: '1. Open Rocket app or dial *322#\n2. Select "Send Money" to 01911-223344-9\n3. Enter Transaction ID below.'
    }
  },
  homepageSections: {
    showHero: true,
    showCategories: true,
    showFlashSale: true,
    showFeatured: true,
    showBestSellers: true,
    showReviews: true,
    showWhyUs: true
  },
  policies: {
    aboutUs: `KH SHOP ZONE was founded with a singular commitment: delivering 100% authentic, premium lifestyle goods directly to homes across Bangladesh. From artisan perfumes and handwoven festive wear to genuine skincare and daily electronics, every single piece in our catalog is verified for authentic origin and superior craftsmanship.\n\nWe provide rapid delivery across all 64 districts in Bangladesh with complete transparency, Cash on Delivery convenience, and dedicated customer care.`,
    shippingPolicy: `We partner with Bangladesh's premier courier networks (Pathao, Steadfast, RedX, eCourier) to ensure safe, tracked nationwide delivery.\n\n• Inside Dhaka: Delivered within 24 to 48 hours. Shipping fee: ৳60.\n• Outside Dhaka: Delivered within 3 to 5 business days. Shipping fee: ৳120.\n• Orders exceeding ৳2,000 enjoy 100% FREE delivery nationwide.\n\nOnce dispatched, you will receive an SMS and courier tracking code to monitor delivery live.`,
    returnPolicy: `Your peace of mind is our utmost priority. We offer a hassle-free 7-day return and exchange policy:\n\n1. If an item arrives damaged, defective, or incorrect, report it within 24 hours of delivery.\n2. Products must remain unused, unwashed, and in original packaging with tags attached.\n3. Return courier pickup will be arranged, and refund/replacement processed within 3–5 business days.`,
    terms: `By placing an order on KH SHOP ZONE, you confirm all provided details (name, phone number, delivery address) are accurate.\n\nManual mobile banking transactions (bKash, Nagad, Rocket) require manual verification by our billing desk against bank statements before order dispatch. We never claim manual payments are auto-verified.\n\nOrders can be canceled by the customer anytime prior to dispatch while in 'Pending' status.`,
    privacy: `KH SHOP ZONE respects your personal privacy. Customer contact details, addresses, and transaction references are collected solely to fulfill and ship your orders.\n\nWe never sell, rent, or lease customer data to third parties. All internal admin actions are logged for security.`
  }
};

// Initial Seed Categories
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_perfumes',
    name: 'Perfumes & Fragrances',
    nameBn: 'পারফিউম ও সুগন্ধি',
    slug: 'perfumes-fragrances',
    description: 'Authentic Arabian Oud, French Eau De Parfum, and concentrated attars.',
    icon: 'Sparkles',
    image: '/src/assets/images/product_perfume_oud_1792643166621.jpg',
    sortOrder: 1
  },
  {
    id: 'cat_womens_fashion',
    name: "Women's Fashion",
    nameBn: 'মহিলাদের ফ্যাশন',
    slug: 'womens-fashion',
    description: 'Handcrafted Sarees, Salwar Kameez, Kurtis, and festive luxury wear.',
    icon: 'Shirt',
    image: '/src/assets/images/product_womens_saree_1792643168391.jpg',
    sortOrder: 2
  },
  {
    id: 'cat_mens_fashion',
    name: "Men's Fashion",
    nameBn: 'পুরুষদের ফ্যাশন',
    slug: 'mens-fashion',
    description: 'Embroidered Silk Panjabis, formal shirts, polo t-shirts, and denim.',
    icon: 'User',
    image: '/src/assets/images/product_mens_panjabi_1792643166484.jpg',
    sortOrder: 3
  },
  {
    id: 'cat_beauty_skincare',
    name: 'Beauty & Skincare',
    nameBn: 'সৌন্দর্য ও স্কিনকেয়ার',
    slug: 'beauty-skincare',
    description: 'Dermatologist-tested serums, moisturizers, cleansers, and organic care.',
    icon: 'Smile',
    image: '/src/assets/images/product_skincare_serum_1792643166908.jpg',
    sortOrder: 4
  },
  {
    id: 'cat_health_care',
    name: 'Health Care',
    nameBn: 'স্বাস্থ্য সেবা',
    slug: 'health-care',
    description: 'Wellness supplements, organic herbal extracts, and personal health monitors.',
    icon: 'HeartPulse',
    sortOrder: 5
  },
  {
    id: 'cat_electronics',
    name: 'Electronics & Gadgets',
    nameBn: 'ইলেকট্রনিক্স ও গ্যাজেট',
    slug: 'electronics',
    description: 'Wireless earbuds, smartwatches, power banks, and home gadgets.',
    icon: 'Laptop',
    sortOrder: 6
  },
  {
    id: 'cat_home_kitchen',
    name: 'Home & Kitchen',
    nameBn: 'হোম ও কিচেন',
    slug: 'home-kitchen',
    description: 'Smart kitchen appliances, cookware sets, and ergonomic home decor.',
    icon: 'Home',
    sortOrder: 7
  },
  {
    id: 'cat_footwear',
    name: 'Footwear',
    nameBn: 'জুতো ও স্যান্ডেল',
    slug: 'footwear',
    description: 'Pure leather formal shoes, casual loafers, and stylish sneakers.',
    icon: 'Footprints',
    sortOrder: 8
  },
  {
    id: 'cat_bags_accessories',
    name: 'Bags & Accessories',
    nameBn: 'ব্যাগ ও এক্সেসরিজ',
    slug: 'bags-accessories',
    description: 'Genuine leather wallets, travel duffels, backpacks, and sunglasses.',
    icon: 'Briefcase',
    sortOrder: 9
  },
  {
    id: 'cat_other_products',
    name: 'Other Lifestyle Products',
    nameBn: 'অন্যান্য পণ্য',
    slug: 'other-products',
    description: 'Seasonal gifts, lifestyle essentials, and curated collection items.',
    icon: 'Package',
    sortOrder: 10
  }
];

// Initial Seed Products
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_oud_royal',
    name: 'Nour El Desert — Royal Arabian Oud & Amber Eau De Parfum (100ml)',
    slug: 'nour-el-desert-royal-arabian-oud-amber-100ml',
    description: 'An opulent symphony of pure Cambodian aged oud, warm golden amber, and Damascus rose. Meticulously distilled for longevity exceeding 16 hours. Comes in a heavy crystal glass flacon with an engraved filigree gold stopper.',
    regularPrice: 4200,
    salePrice: 3350,
    discountPercentage: 20,
    sku: 'KH-FRAG-001',
    stock: 45,
    categoryId: 'cat_perfumes',
    subcategory: 'Eau De Parfum',
    images: ['/src/assets/images/product_perfume_oud_1792643166621.jpg'],
    variants: { sizes: ['50ml', '100ml'] },
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    rating: 4.9,
    reviewCount: 48,
    createdAt: new Date().toISOString(),
    supplierName: 'Al-Madina Oud Importers Ltd.',
    purchaseCost: 2100,
    internalNotes: 'Top seller before Eid. High margin item.'
  },
  {
    id: 'prod_mens_silk_panjabi',
    name: 'Heritage Royal Blue Embroidered Silk Panjabi',
    slug: 'heritage-royal-blue-embroidered-silk-panjabi',
    description: 'Tailored from rich Mulberry raw silk with intricate antique gold zari paisley embroidery around the placket and mandarin collar. Breathable, wrinkle-resistant luxury ethnic wear tailored for weddings and festive gatherings.',
    regularPrice: 3800,
    salePrice: 2950,
    discountPercentage: 22,
    sku: 'KH-MENS-002',
    stock: 28,
    categoryId: 'cat_mens_fashion',
    subcategory: 'Panjabi',
    images: ['/src/assets/images/product_mens_panjabi_1792643166484.jpg'],
    variants: {
      sizes: ['38', '40', '42', '44'],
      colors: ['Royal Blue', 'Deep Maroon', 'Emerald Green']
    },
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: false,
    rating: 4.8,
    reviewCount: 39,
    createdAt: new Date().toISOString(),
    supplierName: 'Bengal Heritage Weavers Narayanganj',
    purchaseCost: 1850,
    internalNotes: 'Custom stitching batch. Reorder when stock < 10.'
  },
  {
    id: 'prod_womens_organza_saree',
    name: 'Royal Pastel Organza Handcrafted Zari Saree',
    slug: 'royal-pastel-organza-handcrafted-zari-saree',
    description: 'Dreamy dual-tone pastel lilac and mint organza silk saree finished with scalloped border and intricate floral gold thread zari hand embroidery. Includes an unstitched designer blouse piece.',
    regularPrice: 5500,
    salePrice: 4250,
    discountPercentage: 23,
    sku: 'KH-WMNS-003',
    stock: 18,
    categoryId: 'cat_womens_fashion',
    subcategory: 'Saree',
    images: ['/src/assets/images/product_womens_saree_1792643168391.jpg'],
    variants: {
      colors: ['Pastel Lilac & Mint', 'Blush Pink & Peach', 'Powder Blue']
    },
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    rating: 5.0,
    reviewCount: 52,
    createdAt: new Date().toISOString(),
    supplierName: 'Tangail Artisan Cooperative',
    purchaseCost: 2800,
    internalNotes: 'Handloom certified. High demand from Dhaka and Chittagong.'
  },
  {
    id: 'prod_skincare_alchemy_duo',
    name: 'Botanical Alchemy Organic Glow Facial Serum & Moisturizer Duo',
    slug: 'botanical-alchemy-organic-glow-facial-serum-moisturizer-duo',
    description: 'Potent vitamin C and botanical hyaluronic acid serum paired with ultra-hydrating organic bamboo-cased moisturizer. Clinically formulated for radiant skin, dark spot reduction, and deep cellular hydration in tropical climates.',
    regularPrice: 2450,
    salePrice: 1850,
    discountPercentage: 24,
    sku: 'KH-SKIN-004',
    stock: 62,
    categoryId: 'cat_beauty_skincare',
    subcategory: 'Facial Care',
    images: ['/src/assets/images/product_skincare_serum_1792643166908.jpg'],
    variants: {
      sizes: ['Standard Set (30ml + 50g)', 'Jumbo Glow Set (60ml + 100g)']
    },
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: false,
    rating: 4.9,
    reviewCount: 74,
    createdAt: new Date().toISOString(),
    supplierName: 'Botanical Lab Korea / Dhaka Distributor',
    purchaseCost: 1100,
    internalNotes: 'Cruelty-free, organic certified batch.'
  },
  {
    id: 'prod_electronics_anc_earbuds',
    name: 'AcousticPulse Pro Active Noise Cancelling Wireless Earbuds',
    slug: 'acousticpulse-pro-anc-wireless-earbuds',
    description: 'Flagship 45dB Active Noise Cancellation with Transparency mode, 12mm graphene dynamic bass drivers, Bluetooth 5.4, and 38 hours battery case. IPX5 sweat and splash resistance.',
    regularPrice: 2990,
    salePrice: 2190,
    discountPercentage: 27,
    sku: 'KH-ELEC-005',
    stock: 40,
    categoryId: 'cat_electronics',
    subcategory: 'Audio',
    images: ['/src/assets/images/hero_kh_shop_zone_1792643165977.jpg'],
    variants: {
      colors: ['Matte Black', 'Starlight Silver']
    },
    isFeatured: false,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    rating: 4.7,
    reviewCount: 31,
    createdAt: new Date().toISOString(),
    supplierName: 'Shenzhen Tech Imports BD',
    purchaseCost: 1350,
    internalNotes: '1-year official replacement warranty provided.'
  },
  {
    id: 'prod_leather_oxford_shoes',
    name: 'Artisan Pure Full-Grain Leather Oxford Formal Shoes',
    slug: 'artisan-pure-leather-oxford-formal-shoes',
    description: 'Hand-burnished Bangladeshi full-grain cowhide leather with Goodyear welted rubber soles for all-day comfort. Designed for boardroom elegance and festive wedding footwear.',
    regularPrice: 4800,
    salePrice: 3650,
    discountPercentage: 24,
    sku: 'KH-FOOT-006',
    stock: 22,
    categoryId: 'cat_footwear',
    subcategory: 'Formal Shoes',
    images: ['/src/assets/images/hero_kh_shop_zone_1792643165977.jpg'],
    variants: {
      sizes: ['40', '41', '42', '43', '44'],
      colors: ['Rich Tan Brown', 'Midnight Black']
    },
    isFeatured: true,
    isBestSeller: false,
    isFlashSale: false,
    rating: 4.8,
    reviewCount: 26,
    createdAt: new Date().toISOString(),
    supplierName: 'Hazaribagh Premium Tanners',
    purchaseCost: 2200,
    internalNotes: 'Export-grade cowhide leather.'
  },
  {
    id: 'prod_leather_travel_duffel',
    name: 'Voyager Vintage Genuine Leather Travel Weekender Duffel',
    slug: 'voyager-vintage-leather-travel-weekender-duffel',
    description: 'Handcrafted water-resistant crazy horse leather duffel featuring brass hardware, reinforced luggage trolley strap, dedicated shoe compartment, and padded shoulder strap.',
    regularPrice: 5200,
    salePrice: 3950,
    discountPercentage: 24,
    sku: 'KH-BAG-007',
    stock: 15,
    categoryId: 'cat_bags_accessories',
    subcategory: 'Travel Bags',
    images: ['/src/assets/images/hero_kh_shop_zone_1792643165977.jpg'],
    variants: {
      colors: ['Cognac Brown', 'Dark Coffee']
    },
    isFeatured: false,
    isBestSeller: true,
    isFlashSale: false,
    rating: 4.9,
    reviewCount: 19,
    createdAt: new Date().toISOString(),
    supplierName: 'Craft Leather Guild BD',
    purchaseCost: 2400,
    internalNotes: 'Very popular gift item.'
  },
  {
    id: 'prod_digital_air_fryer',
    name: 'SmartChef 6L Digital Touchscreen Rapid Hot Air Fryer',
    slug: 'smartchef-6l-digital-rapid-hot-air-fryer',
    description: 'Cook crispy, healthy fries, samosas, roasted chicken, and pastries with 85% less oil. 8 one-touch cooking presets, 360-degree rapid air heat circulation, and non-stick dishwasher-safe basket.',
    regularPrice: 6500,
    salePrice: 4890,
    discountPercentage: 25,
    sku: 'KH-HOME-008',
    stock: 14,
    categoryId: 'cat_home_kitchen',
    subcategory: 'Kitchen Appliances',
    images: ['/src/assets/images/hero_kh_shop_zone_1792643165977.jpg'],
    variants: {
      colors: ['Obsidian Black', 'Pearl White']
    },
    isFeatured: true,
    isBestSeller: false,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    rating: 4.8,
    reviewCount: 42,
    createdAt: new Date().toISOString(),
    supplierName: 'Global Home Electronics Ltd.',
    purchaseCost: 3100,
    internalNotes: '2 years replacement warranty.'
  }
];

// Initial Seed Orders
export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'KH-829104',
    customerName: 'Tanvir Ahmed',
    customerPhone: '01712-345678',
    customerEmail: 'tanvir.ahmed@example.com',
    district: 'Dhaka',
    upazila: 'Gulshan',
    address: 'House 14, Road 45, Gulshan-2, Dhaka',
    orderNotes: 'Please ring the bell and call before delivery.',
    items: [
      {
        productId: 'prod_oud_royal',
        productName: 'Nour El Desert — Royal Arabian Oud & Amber (100ml)',
        productImage: '/src/assets/images/product_perfume_oud_1792643166621.jpg',
        variant: { size: '100ml' },
        quantity: 1,
        unitPrice: 3350,
        totalPrice: 3350
      }
    ],
    subtotal: 3350,
    discount: 335,
    couponCode: 'KH10',
    deliveryCharge: 0,
    deliveryZone: 'inside_dhaka',
    totalAmount: 3015,
    paymentMethod: 'bkash',
    paymentDetails: {
      senderNumber: '01712345678',
      trxId: '9K28M910QP',
      status: 'verified',
      verifiedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      verifiedBy: 'admin@khshopzone.com'
    },
    orderStatus: 'shipped',
    courierName: 'Steadfast Courier',
    courierTrackingCode: 'STF-948201',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'KH-829105',
    customerName: 'Farhana Sultana',
    customerPhone: '01819-876543',
    customerEmail: 'farhana.s@example.com',
    district: 'Chattogram',
    upazila: 'Panchlaish',
    address: 'Flat 4B, Green Valley Apartment, Nasirabad, Chittagong',
    orderNotes: 'Urgent delivery needed for Friday family event.',
    items: [
      {
        productId: 'prod_womens_organza_saree',
        productName: 'Royal Pastel Organza Handcrafted Zari Saree',
        productImage: '/src/assets/images/product_womens_saree_1792643168391.jpg',
        variant: { color: 'Pastel Lilac & Mint' },
        quantity: 1,
        unitPrice: 4250,
        totalPrice: 4250
      }
    ],
    subtotal: 4250,
    discount: 0,
    deliveryCharge: 0,
    deliveryZone: 'outside_dhaka',
    totalAmount: 4250,
    paymentMethod: 'cod',
    paymentDetails: { status: 'pending' },
    orderStatus: 'processing',
    courierName: 'Pathao Courier',
    courierTrackingCode: 'PTH-741029',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coup_kh10',
    code: 'KH10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscount: 1000,
    expiryDate: '2026-12-31',
    usageCount: 18,
    isActive: true
  },
  {
    id: 'coup_eid500',
    code: 'EID500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 3000,
    expiryDate: '2026-12-31',
    usageCount: 29,
    isActive: true
  },
  {
    id: 'coup_freeship',
    code: 'FREESHIP',
    discountType: 'free_shipping',
    discountValue: 120,
    minOrderAmount: 1500,
    expiryDate: '2026-12-31',
    usageCount: 14,
    isActive: true
  }
];

export const DEFAULT_ADMIN_EMAIL = 'hossenmdkamalhossen499@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = 'MSK01865@';

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_init',
    adminEmail: 'hossenmdkamalhossen499@gmail.com',
    action: 'SYSTEM_BOOTSTRAP',
    details: 'KH SHOP ZONE storage engine initialized with full product catalog and multi-carrier settings.',
    timestamp: new Date().toISOString()
  }
];

// Local Storage Helper Class
export class LocalStoreManager {
  public static getAdminEmail(): string {
    try {
      const stored = localStorage.getItem('kh_admin_email_custom');
      if (stored && stored !== 'admin@khshopzone.com' && stored.trim().length > 0) {
        return stored.trim().toLowerCase();
      }
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN_EMAIL;
  }

  public static setAdminEmail(newEmail: string): void {
    try {
      localStorage.setItem('kh_admin_email_custom', newEmail.trim().toLowerCase());
    } catch (e) {
      console.error(e);
    }
  }

  public static getAdminPassword(): string {
    try {
      const stored = localStorage.getItem('kh_admin_password_custom');
      if (stored && stored !== 'khAdmin@2026!' && stored.trim().length > 0) {
        return stored.trim();
      }
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN_PASSWORD;
  }

  public static setAdminPassword(newPass: string): void {
    try {
      localStorage.setItem('kh_admin_password_custom', newPass.trim());
    } catch (e) {
      console.error(e);
    }
  }

  public static verifyAdmin(email: string, pass: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const activeEmail = this.getAdminEmail().trim().toLowerCase();
    const activePass = this.getAdminPassword().trim();

    return cleanEmail === activeEmail && cleanPass === activePass;
  }

  public static getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem('kh_local_settings');
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem('kh_local_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }

  public static getProducts(): Product[] {
    try {
      const data = localStorage.getItem('kh_local_products');
      return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  public static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem('kh_local_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }

  public static getCategories(): Category[] {
    try {
      const data = localStorage.getItem('kh_local_categories');
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  public static saveCategories(cats: Category[]): void {
    try {
      localStorage.setItem('kh_local_categories', JSON.stringify(cats));
    } catch (e) {
      console.error(e);
    }
  }

  public static saveCategory(cat: Category): Category[] {
    const categories = this.getCategories();
    const idx = categories.findIndex(c => c.id === cat.id);
    if (idx !== -1) {
      categories[idx] = cat;
    } else {
      categories.push(cat);
    }
    categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    this.saveCategories(categories);
    return categories;
  }

  public static deleteCategory(id: string): Category[] {
    const categories = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(categories);
    return categories;
  }

  public static getOrders(): Order[] {
    try {
      const data = localStorage.getItem('kh_local_orders');
      return data ? JSON.parse(data) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  }

  public static saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem('kh_local_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }

  public static getCoupons(): Coupon[] {
    try {
      const data = localStorage.getItem('kh_local_coupons');
      return data ? JSON.parse(data) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  }

  public static saveCoupons(coupons: Coupon[]): void {
    try {
      localStorage.setItem('kh_local_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }

  public static getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem('kh_local_audit_logs');
      return data ? JSON.parse(data) : DEFAULT_AUDIT_LOGS;
    } catch {
      return DEFAULT_AUDIT_LOGS;
    }
  }

  public static logAudit(adminEmail: string, action: string, details: string): void {
    try {
      const current = this.getAuditLogs();
      const newLog: AuditLog = {
        id: `log_${Date.now()}`,
        adminEmail,
        action,
        details,
        timestamp: new Date().toISOString()
      };
      const updated = [newLog, ...current].slice(0, 100);
      localStorage.setItem('kh_local_audit_logs', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }
}
