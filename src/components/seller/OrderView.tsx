import React, { useState, useEffect, useMemo } from 'react';
import type { SellerOrder } from '../../types/seller';
import { toast } from 'react-toastify';
import { updateOrderStatusApi } from '../../redux/services/sellerService';

interface OrderViewProps {
  orders?: SellerOrder[];
  onUpdateStatus?: (orderId: string, status: string) => void;
}

export const OrderView: React.FC<OrderViewProps> = ({ orders: propOrders, onUpdateStatus }) => {
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  // Use prop orders when available (from API), otherwise empty
  const [orderList, setOrderList] = useState<SellerOrder[]>(propOrders || []);

  // Keep in sync when parent re-fetches data
  useEffect(() => {
    if (propOrders && propOrders.length > 0) {
      setOrderList(propOrders);
    }
  }, [propOrders]);

  // Status tabs with counts
  const statusTabs = useMemo(() => {
    return [
      { label: 'All', count: orderList.length },
      { label: 'Pending', count: orderList.filter((o) => o.status === 'Pending').length },
      { label: 'Processing', count: orderList.filter((o) => o.status === 'Processing').length },
      { label: 'Confirmed', count: orderList.filter((o) => o.status === 'Confirmed').length },
      { label: 'Shipped', count: orderList.filter((o) => o.status === 'Shipped').length },
      { label: 'Delivered', count: orderList.filter((o) => o.status === 'Delivered').length },
      { label: 'Cancelled', count: orderList.filter((o) => o.status === 'Cancelled').length },
    ];
  }, [orderList]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orderList.filter((o) => {
      const matchSearch =
        o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = activeStatusTab === 'All' || o.status === activeStatusTab;
      return matchSearch && matchStatus;
    });
  }, [orderList, searchTerm, activeStatusTab]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await updateOrderStatusApi(orderId, newStatus);
      if (!updated) throw new Error('Order status update was not confirmed by the server.');
      setOrderList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      if (onUpdateStatus) {
        onUpdateStatus(orderId, newStatus);
      }
      toast.success('Order updated.');
    } catch {
      toast.error('Order update failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
            Order Management
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Track, process, and fulfill customer orders across all stores
          </p>
        </div>

      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {statusTabs.map((tab) => {
          const isActive = activeStatusTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveStatusTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#222529] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, product, or customer..."
            className="w-full bg-[#dbe0e5] text-xs md:text-sm text-gray-800 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#324035]/40 placeholder-gray-500 transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-300/80 text-gray-800 font-medium">
                <th className="py-3.5 px-3">Order Code</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Product</th>
                <th className="py-3.5 px-3">Order Date</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No orders found in this category.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="text-gray-700 hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-black">{order.code}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-gray-900 block leading-tight">
                        {order.customerName || 'Customer'}
                      </span>
                      <span className="text-[11px] text-gray-400">{order.customerEmail || ''}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-800 font-medium">{order.product}</td>
                    <td className="py-3.5 px-3 text-gray-500">{order.orderDate}</td>
                    <td className="py-3.5 px-3 text-black font-bold">{order.price}</td>
                    <td className="py-3.5 px-3 text-gray-700">{order.payment}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : order.status === 'Confirmed'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg bg-[#324035] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#222529] transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedOrder.code}</h3>
                <span className="text-xs text-gray-500">{selectedOrder.orderDate}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-gray-500 block">Customer</span>
                  <span className="font-bold text-gray-900">{selectedOrder.customerName}</span>
                  <span className="text-gray-500 block">{selectedOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Payment Method</span>
                  <span className="font-bold text-gray-900">{selectedOrder.payment}</span>
                  <span className="text-emerald-700 font-semibold block">{selectedOrder.price}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-700 block mb-1">Shipping Address</span>
                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  {selectedOrder.shippingAddress || 'KG 14 Ave, Nyarugenge, Kigali, Rwanda'}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-700 block mb-1">Item Details</span>
                <div className="border border-gray-200 rounded-lg p-3 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-900 block">{selectedOrder.product}</span>
                    <span className="text-gray-500">Qty: {selectedOrder.quantity || 1}</span>
                  </div>
                  <span className="font-bold text-gray-900">{selectedOrder.price}</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <span className="text-xs font-bold text-gray-700 block mb-2">Update Order Status</span>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedOrder.status === st
                          ? 'bg-[#324035] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
