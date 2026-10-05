import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type {
  SellerProfile,
  SellerMetric,
  SellerProduct,
  SellerOrder,
  SellerCustomer,
  SellerShipment,
  SellerReview,
  SalesDataPoint,
  SellerNotification,
} from '../../types/seller';
import {
  fetchCurrentSellerProfile,
  fetchProducts,
  createProductApi,
  deleteProductApi,
  fetchSellerOrdersApi,
  fetchShopReviewsApi,
  deleteShopReviewApi,
  fetchMySellerApplicationApi,
  deriveCustomersFromOrders,
  deriveShipmentsFromOrders,
  fetchUserNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  fetchMyShopApi,
  createShopApi,
} from '../redux/services/sellerService';
import { setAuthToken } from '../redux/axiosConfig';

// Subcomponents for the dashboard pages
import { OverviewView } from '../components/seller/OverviewView';
import { ProductsView } from '../components/seller/ProductsView';
import { CustomerView } from '../components/seller/CustomerView';
import { OrderView } from '../components/seller/OrderView';
import { ShipmentView } from '../components/seller/ShipmentView';
import { StoreSettingView } from '../components/seller/StoreSettingView';
import { FeedbackView } from '../components/seller/FeedbackView';
import { HelpSupportView } from '../components/seller/HelpSupportView';

interface SellerDashboardProps {
  seller?: SellerProfile;
  initialTab?: string;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  seller: propSeller,
  initialTab = 'Overview',
}) => {
  // Initialize from the current API-backed seller prop or a neutral placeholder.
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(() => {
    if (propSeller) return propSeller;

    return {
      name: 'Seller',
      email: 'seller@ecuruza.rw',
      avatar: '',
      storeName: 'My Store',
      isVerified: false,
    };
  });

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Seller Navigation Items matching original Figma spec
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'shops', label: 'Shops', icon: 'store' },
    { id: 'products', label: 'Products', icon: 'box' },
    { id: 'customer', label: 'Customer', icon: 'user' },
    { id: 'order', label: 'Order', icon: 'cart' },
    { id: 'shipment', label: 'Shipment', icon: 'ship' },
    { id: 'store-setting', label: 'Store Setting', icon: 'store' },
    { id: 'feedback', label: 'Feedback', icon: 'message' },
    { id: 'help', label: 'Help & Support', icon: 'help' },
  ];

  // All dynamic state — initialized empty, filled from API
  const [metrics, setMetrics] = useState<SellerMetric[]>([
    {
      id: 'avg-order-value',
      title: 'AVG. Order Value',
      value: '—',
      change: '—',
      changeType: 'positive',
      bgColor: 'bg-[#0e5c2d]',
    },
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: '—',
      change: '—',
      changeType: 'positive',
      bgColor: 'bg-[#39473d]',
    },
    {
      id: 'lifetime-value',
      title: 'Lifetime Value',
      value: '—',
      change: '—',
      changeType: 'positive',
      bgColor: 'bg-[#156633]',
    },
  ]);

  const [salesHistory, setSalesHistory] = useState<SalesDataPoint[]>([]);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [customers, setCustomers] = useState<SellerCustomer[]>([]);
  const [shipments, setShipments] = useState<SellerShipment[]>([]);
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);
  const [shops, setShops] = useState<Array<{ id: string; name: string; slug?: string; status?: string }>>([]);
  const [selectedShopId, setSelectedShopId] = useState<string | undefined>(sellerProfile.shopId);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Load ALL real data from backend APIs
  const loadRealData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch seller profile + dashboard analytics + shop + shop stats
      const [{ profile, dashboardData, shop, shopStats }, myShop] = await Promise.all([
        fetchCurrentSellerProfile(),
        fetchMyShopApi(),
      ]);
      const profileShops = Array.isArray((profile as any)?.shops) ? (profile as any).shops : [];
      const currentShop = myShop || profileShops[0] || shop;

      const normalizedShops = Array.from(
        new Map(
          [currentShop, ...profileShops]
            .filter(Boolean)
            .map((shopItem: any) => [String(shopItem.id || shopItem.slug || shopItem.name), shopItem])
        ).values()
      ) as Array<{ id: string; name: string; slug?: string; status?: string }>;

      if (normalizedShops.length > 0) {
        setShops(normalizedShops);
        const preferredShop = normalizedShops.find((s) => s.id === (profile?.shopId || (shop as any)?.id || selectedShopId)) || normalizedShops[0];
        if (preferredShop?.id) {
          const logoValue = (preferredShop as any).logo;
          const bannerValue = (preferredShop as any).banner;
          setSelectedShopId(preferredShop.id);
          setSellerProfile((prev) => ({
            ...prev,
            shopId: preferredShop.id,
            storeName: preferredShop.name || prev.storeName,
            storeLogo: typeof logoValue === 'string' ? logoValue : logoValue?.url || prev.storeLogo,
            storeBanner: typeof bannerValue === 'string' ? bannerValue : bannerValue?.url || prev.storeBanner,
          }));
        }
      }

      const shopId = selectedShopId || profile?.shopId || (shop as any)?.id || (myShop as any)?.id || normalizedShops[0]?.id;

      // Update seller profile
      if (profile && (profile.name || profile.email)) {
        setSellerProfile((prev) => {
          const updated = {
            ...prev,
            ...profile,
            name: profile.name || prev.name,
            email: profile.email || prev.email,
            avatar: profile.avatar || prev.avatar,
            storeName: profile.storeName || prev.storeName,
          };
          return updated;
        });
      }

      // 2. Update metric cards from dashboard data or shop stats
      const overview = dashboardData?.overview;
      const stats = shopStats as any;
      const totalRevenue = overview?.totalRevenue ?? stats?.totalRevenue ?? 0;
      const totalOrders = overview?.totalOrders ?? stats?.totalOrders ?? 0;
      const avgRating = overview?.averageRating ?? stats?.averageRating ?? stats?.rating ?? 0;

      setMetrics([
        {
          id: 'avg-order-value',
          title: 'AVG. Order Value',
          value:
            totalOrders && totalRevenue
              ? `${Math.round(totalRevenue / totalOrders).toLocaleString()} Rwf`
              : totalRevenue ? `${totalRevenue.toLocaleString()} Rwf` : '0 Rwf',
          change: overview?.totalProducts ? `${overview.totalProducts} products` : '+0%',
          changeType: 'positive',
          bgColor: 'bg-[#0e5c2d]',
        },
        {
          id: 'total-orders',
          title: 'Total Orders',
          value: totalOrders ? `${totalOrders} Orders` : '0 Orders',
          change: dashboardData?.monthlyStats?.orders
            ? `${dashboardData.monthlyStats.orders} this month`
            : '+0%',
          changeType: 'positive',
          bgColor: 'bg-[#39473d]',
        },
        {
          id: 'lifetime-value',
          title: 'Lifetime Value',
          value: totalRevenue ? `${totalRevenue.toLocaleString()} Rwf` : '0 Rwf',
          change: avgRating ? `${avgRating} ★ rating` : stats?.reviewsCount ? `${stats.reviewsCount} reviews` : '+0%',
          changeType: 'positive',
          bgColor: 'bg-[#156633]',
        },
      ]);

      // 3. Build sales history chart from dashboard API chartData
      if (dashboardData?.chartData && dashboardData.chartData.length > 0) {
        const maxRevenue = Math.max(...dashboardData.chartData.map((c) => c.revenue), 1);
        const maxOrders = Math.max(...dashboardData.chartData.map((c) => c.orders), 1);

        setSalesHistory(
          dashboardData.chartData.map((c) => ({
            month: c.month,
            revenueHeight: Math.round((c.revenue / maxRevenue) * 95) + 5,
            orderHeight: Math.round((c.orders / maxOrders) * 95) + 5,
            revenueAmount: c.revenue,
            orderCount: c.orders,
          }))
        );
      } else {
        // Provide minimal placeholder if no chart data
        setSalesHistory([
          { month: 'This Month', revenueHeight: totalRevenue ? 60 : 5, orderHeight: totalOrders ? 40 : 5, revenueAmount: totalRevenue, orderCount: totalOrders },
        ]);
      }

      // 4. Fetch products for this shop
      const apiProducts = shopId ? await fetchProducts(shopId) : [];
      if (apiProducts.length > 0) {
        setProducts(apiProducts);
      } else {
        setProducts([]);
      }

      // 5. Fetch orders from real database
      const apiOrders = shopId ? await fetchSellerOrdersApi(shopId) : [];
      if (apiOrders.length > 0) {
        setOrders(apiOrders);
      }

      // Also include recent orders from dashboard data
      const recentOrders = dashboardData?.recentOrders;

      // 6. Derive customers from orders
      const derivedCustomers = deriveCustomersFromOrders(apiOrders, recentOrders);
      if (derivedCustomers.length > 0) {
        setCustomers(derivedCustomers);
      }

      // 7. Derive shipments from orders
      const derivedShipments = deriveShipmentsFromOrders(apiOrders);
      if (derivedShipments.length > 0) {
        setShipments(derivedShipments);
      }

      // 8. Fetch shop reviews
      const apiReviews = shopId ? await fetchShopReviewsApi(shopId) : [];
      if (apiReviews.length > 0) {
        setReviews(apiReviews);
      } else {
        setReviews([]);
      }

      // 9. Fetch seller application status (GET /sellers/applications/me)
      try {
        const appRes = await fetchMySellerApplicationApi();
        const appInfo = (appRes as any)?.application || (appRes as any)?.data || appRes;
        if (appInfo && appInfo.status) {
          setSellerProfile((prev) => ({
            ...prev,
            verificationStatus: appInfo.status,
            isVerified: appInfo.status === 'APPROVED' || appInfo.status === 'VERIFIED' || prev.isVerified,
          }));
        }
      } catch {
        // ignore
      }

      // 10. Fetch notifications (GET /users/me/notifications)
      try {
        const notifs = await fetchUserNotificationsApi();
        if (notifs && notifs.length > 0) {
          setNotifications(notifs);
        }
      } catch {
        // ignore
      }

      // Also merge recent reviews from dashboard data
      if (dashboardData?.recentReviews && dashboardData.recentReviews.length > 0 && apiReviews.length === 0) {
        setReviews(
          dashboardData.recentReviews.map((r, idx) => ({
            id: r.id || `dash-rev-${idx}`,
            customerName: r.customerName || 'Customer',
            productName: r.productName || r.shopName || 'Product',
            rating: r.rating || 5,
            comment: r.comment || 'Great experience!',
            date: r.date || 'Recently',
            verifiedPurchase: true,
          }))
        );
      }
    } catch (err) {
      console.warn('Real data synchronization notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRealData();
  }, [loadRealData]);

  // Product Actions
  const handleAddProduct = async (newProdData: Omit<SellerProduct, 'id'>) => {
    try {
      if (!sellerProfile.shopId) {
        toast.warning('Create or select a shop before adding a product.');
        return;
      }

      const created = await createProductApi({
        name: newProdData.name,
        price: newProdData.price,
        description: newProdData.description,
        stock: newProdData.stockRemaining,
        category: newProdData.category,
        shopId: sellerProfile.shopId,
      });
      setProducts((prev) => [created, ...prev]);
      toast.success('Product added successfully!');
    } catch (err: any) {
      const message = err?.message || 'Failed to add product.';
      toast.error(message);
    }
  };

  const handleEditProduct = (updated: SellerProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    const deleted = await deleteProductApi(productId);
    if (!deleted) {
      toast.error('Could not delete product from the server.');
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success('Product removed successfully.');
  };

  // Notifications Actions
  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markNotificationAsReadApi(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsAsReadApi();
    toast.success('All notifications marked as read');
  };

  const handleUpdateProfile = (updated: Partial<SellerProfile>) => {
    setSellerProfile((prev) => {
      return { ...prev, ...updated };
    });
  };

  // Tab Interactions
  const handleNavClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    setMobileMenuOpen(false);
  };

  const getInitials = (name?: string): string => {
    if (!name || !name.trim()) return 'NC';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning('Please enter an order ID, customer, or product name.');
      return;
    }
    const q = searchQuery.toLowerCase();
    // Intelligent tab jump based on search
    if (q.includes('order') || q.startsWith('#ord')) {
      setActiveTab('Order');
    } else if (q.includes('ship') || q.includes('track') || q.includes('ec-rw')) {
      setActiveTab('Shipment');
    } else if (q.includes('setting') || q.includes('momo') || q.includes('payout')) {
      setActiveTab('Store Setting');
    } else if (q.includes('shop')) {
      setActiveTab('Shops');
    } else {
      setActiveTab('Products');
    }
    toast.info(`Searching for "${searchQuery}" in ${activeTab}`);
  };

  const handleShopSelect = (shopId: string) => {
    if (!shopId) return;
    const selected = shops.find((shop) => shop.id === shopId);
    setSelectedShopId(shopId);
    setSellerProfile((prev) => ({
      ...prev,
      shopId,
      storeName: selected?.name || prev.storeName,
    }));
    setActiveTab('Overview');
  };

  const handleCreateShop = async () => {
    if (sellerProfile.shopId || shops.length > 0) {
      toast.info('Your account already has a shop. Edit its details in Store Settings.');
      setActiveTab('Store Setting');
      return;
    }

    try {
      const nextName = sellerProfile.storeName?.trim() || `${sellerProfile.name || 'My'} Shop`;
      const created = await createShopApi({
        name: nextName,
      });
      const createdShop = (created as any)?.shop || created;
      const newId = createdShop?.id || `shop-${Date.now()}`;
      const nextShop = {
        id: String(newId),
        name: createdShop?.name || nextName,
        slug: createdShop?.slug,
        status: createdShop?.status || 'Active',
      };
      setShops((prev) => [nextShop, ...prev]);
      setSelectedShopId(nextShop.id);
      setSellerProfile((prev) => ({
        ...prev,
        shopId: nextShop.id,
        storeName: nextShop.name,
      }));
      toast.success('New shop created successfully.');
      setActiveTab('Shops');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (typeof message === 'string' && message.toLowerCase().includes('already have a shop')) {
        toast.info('Your account already has a shop. Edit its details in Store Settings.');
        setActiveTab('Store Setting');
        return;
      }
      toast.error(message || 'Unable to create a new shop right now.');
    }
  };

  const handleUpgradePlan = () => {
    toast.success('Seller Pro Features: Detailed Analytics & Multi-Store access enabled!');
  };

  const handleLogout = () => {
    // Clear all auth tokens
    setAuthToken(null);
    // Clear cached seller data
    try {
      localStorage.removeItem('seller_profile');
      localStorage.removeItem('seller_products');
      localStorage.removeItem('seller_orders');
      localStorage.removeItem('user');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    toast.success('You have been signed out. See you soon!');
    // Redirect to home / login page after a brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const handleExportOrders = () => {
    toast.success('Exporting seller orders as CSV...');
  };

  const handleFilterOrders = () => {
    toast.info('Orders filter drawer opened');
  };

  const handleCustomizeTable = () => {
    toast.info('Table columns customization mode active');
  };
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'grid':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
          </svg>
        );
      case 'box':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 8v6M23 11h-6" />
          </svg>
        );
      case 'cart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1" strokeWidth="2" />
            <circle cx="20" cy="21" r="1" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
        );
      case 'ship':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 17l1.5-6h17L22 17M4 11V5a1 1 0 011-1h14a1 1 0 011 1v6M1 21h22" />
          </svg>
        );
      case 'store':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v4a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0V3zM4 10v10a1 1 0 001 1h14a1 1 0 001-1V10" />
          </svg>
        );
      case 'message':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'help':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] md:pt-3 bg-[#fafbfc] text-[#111827] font-sans antialiased">

      {/* Seller Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#eaedf0] flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        <div>
          {/* Header Title / Brand */}
          <div className="flex items-center justify-between px-3 mb-8">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-black">Seller Dashboard</h1>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block mt-0.5">
                Merchant Portal
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-gray-500 hover:text-black"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.label)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-[15px] transition-colors ${isActive
                    ? 'bg-[#222529] text-white shadow-sm'
                    : 'text-[#4b5563] hover:bg-[#f3f4f6] hover:text-black'
                    }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-[#4b5563]'}`}>
                    {renderIcon(item.icon)}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Pro Card */}
        <div className="mt-8 rounded-2xl bg-[#324035] p-4 text-white shadow-sm">
          <h4 className="text-base font-bold">Upgrade Pro</h4>
          <p className="mt-1 text-xs text-gray-200 leading-relaxed">
            Discover New Features to Detailed Report And Analysis
          </p>
          <button
            onClick={handleUpgradePlan}
            className="mt-4 w-full rounded-xl bg-[#d5ddd6] py-2.5 text-center text-sm font-bold text-[#111827] transition-all hover:bg-white active:scale-98"
          >
            Upgrade Now
          </button>
        </div>

        {/* Logout Button */}
        <button
          id="seller-logout-btn"
          onClick={handleLogout}
          className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors group"
          title="Sign out of Seller Portal"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#eaedf0] gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, products, customers..."
                className="w-full bg-[#dbe0e5] text-sm text-gray-800 rounded-lg pl-9 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#324035]/40 placeholder-gray-500 transition-all"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-600">
                {/* Microphone Icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </span>
            </form>
          </div>

          {/* Seller Profile & Shop Switcher */}
          <div className="flex items-center gap-3">
            {shops.length > 0 && (
              <div className="hidden md:flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">Shop</span>
                <select
                  value={selectedShopId || ''}
                  onChange={(e) => handleShopSelect(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#324035]/30"
                  aria-label="Select shop"
                >
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>{shop.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 transition-colors focus:outline-none"
                title="Notifications"
                aria-label="View notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">Notifications</span>
                      <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {notifications.filter((n) => !n.isRead).length} New
                      </span>
                    </div>
                    {notifications.filter((n) => !n.isRead).length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
                        No notifications at this time
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkAsRead(n.id)}
                          className={`p-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-semibold text-xs text-gray-900 leading-tight">
                              {n.title}
                            </h5>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {n.createdAt}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              className="w-10 h-10 rounded-full bg-[#0C6227] text-white flex items-center justify-center font-bold text-sm shadow-xs select-none border border-emerald-800 shrink-0"
              title={sellerProfile.name}
            >
              {getInitials(sellerProfile.name)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-gray-900 leading-tight">
                  {sellerProfile.name}
                </h3>
                {sellerProfile.isVerified && (
                  <span className="text-emerald-700 text-xs" title="Verified Merchant">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">{sellerProfile.email}</p>
            </div>

            {/* Header Logout Button */}
            <button
              id="seller-header-logout-btn"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Log out"
              className="ml-1 p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dashboard Dynamic Page View */}
        <main className="p-6 md:p-8 space-y-6 overflow-y-auto">
          {activeTab === 'Overview' && (
            <OverviewView
              seller={sellerProfile}
              metrics={metrics}
              salesHistory={salesHistory}
              topProducts={products}
              lastOrders={orders.length > 0 ? orders.slice(0, 5) : []}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onExportOrders={handleExportOrders}
              onFilterOrders={handleFilterOrders}
              onCustomizeTable={handleCustomizeTable}
              isLoading={isLoading}
              onRefreshData={loadRealData}
            />
          )}

          {activeTab === 'Shops' && (
            <div className="rounded-2xl border border-[#eaedf0] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-black">Shops</h2>
                  <p className="text-xs text-gray-500">Manage all stores connected to this seller account</p>
                </div>
                <button
                  onClick={handleCreateShop}
                  className="rounded-xl bg-[#0C6227] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0b4f20]"
                >
                  + Add Shop
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {shops.length === 0 ? (
                  <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                    No shops yet. Add your first shop to begin selling.
                  </div>
                ) : (
                  shops.map((shop) => {
                    const isActive = selectedShopId === shop.id;
                    return (
                      <div
                        key={shop.id}
                        className={`rounded-2xl border p-4 transition-all ${
                          isActive ? 'border-[#0C6227] bg-emerald-50/40 shadow-sm' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{shop.name}</p>
                            <p className="text-[11px] text-gray-500 mt-1">{shop.slug || 'shop-slug'}</p>
                          </div>
                          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                            isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isActive ? 'Selected' : shop.status || 'Active'}
                          </span>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleShopSelect(shop.id)}
                            className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold ${
                              isActive ? 'bg-[#0C6227] text-white' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {isActive ? 'Current Shop' : 'Select Shop'}
                          </button>
                          <button
                            onClick={() => setActiveTab('Store Setting')}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                          >
                            Settings
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'Products' && (
            <ProductsView
              products={products}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onEditProduct={handleEditProduct}
              shopId={sellerProfile.shopId}
            />
          )}

          {activeTab === 'Customer' && (
            <CustomerView customers={customers} />
          )}

          {activeTab === 'Order' && (
            <OrderView
              orders={orders}
              onExport={handleExportOrders}
              onUpdateStatus={(orderId, st) => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === orderId ? { ...o, status: st } : o))
                );
              }}
            />
          )}

          {activeTab === 'Shipment' && (
            <ShipmentView shipments={shipments} />
          )}

          {activeTab === 'Store Setting' && (
            <StoreSettingView
              seller={sellerProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'Feedback' && (
            <FeedbackView
              reviews={reviews}
              shopId={sellerProfile.shopId}
              onDeleteReview={async (reviewId) => {
                setReviews((prev) => prev.filter((r) => r.id !== reviewId));
                await deleteShopReviewApi(reviewId, sellerProfile.shopId);
              }}
            />
          )}

          {activeTab === 'Help & Support' && <HelpSupportView />}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;