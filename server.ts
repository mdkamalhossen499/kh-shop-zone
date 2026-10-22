import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// --- IN-MEMORY SESSION TOKEN STORAGE WITH EXPIRY ---
interface AdminSession {
  email: string;
  expiresAt: number;
}
const activeSessions = new Map<string, AdminSession>();

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Authentication middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }
  const token = authHeader.substring(7);
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }
  // Extend session (4 hours sliding window)
  session.expiresAt = Date.now() + 4 * 60 * 60 * 1000;
  (req as any).adminEmail = session.email;
  next();
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// 1. Get Site Settings
app.get('/api/settings', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Categories
app.get('/api/categories', (req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Public Products (supplier info & purchase cost stripped)
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const products = db.getPublicProducts();
    const { category, search, sort, isFeatured, isBestSeller, isFlashSale } = req.query;

    let filtered = [...products];

    if (category && typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter(p => p.categoryId === category || p.slug === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (isFeatured === 'true') filtered = filtered.filter(p => p.isFeatured);
    if (isBestSeller === 'true') filtered = filtered.filter(p => p.isBestSeller);
    if (isFlashSale === 'true') filtered = filtered.filter(p => p.isFlashSale);

    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json(filtered);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Single Product
app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const product = db.getPublicProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Create Order (Server validated calculations)
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      district,
      upazila,
      address,
      orderNotes,
      items,
      couponCode,
      deliveryZone,
      paymentMethod,
      paymentDetails
    } = req.body;

    if (!customerName || !customerPhone || !district || !upazila || !address) {
      return res.status(400).json({ error: 'Customer name, phone, district, upazila, and address are mandatory.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    const order = db.createOrder({
      customerName,
      customerPhone,
      customerEmail,
      district,
      upazila,
      address,
      orderNotes,
      items,
      couponCode,
      deliveryZone: deliveryZone === 'outside_dhaka' ? 'outside_dhaka' : 'inside_dhaka',
      paymentMethod: paymentMethod || 'cod',
      paymentDetails
    });

    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Track Order (By Order ID and/or Phone)
app.get('/api/orders/track', (req: Request, res: Response) => {
  try {
    const { orderId, phone } = req.query;
    if (!orderId && !phone) {
      return res.status(400).json({ error: 'Please provide either an Order Number or Phone Number.' });
    }

    if (orderId && typeof orderId === 'string') {
      const order = db.getOrderById(orderId.trim());
      if (order) {
        // Safe tracking view (hide confidential notes)
        return res.json([order]);
      }
      return res.status(404).json({ error: `Order with reference '${orderId}' was not found.` });
    }

    if (phone && typeof phone === 'string') {
      const orders = db.findOrdersByPhone(phone.trim());
      return res.json(orders);
    }

    res.status(404).json({ error: 'No orders found matching the criteria.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Cancel Order by Customer
app.post('/api/orders/cancel', (req: Request, res: Response) => {
  try {
    const { orderId, phone, reason } = req.body;
    if (!orderId || !phone) {
      return res.status(400).json({ error: 'Order ID and customer Phone number are required to cancel an order.' });
    }
    const result = db.cancelCustomerOrder(orderId, phone, reason);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Validate Coupon
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Please enter a coupon code.' });
    }
    const result = db.validateCoupon(code, Number(subtotal) || 0);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ valid: false, message: err.message });
  }
});

// 9. Product Reviews
app.get('/api/reviews/:productId', (req: Request, res: Response) => {
  try {
    const reviews = db.getProductReviews(req.params.productId);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', (req: Request, res: Response) => {
  try {
    const { productId, customerName, rating, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ error: 'Product ID, customer name, rating, and comment are required.' });
    }
    const review = db.addReview({
      productId,
      customerName,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      verifiedPurchase: true
    });
    res.status(201).json(review);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// SECRET ADMIN API ENDPOINTS
// ==========================================

// Admin Login with Rate Limiting
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || 'unknown';

    const attempt = loginAttempts.get(ip) || { count: 0, lockUntil: 0 };
    if (attempt.lockUntil > Date.now()) {
      const waitSec = Math.ceil((attempt.lockUntil - Date.now()) / 1000);
      return res.status(429).json({ error: `Too many failed attempts. Try again in ${waitSec} seconds.` });
    }

    const verification = db.verifyAdminLogin(email, password);
    if (!verification.success || !verification.user) {
      attempt.count += 1;
      if (attempt.count >= 5) {
        attempt.lockUntil = Date.now() + 5 * 60 * 1000; // 5 min lock
      }
      loginAttempts.set(ip, attempt);
      return res.status(401).json({ error: verification.error || 'Invalid admin credentials' });
    }

    // Reset attempts on success
    loginAttempts.delete(ip);

    // Create session token
    const token = generateSessionToken();
    const expiresAt = Date.now() + 4 * 60 * 60 * 1000; // 4 hours
    activeSessions.set(token, { email: verification.user.email, expiresAt });

    db.logAudit(verification.user.email, 'ADMIN_LOGIN', `Admin logged in from IP ${ip}`);

    res.json({
      success: true,
      token,
      user: verification.user
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Me
app.get('/api/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  const adminEmail = (req as any).adminEmail;
  const admin = db.getAdminByEmail(adminEmail);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  const { passwordHash, salt, ...safeUser } = admin;
  res.json(safeUser);
});

// Admin Change Password
app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }
    const result = db.changeAdminPassword(adminEmail, oldPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Change Credentials (Email and/or Password)
app.post('/api/admin/change-credentials', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const { currentPassword, newEmail, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required.' });
    }
    const result = db.changeAdminCredentials(adminEmail, currentPassword, newEmail, newPassword);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true, user: result.user, message: 'Admin credentials updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Products (includes supplier costs & internal notes)
app.get('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getAdminProducts());
});

app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const product = db.createProduct(req.body, adminEmail);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const product = db.updateProduct(req.params.id, req.body, adminEmail);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const success = db.deleteProduct(req.params.id, adminEmail);
    if (!success) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Categories
app.post('/api/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const category = db.saveCategory(req.body, adminEmail);
    res.json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const success = db.deleteCategory(req.params.id, adminEmail);
    if (!success) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Orders
app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getOrders());
});

app.put('/api/admin/orders/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const { orderStatus, paymentStatus, courierName, courierTrackingCode, cancellationReason } = req.body;
    const order = db.updateOrderStatus(
      req.params.id,
      { orderStatus, paymentStatus, courierName, courierTrackingCode, cancellationReason },
      adminEmail
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Settings
app.put('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const updated = db.updateSettings(req.body, adminEmail);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Coupons
app.get('/api/admin/coupons', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getCoupons());
});

app.post('/api/admin/coupons', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const coupon = db.saveCoupon(req.body, adminEmail);
    res.json(coupon);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/coupons/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const success = db.deleteCoupon(req.params.id, adminEmail);
    if (!success) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getAuditLogs());
});

// Admin Backup & Restore
app.get('/api/admin/backup', requireAdminAuth, (req: Request, res: Response) => {
  const data = db.getRawBackup();
  res.setHeader('Content-Disposition', `attachment; filename=kh_shop_zone_backup_${Date.now()}.json`);
  res.json(data);
});

app.post('/api/admin/restore', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminEmail = (req as any).adminEmail;
    const success = db.restoreBackup(req.body, adminEmail);
    res.json({ success });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// SPA / STATIC SERVING & VITE DEV SERVER
// ==========================================
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KH SHOP ZONE Server running on port ${PORT} (isProduction: ${isProduction})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
