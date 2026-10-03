import React, { useState, useEffect, useMemo } from 'react';
import type { SellerShipment } from '../../types/seller';
import { toast } from 'react-toastify';

interface ShipmentViewProps {
  shipments?: SellerShipment[];
}

export const ShipmentView: React.FC<ShipmentViewProps> = ({ shipments: propShipments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('All');
  const [activeTrackingShipment, setActiveTrackingShipment] = useState<SellerShipment | null>(null);

  // Use prop shipments when available (from API), otherwise empty
  const [shipmentList, setShipmentList] = useState<SellerShipment[]>(propShipments || []);

  // Keep in sync when parent re-fetches data
  useEffect(() => {
    if (propShipments && propShipments.length > 0) {
      setShipmentList(propShipments);
    }
  }, [propShipments]);

  const filteredShipments = useMemo(() => {
    return shipmentList.filter((s) => {
      const matchSearch =
        s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCarrier = selectedCarrier === 'All' || s.carrier === selectedCarrier;
      return matchSearch && matchCarrier;
    });
  }, [shipmentList, searchTerm, selectedCarrier]);

  const carriers = useMemo(() => {
    const set = new Set<string>();
    shipmentList.forEach((s) => set.add(s.carrier));
    return ['All', ...Array.from(set)];
  }, [shipmentList]);

  const handleUpdateShipmentStatus = (shipmentId: string, newStatus: SellerShipment['status']) => {
    setShipmentList((prev) =>
      prev.map((s) => (s.id === shipmentId ? { ...s, status: newStatus } : s))
    );
    if (activeTrackingShipment && activeTrackingShipment.id === shipmentId) {
      setActiveTrackingShipment((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast.success(`Shipment status updated to: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
          Shipment & Fulfillment
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Monitor courier dispatches, live delivery parcels, and transit destinations
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-blue-700">In Transit</span>
          <div className="mt-2 text-2xl font-bold text-blue-900">
            {shipmentList.filter((s) => s.status === 'In Transit').length}
          </div>
          <span className="text-[11px] text-blue-600 mt-1 block">On route to customer</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-amber-700">Out for Delivery</span>
          <div className="mt-2 text-2xl font-bold text-amber-900">
            {shipmentList.filter((s) => s.status === 'Out for Delivery').length}
          </div>
          <span className="text-[11px] text-amber-600 mt-1 block">Expected today</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-emerald-700">Delivered</span>
          <div className="mt-2 text-2xl font-bold text-emerald-900">
            {shipmentList.filter((s) => s.status === 'Delivered').length}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Successful deliveries</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-purple-700">Pending Pickup</span>
          <div className="mt-2 text-2xl font-bold text-purple-900">
            {shipmentList.filter((s) => s.status === 'Pending Pickup').length}
          </div>
          <span className="text-[11px] text-purple-600 mt-1 block">Awaiting carrier dispatch</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search tracking #, order code, or city..."
            className="w-full bg-[#dbe0e5] text-xs md:text-sm text-gray-800 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#324035]/40 placeholder-gray-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCarrier}
            onChange={(e) => setSelectedCarrier(e.target.value)}
            className="bg-[#f3f4f6] text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
          >
            {carriers.map((car) => (
              <option key={car} value={car}>
                {car === 'All' ? 'All Carriers' : car}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-base font-bold text-black">
            Active Shipments ({filteredShipments.length})
          </h3>
          <span className="text-xs text-gray-500">Live logistics tracking</span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-300/80 text-gray-800 font-medium">
                <th className="py-3.5 px-3">Tracking #</th>
                <th className="py-3.5 px-3">Order</th>
                <th className="py-3.5 px-3">Customer & Destination</th>
                <th className="py-3.5 px-3">Carrier</th>
                <th className="py-3.5 px-3">Est. Delivery</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.map((ship) => (
                <tr key={ship.id} className="text-gray-700 hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-gray-900">{ship.trackingNumber}</td>
                  <td className="py-3.5 px-3 font-semibold text-black">{ship.orderId}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-gray-900 block leading-tight">
                      {ship.customerName}
                    </span>
                    <span className="text-[11px] text-gray-500">{ship.destination}</span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-700 font-medium">{ship.carrier}</td>
                  <td className="py-3.5 px-3 text-gray-600">{ship.estimatedDelivery}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        ship.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : ship.status === 'Out for Delivery'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : ship.status === 'In Transit'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {ship.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setActiveTrackingShipment(ship)}
                      className="rounded-lg bg-[#324035] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#222529] transition-colors"
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Tracking Modal */}
      {activeTrackingShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Tracking: {activeTrackingShipment.trackingNumber}
                </h3>
                <p className="text-xs text-gray-500">Carrier: {activeTrackingShipment.carrier}</p>
              </div>
              <button
                onClick={() => setActiveTrackingShipment(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-bold text-gray-900">{activeTrackingShipment.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-semibold text-gray-900">{activeTrackingShipment.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination:</span>
                  <span className="font-semibold text-gray-900">{activeTrackingShipment.destination}</span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-2">
                <span className="text-xs font-bold text-gray-800 block mb-3">Delivery Timeline</span>
                <div className="space-y-3 pl-4 border-l-2 border-[#324035]">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#324035]" />
                    <span className="text-xs font-bold text-gray-900 block">Package Packed & Dispatched</span>
                    <span className="text-[11px] text-gray-500">Seller fulfillment center · {activeTrackingShipment.shipDate}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#324035]" />
                    <span className="text-xs font-bold text-gray-900 block">In Transit via {activeTrackingShipment.carrier}</span>
                    <span className="text-[11px] text-gray-500">Hub: Kigali Central Sorting Station</span>
                  </div>
                  <div className="relative">
                    <span
                      className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${
                        activeTrackingShipment.status === 'Delivered'
                          ? 'bg-[#324035]'
                          : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-xs font-bold text-gray-900 block">
                      {activeTrackingShipment.status === 'Delivered'
                        ? 'Delivered to Recipient'
                        : 'Estimated Arrival: ' + activeTrackingShipment.estimatedDelivery}
                    </span>
                    <span className="text-[11px] text-gray-500">Signed proof of delivery</span>
                  </div>
                </div>
              </div>

              {/* Status Update Quick Action */}
              <div>
                <span className="text-xs font-bold text-gray-700 block mb-2">Update Transit State</span>
                <div className="flex flex-wrap gap-2">
                  {(['Pending Pickup', 'In Transit', 'Out for Delivery', 'Delivered'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateShipmentStatus(activeTrackingShipment.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTrackingShipment.status === st
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
                onClick={() => setActiveTrackingShipment(null)}
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
