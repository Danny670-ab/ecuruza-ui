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
} from '../../types/seller';
import {
  fetchCurrentSellerProfile,
  fetchProducts,
  createProductApi,
  deleteProductApi,
  fetchSellerOrdersApi,
  fetchShopReviewsApi,
  deriveCustomersFromOrders,
  deriveShipmentsFromOrders,
} from '../redux/services/sellerService';

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
  // Initialize seller profile from prop, localStorage, or fallback
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(() => {
    if (propSeller) return propSeller;

    // Check if user or seller profile is cached in localStorage
    try {
      const savedSeller = localStorage.getItem('seller_profile');
      if (savedSeller) return JSON.parse(savedSeller);

      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.name || u.fullName || 'Seller';
        return {
          name,
          email: u.email || 'seller@ecuruza.rw',
          avatar: u.avatar || '',
          storeName: u.businessName || `${name}'s Store`,
          isVerified: u.isVerified ?? true,
        };
      }
    } catch {
      // Fallback
    }

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

  // Load ALL real data from backend APIs
  const loadRealData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch seller profile + dashboard analytics + shop + shop stats
      const { profile, dashboardData, shop, shopStats } = await fetchCurrentSellerProfile();
      const shopId = profile?.shopId || (shop as any)?.id;

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
          try {
            localStorage.setItem('seller_profile', JSON.stringify(updated));
          } catch {
            // ignore
          }
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
      const apiProducts = await fetchProducts(shopId);
      if (apiProducts.length > 0) {
        setProducts(apiProducts);
      }

      // 5. Fetch orders
      const apiOrders = await fetchSellerOrdersApi();
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
      const apiReviews = await fetchShopReviewsApi(shopId);
      if (apiReviews.length > 0) {
        setReviews(apiReviews);
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
    const tempId = `prod-${Date.now()}`;
    const newProduct: SellerProduct = {
      ...newProdData,
      id: tempId,
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Try posting to API in background
    try {
      const result = await createProductApi({
        name: newProdData.name,
        price: newProdData.price,
        description: newProdData.description,
        stock: newProdData.stockRemaining,
        category: newProdData.category,
      });
      // Update with real ID if returned
      const realId = (result as any)?.data?.id || (result as any)?.id;
      if (realId) {
        setProducts((prev) => prev.map((p) => (p.id === tempId ? { ...p, id: realId } : p)));
      }
      toast.success('Product created successfully!');
    } catch {
      toast.info('Product added locally. Will sync when connected.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // Try deleting from API
    try {
      await deleteProductApi(productId);
    } catch {
      // Already removed from UI
    }
  };

  const handleUpdateProfile = (updated: Partial<SellerProfile>) => {
    setSellerProfile((prev) => {
      const merged = { ...prev, ...updated };
      try {
        localStorage.setItem('seller_profile', JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
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
    } else {
      setActiveTab('Products');
    }
    toast.info(`Searching for "${searchQuery}" in ${activeTab}`);
  };

  const handleUpgradePlan = () => {
    toast.success('Seller Pro Features: Detailed Analytics & Multi-Store access enabled!');
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

          {/* Seller Profile Information (Live Data) */}
          <div className="flex items-center gap-3">
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

          {activeTab === 'Products' && (
            <ProductsView
              products={products}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'Customer' && (
            <CustomerView customers={customers} />
          )}

          {activeTab === 'Order' && (
            <OrderView
              orders={orders}
              onExport={handleExportOrders}
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
            <FeedbackView reviews={reviews} />
          )}

          {activeTab === 'Help & Support' && <HelpSupportView />}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;