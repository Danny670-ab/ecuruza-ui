import React, { useState, useEffect, useMemo } from 'react';
import type { SellerCustomer } from '../../types/seller';
import { toast } from 'react-toastify';

interface CustomerViewProps {
  customers?: SellerCustomer[];
}

export const CustomerView: React.FC<CustomerViewProps> = ({ customers: propCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeMessageCustomer, setActiveMessageCustomer] = useState<SellerCustomer | null>(null);
  const [messageText, setMessageText] = useState('');

  // Use prop customers when available (from API), otherwise empty
  const [customerList, setCustomerList] = useState<SellerCustomer[]>(propCustomers || []);

  // Keep in sync when parent re-fetches data
  useEffect(() => {
    if (propCustomers && propCustomers.length > 0) {
      setCustomerList(propCustomers);
    }
  }, [propCustomers]);

  const filteredCustomers = useMemo(() => {
    return customerList.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone || '').includes(searchTerm);
      const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [customerList, searchTerm, selectedStatus]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    toast.success(`Message sent to ${activeMessageCustomer?.name}!`);
    setActiveMessageCustomer(null);
    setMessageText('');
  };

  // Compute metrics from actual data
  const totalBuyers = customerList.length;
  const repeatBuyers = customerList.filter((c) => c.totalOrders > 1).length;
  const repeatRate = totalBuyers > 0 ? ((repeatBuyers / totalBuyers) * 100).toFixed(1) : '0';
  const avgCustomerValue = totalBuyers > 0
    ? `Rwf ${Math.round(
        customerList.reduce((sum, c) => sum + (parseInt(String(c.totalSpent).replace(/\D/g, ''), 10) || 0), 0) / totalBuyers
      ).toLocaleString()}`
    : 'Rwf 0';
  const activeBuyers = customerList.filter((c) => c.status === 'Active' || c.status === 'VIP').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
          Customer Management
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Monitor your customer relationships, purchase volume, and buyer engagement
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-gray-500">Total Buyers</span>
          <div className="mt-2 text-2xl font-bold text-gray-900">{totalBuyers}</div>
          <span className="text-[11px] text-gray-400 mt-1 block">From order history</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-emerald-700">Repeat Rate</span>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{repeatRate}%</div>
          <span className="text-[11px] text-emerald-600 mt-1 block">{repeatBuyers} returning buyers</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-[#39473d]">Avg. Customer Value</span>
          <div className="mt-2 text-2xl font-bold text-gray-900">{avgCustomerValue}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Per customer lifetime</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-emerald-700">Active Buyers</span>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{activeBuyers}</div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Active or VIP status</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
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
            placeholder="Search by customer name, email, or phone..."
            className="w-full bg-[#dbe0e5] text-xs md:text-sm text-gray-800 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#324035]/40 placeholder-gray-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#f3f4f6] text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
          >
            <option value="All">All Statuses</option>
            <option value="VIP">VIP</option>
            <option value="Active">Active</option>
            <option value="New">New</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-base font-bold text-black">
            Customer Directory ({filteredCustomers.length})
          </h3>
          <span className="text-xs text-gray-500">Showing verified buyers</span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-300/80 text-gray-800 font-medium">
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Phone</th>
                <th className="py-3.5 px-3">Orders</th>
                <th className="py-3.5 px-3">Total Spent</th>
                <th className="py-3.5 px-3">Last Order</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="text-gray-700 hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={cust.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 block leading-tight">
                          {cust.name}
                        </span>
                        <span className="text-[11px] text-gray-400">{cust.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-gray-700 font-medium">{cust.phone}</td>
                  <td className="py-3.5 px-3 text-gray-900 font-semibold">{cust.totalOrders}</td>
                  <td className="py-3.5 px-3 text-gray-900 font-bold">{cust.totalSpent}</td>
                  <td className="py-3.5 px-3 text-gray-500">{cust.lastOrderDate}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        cust.status === 'VIP'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : cust.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setActiveMessageCustomer(cust)}
                      className="rounded-lg bg-[#324035] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#222529] transition-colors"
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {activeMessageCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Message {activeMessageCustomer.name}
                </h3>
                <p className="text-xs text-gray-500">{activeMessageCustomer.phone}</p>
              </div>
              <button
                onClick={() => setActiveMessageCustomer(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message regarding orders, inquiries, or special discounts..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveMessageCustomer(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#324035] px-4 py-2 text-xs font-bold text-white hover:bg-[#222529] transition-all"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
