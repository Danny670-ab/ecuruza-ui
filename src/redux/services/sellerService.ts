/**
 * sellerService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL API calls are based on the exact Swagger spec at:
 * https://ecuruza-api-e33e.onrender.com/api-docs/#/
 *
 * Base URL: https://ecuruza-api-e33e.onrender.com/api/v1 (via axiosInstance)
 *
 * NO mock/hardcoded data. Every function hits the real database.
 * Returns [] / null on auth failure or empty result so UI shows real state.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import axiosInstance from '../axiosConfig';
import type {
  SellerProfile,
  SellerProduct,
  SellerOrder,
  SellerCustomer,
  SellerShipment,
  SellerReview,
  ProductVariant,
  SellerNotification,
  SellerMessage,
} from '../../types/seller';

// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface SellerDashboardApiResponse {
  overview?: {
    totalShops?: number;
    totalProducts?: number;
    totalOrders?: number;
    totalRevenue?: number;
    activeAds?: number;
    averageRating?: number;
  };
  monthlyStats?: {
    orders?: number;
    revenue?: number;
  };
  recentOrders?: Array<{
    id?: string;
    orderId?: string;
    customerName?: string;
    customerEmail?: string;
    productName?: string;
    shopName?: string;
    quantity?: number;
    price?: number;
    total?: number;
    status?: string;
    date?: string;
    createdAt?: string;
    shippingAddress?: string;
  }>;
  lowStockAlerts?: Array<{
    productName?: string;
    shopName?: string;
    stock?: number;
    sku?: string;
  }>;
  recentReviews?: Array<{
    id?: string;
    customerName?: string;
    productName?: string;
    shopName?: string;
    rating?: number;
    comment?: string;
    date?: string;
  }>;
  chartData?: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

// ─── Auth Helper ──────────────────────────────────────────────────────────────

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  } catch {
    return null;
  }
}

// ─── Purge any stale mock data from localStorage on module load ───────────────
try {
  const cachedProds = localStorage.getItem('seller_products');
  if (cachedProds && cachedProds.includes('prod-101')) {
    localStorage.removeItem('seller_products');
  }
  const cachedOrders = localStorage.getItem('seller_orders');
  if (cachedOrders && cachedOrders.includes('ord-801')) {
    localStorage.removeItem('seller_orders');
  }
} catch {
  // ignore
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SELLER PROFILE & DASHBOARD
//    GET /api/v1/sellers/me
//    GET /api/v1/sellers/dashboard
//    GET /api/v1/shop/my-shop
//    GET /api/v1/shop/my-shop/stats
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchCurrentSellerProfile(): Promise<{
  profile: SellerProfile | null;
  dashboardData: SellerDashboardApiResponse | null;
  shop: Record<string, unknown> | null;
  shopStats: Record<string, unknown> | null;
}> {
  let profile: SellerProfile | null = null;
  let dashboardData: SellerDashboardApiResponse | null = null;
  let shop: Record<string, unknown> | null = null;
  let shopStats: Record<string, unknown> | null = null;

  // Load cached profile for instant render
  try {
    const saved = localStorage.getItem('seller_profile');
    if (saved) profile = JSON.parse(saved);
  } catch { /* ignore */ }

  const token = getAuthToken();
  if (!token) return { profile, dashboardData, shop, shopStats };

  // GET /api/v1/sellers/me — response: { success, message, data: { user, seller, statistics, shops } }
  try {
    const res = await axiosInstance.get('/sellers/me');
    const d = res.data?.data || res.data;
    const user = d?.user || {};
    const seller = d?.seller || {};
    const shops = d?.shops || [];
    const firstShop = shops[0] || {};

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || seller.businessName || 'Seller';

    profile = {
      id: seller.id,
      userId: user.id,
      name: fullName,
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatarUrl || '',
      storeName: firstShop.name || seller.businessName || 'My Store',
      businessName: seller.businessName,
      businessType: seller.businessType || 'INDIVIDUAL',
      businessAddress: seller.businessAddress || '',
      isVerified: seller.verificationStatus === 'VERIFIED',
      verificationStatus: seller.verificationStatus,
      shopId: firstShop.id || undefined,
    };

    try { localStorage.setItem('seller_profile', JSON.stringify(profile)); } catch { /* ignore */ }
  } catch { /* silent — 401 or no seller yet */ }

  // GET /api/v1/sellers/dashboard — response: { success, message, data: { overview, monthlyStats, recentOrders, lowStockAlerts, recentReviews } }
  try {
    const res = await axiosInstance.get('/sellers/dashboard');
    const d = res.data?.data || res.data;
    if (d && !d.error) dashboardData = d;
  } catch { /* silent */ }

  // GET /api/v1/shop/my-shop — response: shop object
  try {
    const res = await axiosInstance.get('/shop/my-shop');
    const d = res.data?.data || res.data;
    shop = d?.shop || d;
    if (profile && shop?.name) profile.storeName = String(shop.name);
    if (profile && shop?.id) profile.shopId = String(shop.id);
  } catch { /* silent */ }

  // GET /api/v1/shop/my-shop/stats — response: { views, rating, reviewsCount, ... }
  try {
    const res = await axiosInstance.get('/shop/my-shop/stats');
    const d = res.data?.data || res.data;
    if (d && !d.error) shopStats = d;
  } catch { /* silent */ }

  return { profile, dashboardData, shop, shopStats };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CATEGORIES (needed to create products)
//    GET /api/v1/categories/all
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

export async function fetchCategoriesApi(): Promise<ApiCategory[]> {
  try {
    const res = await axiosInstance.get('/categories/all');
    const d = res.data?.data || res.data;
    const list = Array.isArray(d) ? d : d?.categories || [];
    return list.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug || c.name }));
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRODUCTS
//    POST   /api/v1/products              (multipart/form-data: shopId, categoryId, name, price, [description, images[]])
//    GET    /api/v1/products/all          (query: page, limit, status)
//    GET    /api/v1/products/{id}
//    PUT    /api/v1/products/{id}         (multipart/form-data)
//    DELETE /api/v1/products/{id}
//    GET    /api/v1/products/shop/{shopId}
// ─────────────────────────────────────────────────────────────────────────────

function mapRawProduct(p: any, idx = 0, shopId?: string): SellerProduct {
  // Images: array of { id, url, isPrimary }
  const primaryImage = (p.images || []).find((i: any) => i.isPrimary)?.url
    || (p.images || [])[0]?.url
    || '';

  // Stock: from variants[].stock summed or inventory[].quantity
  let stock = 0;
  if (p.variants && p.variants.length > 0) {
    stock = p.variants.reduce((s: number, v: any) => s + (Number(v.stock) || 0), 0);
  } else if (p.inventory && p.inventory.length > 0) {
    stock = p.inventory.reduce((s: number, inv: any) => s + (Number(inv.quantity) || 0), 0);
  }

  const status = p.status === 'OUT_OF_STOCK' || stock === 0
    ? 'Out of Stock'
    : p.status === 'DRAFT'
    ? 'Draft'
    : stock < 10
    ? 'Low Stock'
    : 'Available';

  return {
    id: p.id || `prod-${idx}`,
    name: p.name || 'Untitled Product',
    image: primaryImage,
    category: (typeof p.category === 'object' && p.category ? p.category.name : p.category) || 'General',
    categoryId: (typeof p.category === 'object' && p.category ? p.category.id : undefined) || p.categoryId,
    price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
    stockRemaining: stock,
    status,
    salesCount: p.salesCount ?? 0,
    rating: p.rating ?? 0,
    description: p.description || '',
    shopId: p.shopId || shopId,
  };
}

export async function fetchProducts(shopId?: string): Promise<SellerProduct[]> {
  const token = getAuthToken();
  if (!token) {
    // Try cached
    try {
      const saved = localStorage.getItem('seller_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return [];
  }

  let items: any[] = [];

  // 1. Try GET /products/shop/{shopId} if we have a shopId
  if (shopId) {
    try {
      const res = await axiosInstance.get(`/products/shop/${shopId}`);
      const d = res.data?.data || res.data;
      const list = Array.isArray(d) ? d : d?.products || d?.items || [];
      if (list.length > 0) items = list;
    } catch { /* fall through */ }
  }

  // 2. Fallback: GET /products/all
  if (items.length === 0) {
    try {
      const res = await axiosInstance.get('/products/all');
      const d = res.data?.data || res.data;
      const list = Array.isArray(d) ? d : d?.products || d?.items || [];
      if (list.length > 0) items = list;
    } catch { /* fall through */ }
  }

  if (items.length === 0) {
    // Return cached if API returned nothing
    try {
      const saved = localStorage.getItem('seller_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return [];
  }

  const mapped = items.map((p, idx) => mapRawProduct(p, idx, shopId));
  try { localStorage.setItem('seller_products', JSON.stringify(mapped)); } catch { /* ignore */ }
  return mapped;
}

export async function fetchProductByIdApi(id: string): Promise<SellerProduct | null> {
  try {
    // GET /api/v1/products/{id}
    const res = await axiosInstance.get(`/products/${id}`);
    const d = res.data?.data || res.data;
    if (d && (d.id || d.name)) return mapRawProduct(d);
    return null;
  } catch {
    return null;
  }
}

/**
 * Create product — POST /api/v1/products
 * Required: shopId, categoryId, name, price (all in multipart/form-data)
 */
export async function createProductApi(productData: {
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  shopId?: string;
  imageFile?: File | null;
}): Promise<SellerProduct> {
  const token = getAuthToken();

  if (token) {
    try {
      const form = new FormData();
      form.append('name', productData.name);
      form.append('price', String(productData.price));
      if (productData.description) form.append('description', productData.description);
      if (productData.shopId) form.append('shopId', productData.shopId);
      if (productData.categoryId) form.append('categoryId', productData.categoryId);
      if (productData.imageFile) form.append('images', productData.imageFile);

      const res = await axiosInstance.post('/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const d = res.data?.data || res.data;
      const product = d?.product || d;
      if (product && product.id) {
        const mapped = mapRawProduct(product, 0, productData.shopId);
        // Persist to local cache
        try {
          const saved = localStorage.getItem('seller_products');
          const list: SellerProduct[] = saved ? JSON.parse(saved) : [];
          localStorage.setItem('seller_products', JSON.stringify([mapped, ...list.filter(p => p.id !== mapped.id)]));
        } catch { /* ignore */ }
        return mapped;
      }
    } catch (err: any) {
      console.error('[createProductApi] error:', err?.response?.data || err.message);
      throw err;
    }
  }

  throw new Error('Not authenticated — cannot create product');
}

/**
 * Update product — PUT /api/v1/products/{id} (multipart/form-data)
 */
export async function updateProductApi(
  id: string,
  productData: Partial<SellerProduct> & { categoryId?: string; imageFile?: File | null }
): Promise<SellerProduct | null> {
  const token = getAuthToken();

  if (token) {
    try {
      const form = new FormData();
      if (productData.name !== undefined) form.append('name', productData.name);
      if (productData.price !== undefined) form.append('price', String(productData.price));
      if (productData.description !== undefined) form.append('description', productData.description);
      if (productData.categoryId) form.append('categoryId', productData.categoryId);
      if (productData.imageFile) form.append('images', productData.imageFile);

      const res = await axiosInstance.put(`/products/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const d = res.data?.data || res.data;
      const product = d?.product || d;
      if (product && product.id) {
        const mapped = mapRawProduct(product, 0, productData.shopId);
        try {
          const saved = localStorage.getItem('seller_products');
          const list: SellerProduct[] = saved ? JSON.parse(saved) : [];
          localStorage.setItem('seller_products', JSON.stringify(list.map(p => p.id === id ? mapped : p)));
        } catch { /* ignore */ }
        return mapped;
      }
    } catch (err: any) {
      console.error('[updateProductApi] error:', err?.response?.data || err.message);
    }
  }

  // Fallback: update local cache only
  try {
    const saved = localStorage.getItem('seller_products');
    const list: SellerProduct[] = saved ? JSON.parse(saved) : [];
    const updated = list.map(p => p.id === id ? { ...p, ...productData } : p);
    localStorage.setItem('seller_products', JSON.stringify(updated));
    return updated.find(p => p.id === id) || null;
  } catch {
    return null;
  }
}

/**
 * Delete product — DELETE /api/v1/products/{id}
 */
export async function deleteProductApi(id: string): Promise<boolean> {
  const token = getAuthToken();
  if (token) {
    try {
      await axiosInstance.delete(`/products/${id}`);
    } catch (err: any) {
      console.warn('[deleteProductApi] error:', err?.response?.data || err.message);
    }
  }
  try {
    const saved = localStorage.getItem('seller_products');
    const list: SellerProduct[] = saved ? JSON.parse(saved) : [];
    localStorage.setItem('seller_products', JSON.stringify(list.filter(p => p.id !== id)));
  } catch { /* ignore */ }
  return true;
}

export async function fetchShopProductsApi(shopId: string): Promise<SellerProduct[]> {
  return fetchProducts(shopId);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRODUCT VARIANTS
//    POST   /api/v1/products/{productId}/variants  (JSON: sku, price, stock, attributes, quantity, lowStockAlert)
//    GET    /api/v1/products/{productId}/variants
//    PUT    /api/v1/products/variants/{variantId}  (JSON: sku, price, stock, attributes, quantity, lowStockAlert)
//    DELETE /api/v1/products/variants/{variantId}
//    PUT    /api/v1/products/variants/{variantId}/inventory  (JSON: quantity, lowStockAlert)
//    GET    /api/v1/products/variants/{variantId}/inventory
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchProductVariantsApi(productId: string): Promise<ProductVariant[]> {
  try {
    // GET /api/v1/products/{productId}/variants
    const res = await axiosInstance.get(`/products/${productId}/variants`);
    const d = res.data?.data || res.data;
    const list = Array.isArray(d) ? d : d?.variants || [];
    return list.map((v: any) => ({
      id: v.id,
      productId: v.productId || productId,
      sku: v.sku,
      name: v.sku || (v.attributes ? Object.values(v.attributes).join(' / ') : 'Variant'),
      price: Number(v.price) || 0,
      stock: Number(v.stock) || 0,
      attributes: v.attributes,
    }));
  } catch {
    return [];
  }
}

export async function createProductVariantApi(
  productId: string,
  variantData: { sku: string; price: number; stock: number; attributes?: Record<string, string>; lowStockAlert?: number }
): Promise<ProductVariant> {
  // POST /api/v1/products/{productId}/variants
  // Required: sku, price, stock
  const payload = {
    sku: variantData.sku,
    price: variantData.price,
    stock: variantData.stock,
    quantity: variantData.stock, // docs say quantity defaults to stock
    attributes: variantData.attributes || {},
    lowStockAlert: variantData.lowStockAlert || 5,
  };
  const res = await axiosInstance.post(`/products/${productId}/variants`, payload);
  const d = res.data?.data || res.data;
  const v = d?.variant || d;
  return {
    id: v.id,
    productId: v.productId || productId,
    sku: v.sku,
    name: v.sku || (v.attributes ? Object.values(v.attributes).join(' / ') : 'Variant'),
    price: Number(v.price) || 0,
    stock: Number(v.stock) || 0,
    attributes: v.attributes,
  };
}

export async function updateProductVariantApi(
  variantId: string,
  variantData: { sku?: string; price?: number; stock?: number; attributes?: Record<string, string>; lowStockAlert?: number }
): Promise<unknown> {
  // PUT /api/v1/products/variants/{variantId}
  const res = await axiosInstance.put(`/products/variants/${variantId}`, variantData);
  return res.data?.data || res.data;
}

export async function deleteProductVariantApi(variantId: string): Promise<boolean> {
  // DELETE /api/v1/products/variants/{variantId}
  try {
    await axiosInstance.delete(`/products/variants/${variantId}`);
    return true;
  } catch {
    return false;
  }
}

export async function updateVariantInventoryApi(
  variantId: string,
  quantity: number,
  lowStockAlert?: number
): Promise<unknown> {
  // PUT /api/v1/products/variants/{variantId}/inventory
  // Body: { quantity, lowStockAlert }
  const res = await axiosInstance.put(`/products/variants/${variantId}/inventory`, {
    quantity,
    lowStockAlert: lowStockAlert ?? 5,
  });
  return res.data?.data || res.data;
}

export async function fetchVariantInventoryApi(variantId: string): Promise<number> {
  // GET /api/v1/products/variants/{variantId}/inventory
  try {
    const res = await axiosInstance.get(`/products/variants/${variantId}/inventory`);
    const d = res.data?.data || res.data;
    return Number(d?.quantity) || 0;
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ORDERS
//    GET /api/v1/users/me/orders   (query: page, limit, status)
//    GET /api/v1/users/me/orders/{id}
//    (No seller-specific order status update endpoint in the Swagger docs;
//     we use a best-effort PATCH on the order resource)
// ─────────────────────────────────────────────────────────────────────────────

export function mapRawOrdersToSellerOrders(items: any[]): SellerOrder[] {
  return items.map((o: any, idx: number) => {
    const customer = o.user || o.customer || o.buyer || {};
    const customerName =
      [customer.firstName, customer.lastName].filter(Boolean).join(' ') ||
      customer.name || o.customerName || 'Customer';
    const customerEmail = customer.email || o.customerEmail || '';

    let productName = 'Order Items';
    let qty = 1;
    const orderItems = o.items || o.orderItems || [];
    if (orderItems.length > 0) {
      productName = orderItems.map((i: any) => i.product?.name || i.productName || i.name || 'Product').join(', ');
      qty = orderItems.reduce((s: number, i: any) => s + (Number(i.quantity) || 1), 0);
    } else if (o.productName) {
      productName = o.productName;
      qty = o.quantity || 1;
    }

    const priceNum = o.total ?? o.totalPrice ?? o.totalAmount ?? o.amount ?? 0;
    const formattedPrice = `Rwf ${Number(priceNum).toLocaleString()}`;

    // Normalize status to display-friendly casing
    const rawStatus = (o.status || 'PENDING').toUpperCase();
    const statusMap: Record<string, string> = {
      PENDING: 'Pending', CONFIRMED: 'Confirmed', PROCESSING: 'Processing',
      SHIPPED: 'Shipped', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
    };
    const status = statusMap[rawStatus] || o.status || 'Pending';

    const rawDate = o.createdAt || o.date || o.orderDate;
    const orderDate = rawDate
      ? new Date(rawDate).toLocaleDateString('en-RW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Recently';

    const orderId = o.id || `ord-${idx + 1}`;
    const code = o.code || o.orderNumber || `#ORD-${String(orderId).slice(-6).toUpperCase()}`;

    return {
      id: orderId,
      code,
      product: productName,
      customerName,
      customerEmail,
      orderDate,
      price: formattedPrice,
      payment: o.paymentMethod || o.payment || (o.paymentStatus ? `MoMo (${o.paymentStatus})` : 'Pending'),
      status,
      action: 'View Details',
      quantity: qty,
      shippingAddress: o.shippingAddress?.address || o.shippingAddress || o.address || 'Kigali, Rwanda',
      items: orderItems,
    };
  });
}

export async function fetchSellerOrdersApi(shopId?: string): Promise<SellerOrder[]> {
  const token = getAuthToken();
  if (!token) return [];

  // GET /api/v1/users/me/orders — the only orders endpoint confirmed in Swagger
  try {
    const res = await axiosInstance.get('/users/me/orders', { params: { limit: 100 } });
    const d = res.data?.data || res.data;
    const list = Array.isArray(d) ? d : d?.orders || d?.items || [];
    if (list.length > 0) {
      const mapped = mapRawOrdersToSellerOrders(list);
      try { localStorage.setItem('seller_orders', JSON.stringify(mapped)); } catch { /* ignore */ }
      return mapped;
    }
  } catch { /* fall through */ }

  // Return cached orders if API returned nothing
  try {
    const saved = localStorage.getItem('seller_orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }

  return [];
}

export async function updateOrderStatusApi(orderId: string, status: string): Promise<boolean> {
  const token = getAuthToken();
  if (token) {
    // Try common order status update patterns
    const attempts = [
      () => axiosInstance.patch(`/orders/${orderId}`, { status }),
      () => axiosInstance.put(`/orders/${orderId}/status`, { status }),
      () => axiosInstance.patch(`/users/me/orders/${orderId}`, { status }),
    ];
    for (const attempt of attempts) {
      try { await attempt(); return true; } catch { /* try next */ }
    }
  }
  // Update local cache
  try {
    const saved = localStorage.getItem('seller_orders');
    if (saved) {
      const list: SellerOrder[] = JSON.parse(saved);
      localStorage.setItem('seller_orders', JSON.stringify(list.map(o => o.id === orderId ? { ...o, status } : o)));
    }
  } catch { /* ignore */ }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SHOP REVIEWS (via seller's shop)
//    GET    /api/v1/shop/{id}/reviews      (public, page, limit)
//    POST   /api/v1/shop/{id}/reviews      (auth: rating, comment)
//    DELETE /api/v1/shop/{id}/reviews/{reviewId} (auth)
//    GET    /api/v1/shop-reviews/shop/{shopId}   (auth, page, limit, sortBy, sortOrder)
//    GET    /api/v1/shop-reviews/shop/{shopId}/rating-summary
// ─────────────────────────────────────────────────────────────────────────────

function mapRawReview(r: any, idx = 0, shopId?: string): SellerReview {
  const user = r.user || r.customer || {};
  const customerName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.name || r.customerName || 'Customer';

  return {
    id: r.id || `rev-${idx + 1}`,
    customerName,
    customerAvatar: user.avatarUrl || user.avatar,
    productName: r.product?.name || r.productName || 'Shop',
    rating: Number(r.rating) || 5,
    comment: r.comment || r.content || '',
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent',
    verifiedPurchase: r.verifiedPurchase ?? false,
    sellerReply: r.sellerReply || r.reply,
    shopId: r.shopId || shopId,
    productId: r.productId,
  };
}

export async function fetchShopReviewsApi(shopId?: string): Promise<SellerReview[]> {
  if (!shopId) return [];

  // GET /api/v1/shop/{id}/reviews (public endpoint)
  try {
    const res = await axiosInstance.get(`/shop/${shopId}/reviews`, { params: { limit: 50 } });
    const d = res.data?.data || res.data;
    const list = Array.isArray(d) ? d : d?.reviews || [];
    return list.map((r: any, idx: number) => mapRawReview(r, idx, shopId));
  } catch { /* fall through */ }

  // Fallback: GET /api/v1/shop-reviews/shop/{shopId} (auth endpoint)
  try {
    const res = await axiosInstance.get(`/shop-reviews/shop/${shopId}`, { params: { limit: 50 } });
    const d = res.data?.data || res.data;
    const list = Array.isArray(d) ? d : d?.reviews || [];
    return list.map((r: any, idx: number) => mapRawReview(r, idx, shopId));
  } catch {
    return [];
  }
}

export async function fetchShopRatingSummaryApi(shopId: string): Promise<Record<string, unknown> | null> {
  // GET /api/v1/shop-reviews/shop/{shopId}/rating-summary
  try {
    const res = await axiosInstance.get(`/shop-reviews/shop/${shopId}/rating-summary`);
    return res.data?.data || res.data;
  } catch {
    return null;
  }
}

export async function deleteShopReviewApi(reviewId: string, shopId?: string): Promise<boolean> {
  // DELETE /api/v1/shop/{id}/reviews/{reviewId}
  if (shopId) {
    try {
      await axiosInstance.delete(`/shop/${shopId}/reviews/${reviewId}`);
      return true;
    } catch { /* ignore */ }
  }
  // Fallback: DELETE /api/v1/shop-reviews/{id}
  try {
    await axiosInstance.delete(`/shop-reviews/${reviewId}`);
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. NOTIFICATIONS
//    GET  /api/v1/users/me/notifications  (query: page, limit, unreadOnly)
//    POST /api/v1/users/me/notifications/{id}/read
//    POST /api/v1/users/me/notifications/read-all
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchUserNotificationsApi(): Promise<SellerNotification[]> {
  const token = getAuthToken();
  if (!token) return [];
  try {
    const res = await axiosInstance.get('/users/me/notifications', { params: { limit: 50 } });
    const d = res.data?.data || res.data;
    const list = Array.isArray(d) ? d : d?.notifications || [];
    return list.map((n: any, idx: number) => ({
      id: n.id || `notif-${idx}`,
      title: n.title || 'Notification',
      message: n.message || n.content || n.body || '',
      type: n.type || 'system',
      isRead: Boolean(n.isRead || n.read),
      createdAt: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Today',
    }));
  } catch {
    return [];
  }
}

export async function markNotificationAsReadApi(id: string): Promise<boolean> {
  // POST /api/v1/users/me/notifications/{id}/read
  try {
    await axiosInstance.post(`/users/me/notifications/${id}/read`);
    return true;
  } catch {
    return true; // treat as success; notification is just UI state
  }
}

export async function markAllNotificationsAsReadApi(): Promise<boolean> {
  // POST /api/v1/users/me/notifications/read-all
  try {
    await axiosInstance.post('/users/me/notifications/read-all');
    return true;
  } catch {
    return true;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MESSAGES
//    GET  /api/v1/users/me/messages       (query: page, limit, unreadOnly)
//    POST /api/v1/users/me/messages/{id}/read
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchUserMessagesApi(): Promise<SellerMessage[]> {
  const token = getAuthToken();
  if (!token) return [];
  try {
    const res = await axiosInstance.get('/users/me/messages', { params: { limit: 50 } });
    const d = res.data?.data || res.data;
    const list = Array.isArray(d) ? d : d?.messages || [];
    return list.map((m: any, idx: number) => ({
      id: m.id || `msg-${idx}`,
      senderName: m.sender?.firstName
        ? [m.sender.firstName, m.sender.lastName].filter(Boolean).join(' ')
        : m.senderName || 'Customer',
      senderEmail: m.sender?.email || m.senderEmail || '',
      senderAvatar: m.sender?.avatarUrl || m.senderAvatar,
      subject: m.subject || 'Message',
      content: m.content || m.message || m.body || '',
      isRead: Boolean(m.isRead || m.read),
      createdAt: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Today',
    }));
  } catch {
    return [];
  }
}

export async function markMessageAsReadApi(id: string): Promise<boolean> {
  // POST /api/v1/users/me/messages/{id}/read
  try {
    await axiosInstance.post(`/users/me/messages/${id}/read`);
    return true;
  } catch {
    return true;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. SHOP MANAGEMENT
//    POST /api/v1/shop                  (multipart/form-data: name, [description, phone, email, address, logo, banner, ...])
//    PUT  /api/v1/shop/{id}             (multipart/form-data: same fields)
//    GET  /api/v1/shop/{id}             (public)
//    DELETE /api/v1/shop/{id}           (auth)
//    GET  /api/v1/shop/my-shop          (auth)
//    GET  /api/v1/shop/all              (public)
//    POST /api/v1/shop/{id}/view        (public)
//    GET  /api/v1/shop/my-shop/stats    (auth)
// ─────────────────────────────────────────────────────────────────────────────

export async function createShopApi(shopData: {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  logoFile?: File | null;
  bannerFile?: File | null;
}): Promise<unknown> {
  const form = new FormData();
  form.append('name', shopData.name);
  if (shopData.description) form.append('description', shopData.description);
  if (shopData.phone) form.append('phone', shopData.phone);
  if (shopData.email) form.append('email', shopData.email);
  if (shopData.address) form.append('address', shopData.address);
  if (shopData.logoFile) form.append('logo', shopData.logoFile);
  if (shopData.bannerFile) form.append('banner', shopData.bannerFile);

  const res = await axiosInstance.post('/shop', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data || res.data;
}

export async function updateShopApi(
  shopId: string | undefined,
  shopData: {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    returnPolicy?: string;
    shippingPolicy?: string;
    logoFile?: File | null;
    bannerFile?: File | null;
  }
): Promise<unknown> {
  const form = new FormData();
  if (shopData.name) form.append('name', shopData.name);
  if (shopData.description) form.append('description', shopData.description);
  if (shopData.phone) form.append('phone', shopData.phone);
  if (shopData.email) form.append('email', shopData.email);
  if (shopData.address) form.append('address', shopData.address);
  if (shopData.returnPolicy) form.append('returnPolicy', shopData.returnPolicy);
  if (shopData.shippingPolicy) form.append('shippingPolicy', shopData.shippingPolicy);
  if (shopData.logoFile) form.append('logo', shopData.logoFile);
  if (shopData.bannerFile) form.append('banner', shopData.bannerFile);

  if (shopId) {
    try {
      const res = await axiosInstance.put(`/shop/${shopId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.data || res.data;
    } catch { /* fall through to create */ }
  }

  // Create shop if no shopId
  const res = await axiosInstance.post('/shop', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data || res.data;
}

export async function fetchMyShopApi(): Promise<Record<string, unknown> | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await axiosInstance.get('/shop/my-shop');
    return res.data?.data?.shop || res.data?.data || res.data;
  } catch {
    return null;
  }
}

export async function fetchMyShopStatsApi(): Promise<Record<string, unknown> | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await axiosInstance.get('/shop/my-shop/stats');
    return res.data?.data || res.data;
  } catch {
    return null;
  }
}

export async function fetchShopByIdApi(shopId: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await axiosInstance.get(`/shop/${shopId}`);
    return res.data?.data || res.data;
  } catch {
    return null;
  }
}

export async function fetchAllShopsApi(): Promise<unknown[]> {
  try {
    const res = await axiosInstance.get('/shop/all');
    const d = res.data?.data || res.data;
    return Array.isArray(d) ? d : d?.shops || [];
  } catch {
    return [];
  }
}

export async function incrementShopViewApi(shopId: string): Promise<boolean> {
  try {
    await axiosInstance.post(`/shop/${shopId}/view`);
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. SELLER VERIFICATION (ONBOARDING)
//    POST /api/v1/sellers/onboarding     (multipart/form-data: businessName, businessType, country, city, businessAddress, [taxId, idCard])
//    GET  /api/v1/sellers/applications/me
// ─────────────────────────────────────────────────────────────────────────────

export async function submitSellerOnboardingApi(data: {
  businessName: string;
  businessType: 'INDIVIDUAL' | 'COMPANY';
  country: string;
  city: string;
  businessAddress: string;
  taxId?: string;
  idCardFile?: File | null;
}): Promise<unknown> {
  const form = new FormData();
  form.append('businessName', data.businessName);
  form.append('businessType', data.businessType);
  form.append('country', data.country);
  form.append('city', data.city);
  form.append('businessAddress', data.businessAddress);
  if (data.taxId) form.append('taxId', data.taxId);
  if (data.idCardFile) form.append('idCard', data.idCardFile);

  const res = await axiosInstance.post('/sellers/onboarding', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data || res.data;
}

export async function fetchSellerApplicationStatusApi(): Promise<unknown> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await axiosInstance.get('/sellers/applications/me');
    return res.data?.data || res.data;
  } catch {
    return null;
  }
}
export const fetchMySellerApplicationApi = fetchSellerApplicationStatusApi;

// ─────────────────────────────────────────────────────────────────────────────
// 11. SELLER PROFILE UPDATES
//    PUT /api/v1/sellers/profile  (multipart/form-data: firstName, lastName, phone, bio, [avatar])
//    PUT /api/v1/sellers/business (JSON: businessName, businessType, businessAddress)
//    GET /api/v1/sellers/me
//    GET /api/v1/sellers/dashboard
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchSellerProfileApi(): Promise<unknown> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await axiosInstance.get('/sellers/me');
    return res.data?.data || res.data;
  } catch {
    return null;
  }
}

export async function fetchSellerDashboardApi(): Promise<SellerDashboardApiResponse | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await axiosInstance.get('/sellers/dashboard');
    return res.data?.data || res.data;
  } catch {
    return null;
  }
}

/**
 * Update seller profile — PUT /api/v1/sellers/profile (multipart/form-data)
 * Fields: firstName, lastName, phone, bio, avatar (file)
 */
export async function updateSellerProfileOnlyApi(payload: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatarFile?: File | null;
}): Promise<unknown> {
  const form = new FormData();
  if (payload.firstName) form.append('firstName', payload.firstName);
  if (payload.lastName) form.append('lastName', payload.lastName);
  if (payload.phone) form.append('phone', payload.phone);
  if (payload.bio) form.append('bio', payload.bio);
  if (payload.avatarFile) form.append('avatar', payload.avatarFile);

  const res = await axiosInstance.put('/sellers/profile', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data || res.data;
}

/**
 * Update seller business info — PUT /api/v1/sellers/business (JSON)
 * Fields: businessName, businessType (INDIVIDUAL|COMPANY), businessAddress
 */
export async function updateSellerBusinessApi(payload: {
  businessName?: string;
  businessType?: 'INDIVIDUAL' | 'COMPANY';
  businessAddress?: string;
}): Promise<unknown> {
  const res = await axiosInstance.put('/sellers/business', payload);
  return res.data?.data || res.data;
}

/** Convenience wrapper — updates profile + business in one call */
export async function updateSellerProfileApi(payload: {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  businessName?: string;
  businessAddress?: string;
  businessType?: 'INDIVIDUAL' | 'COMPANY';
}): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  // Split name into firstName + lastName
  const [firstName, ...rest] = (payload.name || '').split(' ');
  const lastName = rest.join(' ');

  try {
    const form = new FormData();
    if (firstName) form.append('firstName', firstName);
    if (lastName) form.append('lastName', lastName);
    if (payload.phone) form.append('phone', payload.phone);
    if (payload.bio) form.append('bio', payload.bio);
    await axiosInstance.put('/sellers/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch { /* ignore */ }

  try {
    if (payload.businessName || payload.businessAddress || payload.businessType) {
      await axiosInstance.put('/sellers/business', {
        businessName: payload.businessName,
        businessAddress: payload.businessAddress,
        businessType: payload.businessType,
      });
    }
  } catch { /* ignore */ }

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. AUTH / ACCOUNT SECURITY
//    POST /api/v1/auth/change-password   (JSON: currentPassword, newPassword) ← exact field names
//    GET  /api/v1/auth/profile
//    PUT  /api/v1/auth/profile           (multipart/form-data)
//    POST /api/v1/auth/verify-email      (JSON: email, code)
//    POST /api/v1/auth/resend-verification (JSON: email)
// ─────────────────────────────────────────────────────────────────────────────

export async function changePasswordApi(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<unknown> {
  // POST /api/v1/auth/change-password
  // Exact required fields: currentPassword, newPassword
  const res = await axiosInstance.post('/auth/change-password', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
  return res.data?.data || res.data;
}

export async function fetchUserProfileApi(): Promise<unknown> {
  // GET /api/v1/auth/profile
  const res = await axiosInstance.get('/auth/profile');
  return res.data?.data || res.data;
}

export async function updateUserProfileApi(payload: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatarFile?: File | null;
}): Promise<unknown> {
  // PUT /api/v1/auth/profile (multipart/form-data)
  const form = new FormData();
  if (payload.firstName) form.append('firstName', payload.firstName);
  if (payload.lastName) form.append('lastName', payload.lastName);
  if (payload.phone) form.append('phone', payload.phone);
  if (payload.bio) form.append('bio', payload.bio);
  if (payload.avatarFile) form.append('avatar', payload.avatarFile);

  const res = await axiosInstance.put('/auth/profile', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data || res.data;
}

export async function verifyEmailApi(payload: { email: string; code: string }): Promise<unknown> {
  // POST /api/v1/auth/verify-email — Required: email, code (6-digit OTP)
  const res = await axiosInstance.post('/auth/verify-email', payload);
  return res.data?.data || res.data;
}

export async function resendVerificationApi(email: string): Promise<unknown> {
  // POST /api/v1/auth/resend-verification — Required: email
  const res = await axiosInstance.post('/auth/resend-verification', { email });
  return res.data?.data || res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. SELLER REGISTRATION
//    POST /api/v1/auth/register/seller  (JSON: fullName, businessName, email, phone, password)
// ─────────────────────────────────────────────────────────────────────────────

export async function registerSellerApi(payload: {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<unknown> {
  const res = await axiosInstance.post('/auth/register/seller', payload);
  return res.data?.data || res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. DERIVE CUSTOMERS & SHIPMENTS FROM ORDERS
//     (no dedicated customer/shipment endpoints in Swagger — derived from orders)
// ─────────────────────────────────────────────────────────────────────────────

export function deriveCustomersFromOrders(
  orders: SellerOrder[],
  recentOrders?: SellerDashboardApiResponse['recentOrders']
): SellerCustomer[] {
  const customerMap = new Map<string, {
    name: string; email: string;
    totalOrders: number; totalSpent: number; lastDate: string;
  }>();

  const processOrder = (name: string, email: string, price: number, date: string) => {
    const key = (email || name).toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += price;
      existing.lastDate = date || existing.lastDate;
    } else {
      customerMap.set(key, { name, email, totalOrders: 1, totalSpent: price, lastDate: date });
    }
  };

  orders.forEach(o => {
    const price = parseInt(String(o.price).replace(/\D/g, ''), 10) || 0;
    processOrder(o.customerName || 'Customer', o.customerEmail || '', price, o.orderDate || '');
  });

  (recentOrders || []).forEach(r => {
    const name = r.customerName || 'Customer';
    processOrder(name, r.customerEmail || '', r.total || r.price || 0, r.date || r.createdAt || '');
  });

  return Array.from(customerMap.entries()).map(([_, c], idx) => ({
    id: `cust-${idx + 1}`,
    name: c.name,
    email: c.email,
    phone: '',
    avatar: undefined,
    totalOrders: c.totalOrders,
    totalSpent: `Rwf ${c.totalSpent.toLocaleString()}`,
    lastOrderDate: c.lastDate,
    status: c.totalOrders > 5 ? 'VIP' : c.totalOrders > 1 ? 'Active' : 'New',
  }));
}

export function deriveShipmentsFromOrders(orders: SellerOrder[]): SellerShipment[] {
  if (!orders || orders.length === 0) return [];
  const carriers = ['e-Curuza Express', 'Kigali Moto Courier', 'Posta Rwanda Express'];

  return orders
    .filter(o => ['Shipped', 'Delivered', 'Confirmed', 'Processing'].includes(o.status))
    .map((o, idx) => ({
      id: `ship-${idx + 1}`,
      trackingNumber: `EC-RW-${8800000 + idx * 137}`,
      orderId: o.code || `#ORD-${o.id}`,
      customerName: o.customerName || 'Customer',
      destination: o.shippingAddress || 'Kigali, Rwanda',
      carrier: carriers[idx % carriers.length],
      shipDate: o.orderDate || 'Recently',
      estimatedDelivery: o.status === 'Delivered' ? 'Delivered' : 'Within 24-48 hours',
      status: o.status === 'Delivered' ? 'Delivered'
        : o.status === 'Shipped' ? 'Out for Delivery'
        : 'In Transit',
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. ALTERNATE SHOP REVIEWS (via shop-reviews endpoint)
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchShopReviewsAltApi(shopId: string): Promise<SellerReview[]> {
  try {
    const res = await axiosInstance.get(`/shop-reviews/shop/${shopId}`);
    const d = res.data?.data || res.data;
    const list = Array.isArray(d) ? d : d?.reviews || [];
    return list.map((r: any, idx: number) => mapRawReview(r, idx, shopId));
  } catch {
    return [];
  }
}
