import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LayoutDashboard, Package, ShoppingCart, Tag, Settings,
  FileText, Database, LogOut, Key, Search, Plus, Trash2, Edit3, Check,
  AlertTriangle, Eye, EyeOff, Printer, RefreshCw, X, ArrowUpRight, DollarSign,
  TrendingUp, Users, Truck, Clock, Lock, Upload, Image as ImageIcon
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useStore } from '../context/StoreContext';
import { Product, Order, Category, Coupon, AuditLog, SiteSettings } from '../types/ecommerce';
import { LocalStoreManager } from '../utils/localStoreFallback';

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { adminUser, isAuthenticated, login, logout, changePassword, fetchWithAuth } = useAdmin();
  const { categories: globalCategories, refreshCategories, refreshSettings } = useStore();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'products' | 'categories' | 'coupons' | 'settings' | 'audit' | 'backup'
  >('dashboard');

  // Login form state (Blank by default for security, no public pre-fill)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(globalCategories);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Selected order for inspection or invoice
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product modal (Add / Edit)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [showProductUrlInput, setShowProductUrlInput] = useState(false);

  // Category modal (Add / Edit)
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [showCategoryUrlInput, setShowCategoryUrlInput] = useState(false);

  // Coupon modal
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Load Admin Data when authenticated
  const loadAdminData = async () => {
    if (!isAuthenticated) return;
    setLoadingData(true);
    try {
      const [ordersRes, productsRes, couponsRes, auditRes, settingsRes] = await Promise.allSettled([
        fetchWithAuth('/api/admin/orders'),
        fetchWithAuth('/api/admin/products'),
        fetchWithAuth('/api/admin/coupons'),
        fetchWithAuth('/api/admin/audit-logs'),
        fetch('/api/settings')
      ]);

      // 1. Orders
      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok && ordersRes.value.headers.get('content-type')?.includes('application/json')) {
        setOrders(await ordersRes.value.json());
      } else {
        setOrders(LocalStoreManager.getOrders());
      }

      // 2. Products
      if (productsRes.status === 'fulfilled' && productsRes.value.ok && productsRes.value.headers.get('content-type')?.includes('application/json')) {
        setAdminProducts(await productsRes.value.json());
      } else {
        setAdminProducts(LocalStoreManager.getProducts());
      }

      // 3. Coupons
      if (couponsRes.status === 'fulfilled' && couponsRes.value.ok && couponsRes.value.headers.get('content-type')?.includes('application/json')) {
        setCoupons(await couponsRes.value.json());
      } else {
        setCoupons(LocalStoreManager.getCoupons());
      }

      // 4. Audit Logs
      if (auditRes.status === 'fulfilled' && auditRes.value.ok && auditRes.value.headers.get('content-type')?.includes('application/json')) {
        setAuditLogs(await auditRes.value.json());
      } else {
        setAuditLogs(LocalStoreManager.getAuditLogs());
      }

      // 5. Settings
      if (settingsRes.status === 'fulfilled' && settingsRes.value.ok && settingsRes.value.headers.get('content-type')?.includes('application/json')) {
        setSettingsForm(await settingsRes.value.json());
      } else {
        setSettingsForm(LocalStoreManager.getSettings());
      }
    } catch {
      // Complete client fallback for static/Vercel host
      setOrders(LocalStoreManager.getOrders());
      setAdminProducts(LocalStoreManager.getProducts());
      setCoupons(LocalStoreManager.getCoupons());
      setAuditLogs(LocalStoreManager.getAuditLogs());
      setSettingsForm(LocalStoreManager.getSettings());
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const result = await login(loginEmail, loginPass);
    if (!result.success) {
      setLoginError(result.error || 'Login failed. Please check credentials.');
    }
    setLoginLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (!oldPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    const result = await changePassword(oldPassword, newPassword);
    if (result.success) {
      setPasswordMsg('Password changed successfully! Use this password for your next login.');
      setTimeout(() => {
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordMsg('');
      }, 1800);
    } else {
      setPasswordError(result.error || 'Failed to update password. Please check your current password.');
    }
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = async (
    orderId: string,
    updates: {
      orderStatus?: Order['orderStatus'];
      paymentStatus?: Order['paymentDetails']['status'];
      courierName?: string;
      courierTrackingCode?: string;
    }
  ) => {
    let updatedOrder: Order | null = null;
    try {
      const res = await fetchWithAuth(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        updatedOrder = await res.json();
      }
    } catch {
      // server unreachable
    }

    if (!updatedOrder) {
      // Local storage fallback update
      const currentOrders = LocalStoreManager.getOrders();
      const idx = currentOrders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        currentOrders[idx] = {
          ...currentOrders[idx],
          ...updates,
          paymentDetails: {
            ...currentOrders[idx].paymentDetails,
            ...(updates.paymentStatus ? { status: updates.paymentStatus, verifiedAt: new Date().toISOString(), verifiedBy: adminUser?.email || 'admin@khshopzone.com' } : {})
          },
          updatedAt: new Date().toISOString()
        };
        LocalStoreManager.saveOrders(currentOrders);
        updatedOrder = currentOrders[idx];
      }
    }

    if (updatedOrder) {
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder! : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(updatedOrder);
      LocalStoreManager.logAudit(
        adminUser?.email || 'admin@khshopzone.com',
        'UPDATE_ORDER',
        `Updated Order ${orderId}: Status=${updates.orderStatus || 'same'}, Payment=${updates.paymentStatus || 'same'}`
      );
    }
  };

  // --- PRODUCT ACTIONS ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.salePrice) return;

    const payload: Product = {
      id: editingProduct.id || `prod_${Date.now()}`,
      name: editingProduct.name,
      slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: editingProduct.description || '',
      regularPrice: Number(editingProduct.regularPrice) || Number(editingProduct.salePrice),
      salePrice: Number(editingProduct.salePrice),
      stock: Number(editingProduct.stock) || 0,
      sku: editingProduct.sku || `KH-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryId: editingProduct.categoryId || 'cat_perfumes',
      subcategory: editingProduct.subcategory || 'General',
      purchaseCost: Number(editingProduct.purchaseCost) || 0,
      supplierName: editingProduct.supplierName || '',
      discountPercentage: Number(editingProduct.discountPercentage) || 0,
      rating: Number(editingProduct.rating) || 5.0,
      reviewCount: Number(editingProduct.reviewCount) || 1,
      isFeatured: !!editingProduct.isFeatured,
      isBestSeller: !!editingProduct.isBestSeller,
      isFlashSale: !!editingProduct.isFlashSale,
      createdAt: editingProduct.createdAt || new Date().toISOString(),
      images: editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : ['/src/assets/images/product_perfume_oud_1792643166621.jpg']
    };

    let serverSaved = false;
    try {
      const isEdit = !!editingProduct.id;
      const url = isEdit ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        serverSaved = true;
      }
    } catch {
      // fallback
    }

    // Always update local storage
    const currentProducts = LocalStoreManager.getProducts();
    const existingIdx = currentProducts.findIndex(p => p.id === payload.id);
    if (existingIdx !== -1) {
      currentProducts[existingIdx] = payload;
    } else {
      currentProducts.unshift(payload);
    }
    LocalStoreManager.saveProducts(currentProducts);
    setAdminProducts(currentProducts);
    LocalStoreManager.logAudit(
      adminUser?.email || 'admin@khshopzone.com',
      existingIdx !== -1 ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT',
      `Saved product: ${payload.name} (SKU: ${payload.sku})`
    );

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetchWithAuth(`/api/admin/products/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }

    const currentProducts = LocalStoreManager.getProducts().filter(p => p.id !== id);
    LocalStoreManager.saveProducts(currentProducts);
    setAdminProducts(currentProducts);
    LocalStoreManager.logAudit(adminUser?.email || 'admin@khshopzone.com', 'DELETE_PRODUCT', `Deleted product ID: ${id}`);
  };

  // Keep local categories in sync with global context
  useEffect(() => {
    setCategories(globalCategories);
  }, [globalCategories]);

  // --- CATEGORY ACTIONS ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    const payload: Category = {
      id: editingCategory.id || `cat_${Date.now()}`,
      name: editingCategory.name.trim(),
      nameBn: editingCategory.nameBn?.trim() || '',
      slug: editingCategory.slug?.trim() || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: editingCategory.description || '',
      icon: editingCategory.icon || 'Tag',
      image: editingCategory.image || '',
      sortOrder: Number(editingCategory.sortOrder) || (categories.length + 1)
    };

    try {
      const isEdit = !!editingCategory.id;
      const url = isEdit ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
      await fetchWithAuth(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // fallback to local storage
    }

    const updated = LocalStoreManager.saveCategory(payload);
    setCategories(updated);
    refreshCategories();
    LocalStoreManager.logAudit(
      adminUser?.email || 'admin@khshopzone.com',
      editingCategory.id ? 'UPDATE_CATEGORY' : 'CREATE_CATEGORY',
      `Saved category: ${payload.name} (${payload.id})`
    );
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"? This will remove it from the store.`)) return;

    try {
      await fetchWithAuth(`/api/admin/categories/${catId}`, { method: 'DELETE' });
    } catch {
      // fallback
    }

    const updated = LocalStoreManager.deleteCategory(catId);
    setCategories(updated);
    refreshCategories();
    LocalStoreManager.logAudit(
      adminUser?.email || 'admin@khshopzone.com',
      'DELETE_CATEGORY',
      `Deleted category: ${catName} (${catId})`
    );
  };

  // --- IMAGE UPLOAD HANDLERS ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settingsForm) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setSettingsForm({ ...settingsForm, logoUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setEditingProduct({
          ...editingProduct,
          images: [base64, ...(editingProduct.images?.slice(1) || [])]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setEditingCategory({
          ...editingCategory,
          image: base64
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    try {
      await fetchWithAuth('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
    } catch {
      // fallback
    }

    LocalStoreManager.saveSettings(settingsForm);
    LocalStoreManager.logAudit(adminUser?.email || 'admin@khshopzone.com', 'UPDATE_SETTINGS', 'Updated store branding & delivery fees');
    alert('Site settings updated successfully!');
    refreshSettings();
  };

  // Calculate Dashboard Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'cancelled' ? sum + o.totalAmount : sum), 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending').length;
  const verifiedPaymentsCount = orders.filter(o => o.paymentDetails.status === 'verified' || o.paymentDetails.status === 'paid').length;
  const lowStockProducts = adminProducts.filter(p => p.stock <= 5);

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Filtered Products
  const filteredProducts = adminProducts.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
    return matchSearch && matchCat;
  });

  // If Not Authenticated: Render Secret Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
        <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 font-display">KH SHOP ZONE — Admin Access</h2>
            <p className="text-xs text-neutral-500 mt-1">Authorized store administrators only</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Admin Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  required
                  placeholder="Enter admin password"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  tabIndex={-1}
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="mt-5 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
            <div className="flex items-center justify-center gap-1.5 text-neutral-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted Store Administration Session</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div className="fixed inset-0 z-50 bg-neutral-100 flex flex-col overflow-hidden">
      {/* Admin Top Navigation */}
      <div className="bg-neutral-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-sm">
            KH
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">KH SHOP ZONE — Secret Admin Console</div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-2">
              <span>{adminUser?.name}</span>
              <span>·</span>
              <span className="uppercase text-amber-400 font-semibold">{adminUser?.role}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-neutral-400" />
            <span>Change Password</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-red-950 text-neutral-200 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Exit Admin View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Admin Body: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar Navigation */}
        <aside className="w-56 bg-white border-r border-neutral-200 p-3 flex flex-col justify-between shrink-0 overflow-y-auto hidden md:flex">
          <div className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'dashboard' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'orders' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4" />
                <span>Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'products' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Stock</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'categories' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'coupons' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons & Promos</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'settings' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Branding & Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'audit' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'backup' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Backup & Restore</span>
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-200 text-[11px] text-neutral-400 text-center">
            Server Session Active
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 bg-neutral-100 overflow-y-auto p-4 sm:p-6">
          {/* Mobile Tab Switcher */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-3 text-xs">
            {['dashboard', 'orders', 'products', 'settings', 'audit'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize ${
                  activeTab === t ? 'bg-neutral-900 text-white font-bold' : 'bg-white text-neutral-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Total Sales (BDT)</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums">
                    ৳{totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">
                    Across {orders.length} orders
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Pending Orders</span>
                    <ShoppingCart className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums">
                    {pendingOrdersCount}
                  </div>
                  <div className="text-[11px] text-amber-600 font-medium mt-1">
                    Requires admin dispatch
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Verified Payments</span>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums">
                    {verifiedPaymentsCount}
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium mt-1">
                    bKash / Nagad / Rocket checked
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Low Stock Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums">
                    {lowStockProducts.length}
                  </div>
                  <div className="text-[11px] text-rose-600 font-medium mt-1">
                    Stock $\le 5$ units
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-neutral-600 hover:text-neutral-900 font-semibold underline"
                  >
                    View All Orders
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">Order ID</th>
                        <th className="py-2.5 px-4 font-medium">Customer</th>
                        <th className="py-2.5 px-4 font-medium">City/District</th>
                        <th className="py-2.5 px-4 font-medium">Total</th>
                        <th className="py-2.5 px-4 font-medium">Payment</th>
                        <th className="py-2.5 px-4 font-medium">Status</th>
                        <th className="py-2.5 px-4 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.slice(0, 6).map(order => (
                        <tr key={order.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-4 font-mono font-bold text-neutral-900">{order.id}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold block text-neutral-900">{order.customerName}</span>
                            <span className="text-[11px] text-neutral-500">{order.customerPhone}</span>
                          </td>
                          <td className="py-3 px-4">{order.district}</td>
                          <td className="py-3 px-4 font-bold tabular-nums">৳{order.totalAmount.toLocaleString()}</td>
                          <td className="py-3 px-4 uppercase text-[11px] font-semibold">
                            {order.paymentMethod} ({order.paymentDetails.status})
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                              order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setActiveTab('orders');
                              }}
                              className="px-2.5 py-1 bg-neutral-900 text-white rounded font-medium text-[11px]"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, customer name or phone..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className="w-full text-xs bg-transparent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500 font-medium">Filter Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">Order ID</th>
                        <th className="py-2.5 px-4 font-medium">Customer</th>
                        <th className="py-2.5 px-4 font-medium">Address</th>
                        <th className="py-2.5 px-4 font-medium">Items</th>
                        <th className="py-2.5 px-4 font-medium">Total</th>
                        <th className="py-2.5 px-4 font-medium">Payment</th>
                        <th className="py-2.5 px-4 font-medium">Status</th>
                        <th className="py-2.5 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-neutral-50/60">
                          <td className="py-3 px-4 font-mono font-bold text-neutral-900">{order.id}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold block text-neutral-900">{order.customerName}</span>
                            <span className="text-neutral-500">{order.customerPhone}</span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate">
                            {order.address}, {order.upazila}, {order.district}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold">{order.items.length} item(s)</span>
                          </td>
                          <td className="py-3 px-4 font-bold tabular-nums">৳{order.totalAmount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-bold uppercase text-[11px]">{order.paymentMethod}</span>
                              <span className={`text-[10px] font-semibold ${
                                order.paymentDetails.status === 'verified' || order.paymentDetails.status === 'paid'
                                  ? 'text-emerald-700' : 'text-amber-700'
                              }`}>
                                {order.paymentDetails.status.toUpperCase()}
                              </span>
                              {order.paymentDetails.trxId && (
                                <span className="font-mono text-[10px] text-neutral-500">
                                  TrxID: {order.paymentDetails.trxId}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.orderStatus}
                              onChange={e => handleUpdateOrderStatus(order.id, { orderStatus: e.target.value as any })}
                              className="px-2 py-1 bg-neutral-100 border border-neutral-300 rounded font-semibold text-[11px]"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            {order.paymentDetails.status !== 'verified' && order.paymentMethod !== 'cod' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, { paymentStatus: 'verified' })}
                                className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold"
                                title="Verify Mobile Transaction ID"
                              >
                                Verify Trx
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-2 py-1 bg-neutral-900 text-white rounded text-[10px] font-bold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Detail Modal / Inspector */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto border border-neutral-200 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                      <div>
                        <h3 className="text-base font-bold text-neutral-900 font-mono">Order {selectedOrder.id}</h3>
                        <span className="text-xs text-neutral-500">Customer: {selectedOrder.customerName}</span>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-neutral-800">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="my-4 space-y-4 text-xs">
                      {/* Courier Assignment */}
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                        <span className="font-bold text-neutral-800 block">Courier Dispatch & Tracking:</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Courier Name (e.g. Steadfast, Pathao)"
                            defaultValue={selectedOrder.courierName || ''}
                            id="courierNameInput"
                            className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Tracking Code (e.g. STF-84920)"
                            defaultValue={selectedOrder.courierTrackingCode || ''}
                            id="courierTrackingInput"
                            className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const cName = (document.getElementById('courierNameInput') as HTMLInputElement).value;
                            const cTrack = (document.getElementById('courierTrackingInput') as HTMLInputElement).value;
                            handleUpdateOrderStatus(selectedOrder.id, {
                              courierName: cName,
                              courierTrackingCode: cTrack,
                              orderStatus: 'shipped'
                            });
                          }}
                          className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold text-xs"
                        >
                          Save Courier Info & Set Shipped
                        </button>
                      </div>

                      {/* Items */}
                      <div>
                        <span className="font-bold text-neutral-800 block mb-1">Purchased Products:</span>
                        <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="p-2.5 flex justify-between bg-white text-xs">
                              <div>
                                <span className="font-semibold text-neutral-900">{item.productName}</span>
                                <span className="text-neutral-500 ml-2">Qty: {item.quantity}</span>
                              </div>
                              <span className="font-bold tabular-nums">৳{item.totalPrice.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between p-3 bg-neutral-100 rounded-lg font-bold text-sm">
                        <span>Total Paid / Payable:</span>
                        <span className="tabular-nums">৳{selectedOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg text-xs flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-lg text-xs"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS & STOCK MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search product by name or SKU..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full text-xs bg-transparent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={productCategoryFilter}
                    onChange={e => setProductCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  >
                    <option value="all">All Categories</option>
                    {globalCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setEditingProduct({
                        name: '',
                        slug: '',
                        description: '',
                        regularPrice: 2000,
                        salePrice: 1600,
                        discountPercentage: 20,
                        sku: `KH-${Math.floor(1000 + Math.random() * 9000)}`,
                        stock: 20,
                        categoryId: globalCategories[0]?.id || 'cat_perfumes',
                        subcategory: 'General',
                        isFeatured: false,
                        isBestSeller: false,
                        isFlashSale: false,
                        supplierName: '',
                        purchaseCost: 1000
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Products Table with Supplier Cost & Profit Margin */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">Product</th>
                        <th className="py-2.5 px-4 font-medium">SKU</th>
                        <th className="py-2.5 px-4 font-medium">Category</th>
                        <th className="py-2.5 px-4 font-medium">Sale Price</th>
                        <th className="py-2.5 px-4 font-medium">Purchase Cost</th>
                        <th className="py-2.5 px-4 font-medium">Profit Margin</th>
                        <th className="py-2.5 px-4 font-medium">Stock</th>
                        <th className="py-2.5 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredProducts.map(prod => {
                        const cost = prod.purchaseCost || 0;
                        const margin = prod.salePrice - cost;
                        const marginPercent = cost > 0 ? Math.round((margin / cost) * 100) : 0;

                        return (
                          <tr key={prod.id} className="hover:bg-neutral-50/60">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={prod.images?.[0]}
                                  alt=""
                                  className="w-9 h-9 rounded object-cover bg-neutral-100 shrink-0"
                                />
                                <div>
                                  <span className="font-semibold block text-neutral-900 max-w-xs truncate">{prod.name}</span>
                                  {prod.supplierName && (
                                    <span className="text-[10px] text-neutral-400">Supplier: {prod.supplierName}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-neutral-600">{prod.sku}</td>
                            <td className="py-3 px-4">{globalCategories.find(c => c.id === prod.categoryId)?.name || 'General'}</td>
                            <td className="py-3 px-4 font-bold tabular-nums">৳{prod.salePrice.toLocaleString()}</td>
                            <td className="py-3 px-4 tabular-nums text-neutral-500">৳{cost.toLocaleString()}</td>
                            <td className="py-3 px-4 font-semibold text-emerald-700 tabular-nums">
                              +৳{margin.toLocaleString()} ({marginPercent}%)
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded font-bold tabular-nums text-[11px] ${
                                prod.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-neutral-100 text-neutral-800'
                              }`}>
                                {prod.stock} in stock
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add / Edit Product Modal */}
              {isProductModalOpen && editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                  <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto border border-neutral-200 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                      <h3 className="text-base font-bold text-neutral-900">
                        {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-neutral-800">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="my-4 space-y-3 text-xs">
                      <div>
                        <label className="block text-neutral-700 font-medium mb-1">Product Title</label>
                        <input
                          type="text"
                          value={editingProduct.name || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-700 font-medium mb-1">Category</label>
                          <select
                            value={editingProduct.categoryId}
                            onChange={e => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                          >
                            {globalCategories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-neutral-700 font-medium mb-1">SKU</label>
                          <input
                            type="text"
                            value={editingProduct.sku || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-neutral-700 font-medium mb-1">Regular Price (৳)</label>
                          <input
                            type="number"
                            value={editingProduct.regularPrice || 0}
                            onChange={e => setEditingProduct({ ...editingProduct, regularPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-700 font-medium mb-1">Sale Price (৳)</label>
                          <input
                            type="number"
                            value={editingProduct.salePrice || 0}
                            onChange={e => setEditingProduct({ ...editingProduct, salePrice: Number(e.target.value) })}
                            required
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-700 font-medium mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            value={editingProduct.stock || 0}
                            onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                            required
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      {/* Confidential Supplier Info */}
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-amber-900 font-semibold mb-1">
                            Supplier / Manufacturer (Admin Only)
                          </label>
                          <input
                            type="text"
                            value={editingProduct.supplierName || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, supplierName: e.target.value })}
                            placeholder="e.g. Al-Madina Oud Importers Ltd."
                            className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-amber-900 font-semibold mb-1">
                            Purchase Cost (৳) (Admin Only)
                          </label>
                          <input
                            type="number"
                            value={editingProduct.purchaseCost || 0}
                            onChange={e => setEditingProduct({ ...editingProduct, purchaseCost: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      {/* Product Image Management (1:1 Ratio) */}
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1.5 flex items-center justify-between">
                          <span>Product Image (1:1 Aspect Ratio)</span>
                          <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Square 1:1 Recommended
                          </span>
                        </label>

                        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
                          {/* 1:1 Aspect Ratio Container */}
                          <div className="relative aspect-square w-28 h-28 rounded-xl overflow-hidden border-2 border-neutral-200 bg-white shadow-xs shrink-0 flex items-center justify-center group">
                            {editingProduct.images?.[0] ? (
                              <>
                                <img
                                  src={editingProduct.images[0]}
                                  alt="Product Preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <label
                                    htmlFor="admin-product-file-input"
                                    className="cursor-pointer px-2 py-1 bg-white/90 text-neutral-900 text-[10px] font-bold rounded shadow-sm hover:bg-white"
                                  >
                                    Change Image
                                  </label>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
                                <ImageIcon className="w-8 h-8 mb-1 text-neutral-300" />
                                <span className="text-[10px] font-medium">No Image</span>
                              </div>
                            )}
                            <span className="absolute bottom-1 right-1 bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded">
                              1:1
                            </span>
                          </div>

                          {/* Upload Controls & Actions */}
                          <div className="flex-1 w-full space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                htmlFor="admin-product-file-input"
                                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
                              >
                                <Upload className="w-3.5 h-3.5 text-amber-400" />
                                <span>Direct Image Upload</span>
                              </label>
                              <input
                                id="admin-product-file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleProductImageUpload}
                                className="hidden"
                              />

                              <button
                                type="button"
                                onClick={() => setShowProductUrlInput(!showProductUrlInput)}
                                className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg font-medium text-xs transition-colors"
                              >
                                {showProductUrlInput ? 'Hide URL Input' : 'Or Paste Image URL'}
                              </button>

                              {editingProduct.images?.[0] && (
                                <button
                                  type="button"
                                  onClick={() => setEditingProduct({ ...editingProduct, images: [] })}
                                  className="px-2.5 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            {showProductUrlInput && (
                              <div className="pt-1">
                                <input
                                  type="text"
                                  placeholder="Enter image URL: https://... or /src/assets/..."
                                  value={editingProduct.images?.[0] || ''}
                                  onChange={e => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono"
                                />
                              </div>
                            )}

                            <p className="text-[11px] text-neutral-500 leading-tight">
                              Upload any JPEG, PNG, or WebP photo directly from your device. The image will be displayed in an authentic 1:1 square ratio across product cards, carousels, and checkout.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-medium mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex gap-4 pt-2">
                        <label className="flex items-center gap-1.5 font-medium">
                          <input
                            type="checkbox"
                            checked={!!editingProduct.isFeatured}
                            onChange={e => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                          />
                          <span>Featured Product</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-medium">
                          <input
                            type="checkbox"
                            checked={!!editingProduct.isBestSeller}
                            onChange={e => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                          />
                          <span>Best Seller</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-medium">
                          <input
                            type="checkbox"
                            checked={!!editingProduct.isFlashSale}
                            onChange={e => setEditingProduct({ ...editingProduct, isFlashSale: e.target.checked })}
                          />
                          <span>Flash Sale</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                        <button
                          type="button"
                          onClick={() => setIsProductModalOpen(false)}
                          className="px-4 py-2 bg-neutral-100 text-neutral-800 rounded-lg font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold"
                        >
                          Save Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Product Categories ({categories.length})</h3>
                  <p className="text-xs text-neutral-500">Manage all store categories. Add, edit, reorder or remove any category.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory({
                      name: '',
                      nameBn: '',
                      slug: '',
                      description: '',
                      icon: 'Tag',
                      image: '',
                      sortOrder: categories.length + 1
                    });
                    setIsCategoryModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add New Category</span>
                </button>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {categories.map(cat => (
                  <div key={cat.id} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center font-bold text-xs shrink-0">
                              <Tag className="w-4 h-4 text-amber-700" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{cat.name}</h4>
                            {cat.nameBn && <span className="text-[11px] text-neutral-500 font-medium block">{cat.nameBn}</span>}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded shrink-0">
                          #{cat.sortOrder}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-500 line-clamp-2 mb-3">
                        {cat.description || 'No description provided.'}
                      </p>

                      <div className="text-[10px] text-neutral-400 font-mono truncate mb-3">
                        Slug: /{cat.slug}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsCategoryModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="px-2.5 py-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Category Modal */}
              {isCategoryModalOpen && editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-neutral-200 shadow-2xl my-8">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                      <h3 className="text-base font-bold text-neutral-900">
                        {editingCategory.id ? 'Edit Category' : 'Add New Category'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCategoryModalOpen(false);
                          setEditingCategory(null);
                        }}
                        className="text-neutral-400 hover:text-neutral-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCategory} className="my-4 space-y-3.5 text-xs">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Category Name (English) *</label>
                        <input
                          type="text"
                          value={editingCategory.name || ''}
                          onChange={e => {
                            const name = e.target.value;
                            setEditingCategory({
                              ...editingCategory,
                              name,
                              slug: editingCategory.id ? (editingCategory.slug || '') : name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                            });
                          }}
                          required
                          placeholder="e.g. Luxury Watches"
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-700 font-semibold mb-1">Bengali Name (বাংলা নাম)</label>
                          <input
                            type="text"
                            value={editingCategory.nameBn || ''}
                            onChange={e => setEditingCategory({ ...editingCategory, nameBn: e.target.value })}
                            placeholder="যেমন: লাক্সারি ঘড়ি"
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-700 font-semibold mb-1">URL Slug</label>
                          <input
                            type="text"
                            value={editingCategory.slug || ''}
                            onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                            placeholder="e.g. luxury-watches"
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Sort Order / Priority</label>
                        <input
                          type="number"
                          value={editingCategory.sortOrder || 1}
                          onChange={e => setEditingCategory({ ...editingCategory, sortOrder: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editingCategory.description || ''}
                          onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                          placeholder="Brief description for category banner and SEO..."
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                        />
                      </div>

                      {/* Category Thumbnail / 1:1 Image */}
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1 flex items-center justify-between">
                          <span>Category Thumbnail / Icon (1:1 Ratio)</span>
                          <span className="text-[10px] text-neutral-500">Optional</span>
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                          <div className="relative aspect-square w-14 h-14 rounded-lg overflow-hidden border border-neutral-300 bg-white shrink-0 flex items-center justify-center">
                            {editingCategory.image ? (
                              <img src={editingCategory.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Tag className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor="cat-img-upload"
                                className="cursor-pointer px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                              >
                                <Upload className="w-3.5 h-3.5 text-amber-400" />
                                <span>Upload Image</span>
                              </label>
                              <input
                                id="cat-img-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCategoryImageUpload}
                              />
                              <button
                                type="button"
                                onClick={() => setShowCategoryUrlInput(!showCategoryUrlInput)}
                                className="px-2.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-xs font-medium"
                              >
                                {showCategoryUrlInput ? 'Hide URL' : 'Or Paste URL'}
                              </button>
                              {editingCategory.image && (
                                <button
                                  type="button"
                                  onClick={() => setEditingCategory({ ...editingCategory, image: '' })}
                                  className="text-red-600 hover:underline text-xs"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            {showCategoryUrlInput && (
                              <input
                                type="text"
                                placeholder="Paste image URL here..."
                                value={editingCategory.image || ''}
                                onChange={e => setEditingCategory({ ...editingCategory, image: e.target.value })}
                                className="w-full px-2.5 py-1 bg-white border border-neutral-300 rounded text-xs font-mono"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCategoryModalOpen(false);
                            setEditingCategory(null);
                          }}
                          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-medium text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors"
                        >
                          {editingCategory.id ? 'Save Changes' : 'Create Category'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BRANDING & SETTINGS */}
          {activeTab === 'settings' && settingsForm && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Branding Section */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  1. Brand Identity & Header Logo
                </h3>

                {/* Header Logo Customization */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-800 block">Header Logo (Navbar)</span>
                      <p className="text-[11px] text-neutral-500">
                        Upload or specify a custom brand logo image to display across the website header and navigation bar.
                      </p>
                    </div>
                    {settingsForm.logoUrl && (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Active Custom Logo
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    {/* Logo Preview Container */}
                    <div className="h-16 w-36 px-2 bg-white rounded-lg border border-neutral-300 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                      {settingsForm.logoUrl ? (
                        <img
                          src={settingsForm.logoUrl}
                          alt="Custom Logo Preview"
                          className="max-h-12 max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium">
                          <div className="w-7 h-7 rounded bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center">
                            KH
                          </div>
                          <span className="font-bold text-[11px] text-neutral-600">Default Logo</span>
                        </div>
                      )}
                    </div>

                    {/* Logo Upload & Input Controls */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="header-logo-upload"
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>Upload Header Logo</span>
                        </label>
                        <input
                          id="header-logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />

                        {settingsForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            Reset to Default Monogram
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Or paste direct image URL (https://... or data:image/...)"
                          value={settingsForm.logoUrl || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settingsForm.siteName}
                      onChange={e => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 font-medium mb-1">Announcement Bar Text</label>
                    <input
                      type="text"
                      value={settingsForm.announcement}
                      onChange={e => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Settings */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  2. Nationwide Delivery Rates (BDT)
                </h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Inside Dhaka Fee (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.delivery.insideDhakaFee}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        delivery: { ...settingsForm.delivery, insideDhakaFee: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Outside Dhaka Fee (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.delivery.outsideDhakaFee}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        delivery: { ...settingsForm.delivery, outsideDhakaFee: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Free Delivery Min Spend (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.delivery.freeDeliveryThreshold}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        delivery: { ...settingsForm.delivery, freeDeliveryThreshold: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Config */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  3. Payment Gateways & Numbers (bKash / Nagad / Rocket)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl space-y-2">
                    <span className="font-bold text-pink-900 block">bKash Configuration:</span>
                    <input
                      type="text"
                      placeholder="bKash Number"
                      value={settingsForm.paymentMethods.bkash.number}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        paymentMethods: {
                          ...settingsForm.paymentMethods,
                          bkash: { ...settingsForm.paymentMethods.bkash, number: e.target.value }
                        }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-pink-300 rounded text-xs font-mono"
                    />
                    <textarea
                      rows={3}
                      value={settingsForm.paymentMethods.bkash.instructions}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        paymentMethods: {
                          ...settingsForm.paymentMethods,
                          bkash: { ...settingsForm.paymentMethods.bkash, instructions: e.target.value }
                        }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-pink-300 rounded text-[11px]"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                    <span className="font-bold text-amber-900 block">Nagad Configuration:</span>
                    <input
                      type="text"
                      placeholder="Nagad Number"
                      value={settingsForm.paymentMethods.nagad.number}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        paymentMethods: {
                          ...settingsForm.paymentMethods,
                          nagad: { ...settingsForm.paymentMethods.nagad, number: e.target.value }
                        }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-xs font-mono"
                    />
                    <textarea
                      rows={3}
                      value={settingsForm.paymentMethods.nagad.instructions}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        paymentMethods: {
                          ...settingsForm.paymentMethods,
                          nagad: { ...settingsForm.paymentMethods.nagad, instructions: e.target.value }
                        }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-[11px]"
                    />
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                    <span className="font-bold text-purple-900 block">Rocket Configuration:</span>
                    <input
                      type="text"
                      placeholder="Rocket Number"
                      value={settingsForm.paymentMethods.rocket.number}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        paymentMethods: {
                          ...settingsForm.paymentMethods,
                          rocket: { ...settingsForm.paymentMethods.rocket, number: e.target.value }
                        }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded text-xs font-mono"
                    />
                    <textarea
                      rows={3}
                      value={settingsForm.paymentMethods.rocket.instructions}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        paymentMethods: {
                          ...settingsForm.paymentMethods,
                          rocket: { ...settingsForm.paymentMethods.rocket, instructions: e.target.value }
                        }
                      })}
                      className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Policies */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  4. Contact & Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Helpline Phone</label>
                    <input
                      type="text"
                      value={settingsForm.contactPhone}
                      onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 font-medium mb-1">Office Address</label>
                    <input
                      type="text"
                      value={settingsForm.officeAddress}
                      onChange={e => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Security & Activity Audit Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                    <tr>
                      <th className="py-2 px-3 font-medium">Timestamp</th>
                      <th className="py-2 px-3 font-medium">Admin</th>
                      <th className="py-2 px-3 font-medium">Action</th>
                      <th className="py-2 px-3 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="py-2 px-3 text-neutral-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-neutral-800 whitespace-nowrap">{log.adminEmail}</td>
                        <td className="py-2 px-3 font-bold text-neutral-900">{log.action}</td>
                        <td className="py-2 px-3 text-neutral-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm max-w-xl space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Database Backup & Disaster Recovery</h3>
              <p className="text-xs text-neutral-500">
                Download a complete snapshot of all products, orders, categories, and settings in JSON format.
              </p>
              <div className="flex gap-3">
                <a
                  href="/api/admin/backup"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Download Store Backup (JSON)</span>
                </a>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-neutral-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-amber-700" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">Change Admin Password</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordMsg('');
                }}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-500 mb-3">
              To update your security credentials, you must verify your current active password.
            </p>

            {passwordMsg && (
              <div className="p-2.5 mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordMsg}</span>
              </div>
            )}
            {passwordError && (
              <div className="p-2.5 mb-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Current Password *</label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    tabIndex={-1}
                  >
                    {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">New Password (min 6 chars) *</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    tabIndex={-1}
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Confirm New Password *</label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold text-xs transition-colors"
                >
                  Verify & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
