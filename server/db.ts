import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, Category, Order, Coupon, Review, SiteSettings, AdminUser, AuditLog } from '../src/types/ecommerce';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ecommerce_db.json');

export interface DatabaseSchema {
  settings: SiteSettings;
  admins: AdminUser[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  auditLogs: AuditLog[];
}

export function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

const defaultSalt = 'kh_shop_zone_salt_2026';
const defaultHashedPassword = hashPassword('MSK01865@', defaultSalt);

const initialDatabase: DatabaseSchema = {
  settings: {
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
  },
  admins: [
    {
      id: 'admin_1',
      email: 'hossenmdkamalhossen499@gmail.com',
      name: 'Kamal Hossen (Chief Admin)',
      role: 'super_admin',
      passwordHash: defaultHashedPassword,
      salt: defaultSalt,
      createdAt: new Date().toISOString()
    }
  ],
  categories: [
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
  ],
  products: [
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
      images: [
        '/src/assets/images/product_perfume_oud_1792643166621.jpg'
      ],
      variants: {
        sizes: ['50ml', '100ml']
      },
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
      images: [
        '/src/assets/images/product_mens_panjabi_1792643166484.jpg'
      ],
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
      images: [
        '/src/assets/images/product_womens_saree_1792643168391.jpg'
      ],
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
      images: [
        '/src/assets/images/product_skincare_serum_1792643166908.jpg'
      ],
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
      images: [
        '/src/assets/images/hero_kh_shop_zone_1792643165977.jpg'
      ],
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
      images: [
        '/src/assets/images/hero_kh_shop_zone_1792643165977.jpg'
      ],
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
      images: [
        '/src/assets/images/hero_kh_shop_zone_1792643165977.jpg'
      ],
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
      images: [
        '/src/assets/images/hero_kh_shop_zone_1792643165977.jpg'
      ],
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
  ],
  orders: [
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
      district: 'Chittagong',
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
      paymentDetails: {
        status: 'pending'
      },
      orderStatus: 'processing',
      courierName: 'Pathao Courier',
      courierTrackingCode: 'PTH-741029',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  coupons: [
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
  ],
  reviews: [
    {
      id: 'rev_1',
      productId: 'prod_oud_royal',
      customerName: 'Kazi Mahbub',
      rating: 5,
      comment: 'Authentic Oud! Fragrance lasts the entire day even in warm weather. Received inside Dhaka within 24 hours via Steadfast.',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'rev_2',
      productId: 'prod_mens_silk_panjabi',
      customerName: 'Shahriar Kabir',
      rating: 5,
      comment: 'The stitching and Mulberry silk quality surpassed my expectations. Size 40 was a perfect tailored fit.',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: 'rev_3',
      productId: 'prod_womens_organza_saree',
      customerName: 'Nusrat Jahan',
      rating: 5,
      comment: 'Extremely elegant and featherweight. The gold zari finish is stunning in person. Highly recommended KH SHOP ZONE!',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ],
  auditLogs: [
    {
      id: 'log_1',
      adminEmail: 'admin@khshopzone.com',
      action: 'SYSTEM_BOOTSTRAP',
      details: 'Initialized KH SHOP ZONE store database with multi-category catalog and payment configuration.',
      timestamp: new Date().toISOString()
    }
  ]
};

export class Database {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: { ...initialDatabase.settings, ...parsed.settings },
          admins: parsed.admins || initialDatabase.admins,
          categories: parsed.categories || initialDatabase.categories,
          products: parsed.products || initialDatabase.products,
          orders: parsed.orders || initialDatabase.orders,
          coupons: parsed.coupons || initialDatabase.coupons,
          reviews: parsed.reviews || initialDatabase.reviews,
          auditLogs: parsed.auditLogs || initialDatabase.auditLogs
        };
      }
    } catch (e) {
      console.error('Error loading DB file, re-initializing defaults:', e);
    }
    this.saveDatabase(initialDatabase);
    return initialDatabase;
  }

  public save(): void {
    this.saveDatabase(this.db);
  }

  private saveDatabase(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database file:', e);
    }
  }

  // --- SETTINGS ---
  public getSettings(): SiteSettings {
    return this.db.settings;
  }

  public updateSettings(newSettings: Partial<SiteSettings>, adminEmail: string): SiteSettings {
    this.db.settings = { ...this.db.settings, ...newSettings };
    this.logAudit(adminEmail, 'UPDATE_SETTINGS', 'Updated store branding, policies, or delivery settings');
    this.save();
    return this.db.settings;
  }

  // --- PRODUCTS ---
  public getPublicProducts(): Omit<Product, 'supplierName' | 'purchaseCost' | 'internalNotes'>[] {
    return this.db.products.map(({ supplierName, purchaseCost, internalNotes, ...publicProduct }) => publicProduct);
  }

  public getAdminProducts(): Product[] {
    return this.db.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.db.products.find(p => p.id === id);
  }

  public getPublicProductById(id: string): Omit<Product, 'supplierName' | 'purchaseCost' | 'internalNotes'> | undefined {
    const product = this.getProductById(id);
    if (!product) return undefined;
    const { supplierName, purchaseCost, internalNotes, ...publicProduct } = product;
    return publicProduct;
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt'>, adminEmail: string): Product {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.db.products.unshift(newProduct);
    this.logAudit(adminEmail, 'CREATE_PRODUCT', `Created product: ${newProduct.name} (SKU: ${newProduct.sku})`);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>, adminEmail: string): Product | null {
    const idx = this.db.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.db.products[idx] = { ...this.db.products[idx], ...updates };
    this.logAudit(adminEmail, 'UPDATE_PRODUCT', `Updated product: ${this.db.products[idx].name} (ID: ${id})`);
    this.save();
    return this.db.products[idx];
  }

  public deleteProduct(id: string, adminEmail: string): boolean {
    const idx = this.db.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const name = this.db.products[idx].name;
    this.db.products.splice(idx, 1);
    this.logAudit(adminEmail, 'DELETE_PRODUCT', `Deleted product: ${name} (ID: ${id})`);
    this.save();
    return true;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.db.categories.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public saveCategory(category: Category, adminEmail: string): Category {
    const idx = this.db.categories.findIndex(c => c.id === category.id);
    if (idx !== -1) {
      this.db.categories[idx] = category;
      this.logAudit(adminEmail, 'UPDATE_CATEGORY', `Updated category: ${category.name}`);
    } else {
      this.db.categories.push(category);
      this.logAudit(adminEmail, 'CREATE_CATEGORY', `Created category: ${category.name}`);
    }
    this.save();
    return category;
  }

  public deleteCategory(id: string, adminEmail: string): boolean {
    const idx = this.db.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    const catName = this.db.categories[idx].name;
    this.db.categories.splice(idx, 1);
    this.logAudit(adminEmail, 'DELETE_CATEGORY', `Deleted category: ${catName}`);
    this.save();
    return true;
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return this.db.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.db.orders.find(o => o.id.toLowerCase() === id.toLowerCase());
  }

  public findOrdersByPhone(phone: string): Order[] {
    const cleanPhone = phone.replace(/\D/g, '');
    return this.db.orders.filter(o => o.customerPhone.replace(/\D/g, '').includes(cleanPhone));
  }

  public createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    district: string;
    upazila: string;
    address: string;
    orderNotes?: string;
    items: { productId: string; variant?: { size?: string; color?: string }; quantity: number }[];
    couponCode?: string;
    deliveryZone: 'inside_dhaka' | 'outside_dhaka';
    paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket';
    paymentDetails?: { senderNumber?: string; trxId?: string };
  }): Order {
    // 1. Calculate trusted order total server-side
    let subtotal = 0;
    const calculatedItems = orderData.items.map(item => {
      const product = this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      const unitPrice = product.salePrice;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      return {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] || '',
        variant: item.variant,
        quantity: item.quantity,
        unitPrice,
        totalPrice: lineTotal
      };
    });

    // 2. Validate Coupon server-side
    let discount = 0;
    if (orderData.couponCode) {
      const coupon = this.db.coupons.find(c => c.code.toUpperCase() === orderData.couponCode?.toUpperCase() && c.isActive);
      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === 'fixed') {
          discount = coupon.discountValue;
        } else if (coupon.discountType === 'free_shipping') {
          // Handled in delivery fee
        }
        coupon.usageCount += 1;
      }
    }

    // 3. Calculate Delivery Fee
    let deliveryCharge = orderData.deliveryZone === 'inside_dhaka'
      ? this.db.settings.delivery.insideDhakaFee
      : this.db.settings.delivery.outsideDhakaFee;

    if (subtotal >= this.db.settings.delivery.freeDeliveryThreshold) {
      deliveryCharge = 0;
    }
    if (orderData.couponCode && orderData.couponCode.toUpperCase() === 'FREESHIP') {
      deliveryCharge = 0;
    }

    const totalAmount = Math.max(0, subtotal - discount + deliveryCharge);

    // 4. Generate unique order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `KH-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      district: orderData.district,
      upazila: orderData.upazila,
      address: orderData.address,
      orderNotes: orderData.orderNotes,
      items: calculatedItems,
      subtotal,
      discount,
      couponCode: discount > 0 || deliveryCharge === 0 ? orderData.couponCode : undefined,
      deliveryCharge,
      deliveryZone: orderData.deliveryZone,
      totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentDetails: {
        senderNumber: orderData.paymentDetails?.senderNumber || '',
        trxId: orderData.paymentDetails?.trxId || '',
        status: orderData.paymentMethod === 'cod' ? 'pending' : (orderData.paymentDetails?.trxId ? 'pending' : 'failed')
      },
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Deduct stock
    for (const item of calculatedItems) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    this.db.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(
    orderId: string,
    updates: {
      orderStatus?: Order['orderStatus'];
      paymentStatus?: Order['paymentDetails']['status'];
      courierName?: string;
      courierTrackingCode?: string;
      cancellationReason?: string;
    },
    adminEmail: string
  ): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    if (updates.orderStatus) {
      order.orderStatus = updates.orderStatus;
    }
    if (updates.paymentStatus) {
      order.paymentDetails.status = updates.paymentStatus;
      if (updates.paymentStatus === 'verified' || updates.paymentStatus === 'paid') {
        order.paymentDetails.verifiedAt = new Date().toISOString();
        order.paymentDetails.verifiedBy = adminEmail;
      }
    }
    if (updates.courierName !== undefined) order.courierName = updates.courierName;
    if (updates.courierTrackingCode !== undefined) order.courierTrackingCode = updates.courierTrackingCode;
    if (updates.cancellationReason !== undefined) order.cancellationReason = updates.cancellationReason;

    order.updatedAt = new Date().toISOString();
    this.logAudit(adminEmail, 'UPDATE_ORDER', `Updated Order ${orderId}: Status=${order.orderStatus}, Payment=${order.paymentDetails.status}`);
    this.save();
    return order;
  }

  public cancelCustomerOrder(orderId: string, phone: string, reason: string): { success: boolean; message: string; order?: Order } {
    const order = this.getOrderById(orderId);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    // Verify phone match
    const cleanOrderPhone = order.customerPhone.replace(/\D/g, '');
    const cleanInputPhone = phone.replace(/\D/g, '');
    if (!cleanOrderPhone.endsWith(cleanInputPhone) && !cleanInputPhone.endsWith(cleanOrderPhone)) {
      return { success: false, message: 'Phone number does not match order record' };
    }
    if (order.orderStatus !== 'pending') {
      return { success: false, message: `Orders that are already '${order.orderStatus}' cannot be self-cancelled. Please contact customer care.` };
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason || 'Cancelled by customer';
    order.updatedAt = new Date().toISOString();

    // Restore stock
    for (const item of order.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        prod.stock += item.quantity;
      }
    }

    this.save();
    return { success: true, message: 'Order has been successfully cancelled.', order };
  }

  // --- COUPONS ---
  public getCoupons(): Coupon[] {
    return this.db.coupons;
  }

  public validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; freeShipping: boolean; message: string } {
    const coupon = this.db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, freeShipping: false, message: 'Invalid or expired coupon code' };
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discount: 0, freeShipping: false, message: 'This coupon has expired' };
    }
    if (subtotal < coupon.minOrderAmount) {
      return { valid: false, discount: 0, freeShipping: false, message: `Minimum order amount of ৳${coupon.minOrderAmount} required for this coupon` };
    }

    if (coupon.discountType === 'percentage') {
      let discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
      return { valid: true, discount, freeShipping: false, message: `${coupon.discountValue}% discount applied!` };
    }

    if (coupon.discountType === 'fixed') {
      return { valid: true, discount: coupon.discountValue, freeShipping: false, message: `৳${coupon.discountValue} discount applied!` };
    }

    if (coupon.discountType === 'free_shipping') {
      return { valid: true, discount: 0, freeShipping: true, message: 'Free Shipping coupon applied!' };
    }

    return { valid: false, discount: 0, freeShipping: false, message: 'Invalid coupon' };
  }

  public saveCoupon(coupon: Coupon, adminEmail: string): Coupon {
    const idx = this.db.coupons.findIndex(c => c.id === coupon.id);
    if (idx !== -1) {
      this.db.coupons[idx] = coupon;
      this.logAudit(adminEmail, 'UPDATE_COUPON', `Updated coupon ${coupon.code}`);
    } else {
      this.db.coupons.push(coupon);
      this.logAudit(adminEmail, 'CREATE_COUPON', `Created coupon ${coupon.code}`);
    }
    this.save();
    return coupon;
  }

  public deleteCoupon(id: string, adminEmail: string): boolean {
    const idx = this.db.coupons.findIndex(c => c.id === id);
    if (idx === -1) return false;
    const code = this.db.coupons[idx].code;
    this.db.coupons.splice(idx, 1);
    this.logAudit(adminEmail, 'DELETE_COUPON', `Deleted coupon ${code}`);
    this.save();
    return true;
  }

  // --- REVIEWS ---
  public getProductReviews(productId: string): Review[] {
    return this.db.reviews.filter(r => r.productId === productId);
  }

  public getAllReviews(): Review[] {
    return this.db.reviews;
  }

  public addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.db.reviews.unshift(newReview);

    // Update product rating
    const prod = this.getProductById(review.productId);
    if (prod) {
      const allProductReviews = this.db.reviews.filter(r => r.productId === review.productId);
      const avg = allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length;
      prod.rating = parseFloat(avg.toFixed(1));
      prod.reviewCount = allProductReviews.length;
    }

    this.save();
    return newReview;
  }

  // --- ADMIN AUTH & AUDIT LOGS ---
  public getAdminByEmail(email: string): AdminUser | undefined {
    return this.db.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  public verifyAdminLogin(email: string, password: string): { success: boolean; user?: Omit<AdminUser, 'passwordHash' | 'salt'>; error?: string } {
    const admin = this.getAdminByEmail(email);
    if (!admin) {
      return { success: false, error: 'Invalid admin credentials' };
    }
    const computedHash = hashPassword(password, admin.salt);
    if (computedHash !== admin.passwordHash) {
      return { success: false, error: 'Invalid admin credentials' };
    }
    const { passwordHash, salt, ...safeUser } = admin;
    return { success: true, user: safeUser };
  }

  public changeAdminPassword(email: string, oldPass: string, newPass: string): { success: boolean; error?: string } {
    return this.changeAdminCredentials(email, oldPass, undefined, newPass);
  }

  public changeAdminCredentials(
    currentEmail: string,
    currentPass: string,
    newEmail?: string,
    newPass?: string
  ): { success: boolean; user?: Omit<AdminUser, 'passwordHash' | 'salt'>; error?: string } {
    const admin = this.getAdminByEmail(currentEmail);
    if (!admin) return { success: false, error: 'Admin account not found' };
    const currentHash = hashPassword(currentPass, admin.salt);
    if (currentHash !== admin.passwordHash) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (newPass && newPass.trim().length >= 6) {
      const newSalt = generateSalt();
      admin.salt = newSalt;
      admin.passwordHash = hashPassword(newPass.trim(), newSalt);
    }

    if (newEmail && newEmail.trim().length > 0 && newEmail.trim().toLowerCase() !== admin.email.toLowerCase()) {
      admin.email = newEmail.trim().toLowerCase();
    }

    this.logAudit(admin.email, 'UPDATE_CREDENTIALS', 'Successfully updated admin credentials');
    this.save();
    const { passwordHash, salt, ...safeUser } = admin;
    return { success: true, user: safeUser };
  }

  public logAudit(adminEmail: string, action: string, details: string): void {
    const entry: AuditLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      adminEmail,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.db.auditLogs.unshift(entry);
    // Keep max 200 logs
    if (this.db.auditLogs.length > 200) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 200);
    }
  }

  public getAuditLogs(): AuditLog[] {
    return this.db.auditLogs;
  }

  public getRawBackup(): DatabaseSchema {
    return this.db;
  }

  public restoreBackup(data: Partial<DatabaseSchema>, adminEmail: string): boolean {
    if (data.products && Array.isArray(data.products)) this.db.products = data.products;
    if (data.categories && Array.isArray(data.categories)) this.db.categories = data.categories;
    if (data.orders && Array.isArray(data.orders)) this.db.orders = data.orders;
    if (data.settings) this.db.settings = { ...this.db.settings, ...data.settings };
    if (data.coupons && Array.isArray(data.coupons)) this.db.coupons = data.coupons;
    this.logAudit(adminEmail, 'RESTORE_BACKUP', 'Restored store backup data');
    this.save();
    return true;
  }
}

export const db = new Database();
