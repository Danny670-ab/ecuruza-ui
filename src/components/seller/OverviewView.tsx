import React from 'react';
import type {
  SellerProfile,
  SellerMetric,
  SellerProduct,
  SellerOrder,
  SalesDataPoint,
} from '../../types/seller';

interface OverviewViewProps {
  seller: SellerProfile;
  metrics: SellerMetric[];
  salesHistory: SalesDataPoint[];
  topProducts: SellerProduct[];
  lastOrders: SellerOrder[];
  onNavigateToTab: (tab: string) => void;
  onExportOrders: () => void;
  onFilterOrders: () => void;
  onCustomizeTable: () => void;
  isLoading?: boolean;
  onRefreshData?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  seller,
  metrics,
  salesHistory,
  topProducts,
  lastOrders,
  onNavigateToTab,
  onExportOrders,
  onFilterOrders,
  onCustomizeTable,
  isLoading = false,
  onRefreshData,
}) => {
  const firstName = seller.name.split(' ')[0] || 'Seller';

  return (
    <div className="space-y-6">
      {/* Welcome Greeting & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
            Welcome Back {firstName}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Here's Your current Sales Overview for {seller.storeName || 'your store'}
          </p>
        </div>

        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isLoading}
            className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-white border border-gray-300 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-black transition-all shadow-xs"
            title="Refresh dashboard data"
          >
            <svg
              className={`w-3.5 h-3.5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isLoading ? 'Syncing...' : 'Sync Live Data'}</span>
          </button>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {metrics.map((card) => (
          <div
            key={card.id}
            className={`${card.bgColor} rounded-xl p-5 text-white shadow-sm flex flex-col justify-between`}
          >
            <span className="text-xs font-medium text-gray-200">{card.title}</span>
            <div className="my-2.5">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">{card.value}</span>
            </div>
            <div className="text-xs">
              <span
                className={`font-semibold ${
                  card.changeType === 'positive' ? 'text-[#38ef7d]' : 'text-[#ff7849]'
                }`}
              >
                {card.change}
              </span>{' '}
              <span className="text-gray-300">From Last Month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Sales Overtime & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overtime (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-black">Sales Overtime</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-gray-800">
                <span className="text-[#f59e0b] text-base">✦</span>
                <span className="font-medium">Revenue</span>
              </div>
              <span className="text-gray-600 font-medium">Order</span>
              {/* Filter Icon */}
              <button
                onClick={onFilterOrders}
                className="text-gray-700 hover:text-black transition-colors"
                title="Filter Sales Overtime"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="relative pt-4 flex gap-4 h-64">
            {/* Y-Axis Value Labels */}
            <div className="flex flex-col justify-between text-xs text-gray-800 font-medium pb-7 pr-2">
              <span>Rwf 50k</span>
              <span>Rwf 40k</span>
              <span>Rwf 30k</span>
              <span>Rwf 20k</span>
              <span>Rwf 10k</span>
              <span>Rwf 0</span>
            </div>

            {/* Bars Area */}
            <div className="flex-1 flex items-end justify-between gap-2 pb-7 border-b border-gray-100">
              {salesHistory.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end relative">
                  <div className="flex items-end gap-1.5 h-full">
                    {/* Primary Dark Pill Bar (Revenue) */}
                    <div
                      style={{ height: `${item.revenueHeight}%` }}
                      className="w-3 md:w-3.5 bg-[#3a473d] rounded-full transition-all duration-500 hover:opacity-85"
                      title={`Revenue: ${item.revenueAmount ? `Rwf ${item.revenueAmount.toLocaleString()}` : `${item.revenueHeight}%`}`}
                    />
                    {/* Secondary Gray Pill Bar (Orders) */}
                    {item.orderHeight !== undefined && (
                      <div
                        style={{ height: `${item.orderHeight}%` }}
                        className="w-2.5 md:w-3 bg-[#e2e4e8] rounded-full transition-all duration-500"
                        title={`Orders: ${item.orderCount ? `${item.orderCount} orders` : `${item.orderHeight}%`}`}
                      />
                    )}
                  </div>
                  <span className="absolute -bottom-6 text-xs font-semibold text-gray-900 mt-2">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Product (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-base font-bold text-black">Top Selling Product</h3>
            <button
              onClick={() => onNavigateToTab('Products')}
              className="rounded-lg bg-[#e2e4e8] px-2.5 py-1 text-xs font-medium text-gray-800 hover:bg-gray-300 transition-colors"
            >
              See all product
            </button>
          </div>

          {/* Product List */}
          <div className="divide-y divide-gray-100 space-y-2">
            {topProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="pt-2.5 first:pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-9 rounded object-cover shadow-xs border border-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span className="text-xs md:text-sm font-semibold text-gray-900">
                    {product.name}
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#18793b]">
                    <span className="text-[#f59e0b]">✦</span>
                    <span>{product.status}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block">
                    {product.stockRemaining} Stock Remaining
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Last Orders Table */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
          <h3 className="text-lg font-bold text-black">Last Orders</h3>
          <div className="flex items-center gap-6 text-sm font-semibold text-black">
            <button
              onClick={onCustomizeTable}
              className="hover:text-gray-600 transition-colors"
            >
              Customize
            </button>
            <button
              onClick={onFilterOrders}
              className="hover:text-gray-600 transition-colors"
            >
              Filter
            </button>
            <button
              onClick={onExportOrders}
              className="hover:text-gray-600 transition-colors"
            >
              Export
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-300/80 text-gray-800 font-medium">
                <th className="py-3.5 px-3 font-medium">Order ID</th>
                <th className="py-3.5 px-3 font-medium">Product</th>
                <th className="py-3.5 px-3 font-medium">Order Date</th>
                <th className="py-3.5 px-3 font-medium">Price</th>
                <th className="py-3.5 px-3 font-medium">Payment</th>
                <th className="py-3.5 px-3 font-medium">Status</th>
                <th className="py-3.5 px-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lastOrders.map((order) => (
                <tr key={order.id} className="text-gray-700 hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-medium text-black">{order.code}</td>
                  <td className="py-3.5 px-3 font-medium text-black">{order.product}</td>
                  <td className="py-3.5 px-3 text-gray-600">{order.orderDate}</td>
                  <td className="py-3.5 px-3 text-black font-medium">{order.price}</td>
                  <td className="py-3.5 px-3 text-black">{order.payment}</td>
                  <td className="py-3.5 px-3 text-black">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-black">
                    <button
                      onClick={() => onNavigateToTab('Order')}
                      className="text-[#0e5c2d] hover:underline font-semibold"
                    >
                      {order.action || 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
