'use client';

import React, { useEffect, useState } from 'react';
import { getAdminOrders, updateAdminOrder } from '../../../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { tracking: string; courier: string }>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses = ['ALL', 'PENDING', 'PROCESSING', 'ENGRAVING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders(selectedStatus);
      if (res.success && res.data) {
        setOrders(res.data);
        const initialTracking: Record<string, { tracking: string; courier: string }> = {};
        res.data.forEach((o: any) => {
          initialTracking[o.id] = {
            tracking: o.trackingNumber || '',
            courier: o.courier || 'DHL Express',
          };
        });
        setTrackingInputs(initialTracking);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const inputs = trackingInputs[id] || { tracking: '', courier: 'DHL Express' };
      await updateAdminOrder(id, {
        status: newStatus,
        trackingNumber: inputs.tracking,
        courier: inputs.courier,
      });
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveTracking = async (id: string) => {
    setUpdatingId(id);
    try {
      const inputs = trackingInputs[id] || { tracking: '', courier: 'DHL Express' };
      await updateAdminOrder(id, {
        trackingNumber: inputs.tracking,
        courier: inputs.courier,
        status: 'SHIPPED',
      });
      fetchOrders();
    } catch (err) {
      alert('Failed to update tracking info.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            E-Commerce <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Orders Pipeline</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Track customer card purchases, laser engraving specs & shipment tracking numbers.</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedStatus === st
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Feed */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#13131D]/80 border border-white/10 p-8">
          <p className="text-neutral-500 text-sm">No orders found matching status "{selectedStatus}".</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => {
            const inputs = trackingInputs[ord.id] || { tracking: '', courier: 'DHL Express' };
            const isUpdating = updatingId === ord.id;

            return (
              <div
                key={ord.id}
                className="p-6 sm:p-8 rounded-2xl bg-[#13131D]/90 border border-white/10 hover:border-amber-500/30 transition-all shadow-xl shadow-black/40 flex flex-col lg:flex-row gap-6 justify-between"
              >
                {/* Left Section: Order Info & Custom Engraving */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-mono font-black text-amber-400 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString()}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                        ord.status === 'SHIPPED' || ord.status === 'DELIVERED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : ord.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-extrabold animate-pulse'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {ord.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0B11]/80 border border-white/5 text-xs">
                    <div>
                      <p className="font-mono text-neutral-500 uppercase tracking-wider text-[10px]">Customer Details</p>
                      <p className="text-sm font-bold text-white mt-1">{ord.customerName}</p>
                      <p className="text-neutral-300">{ord.customerEmail}</p>
                      {ord.phone && <p className="text-neutral-400 font-mono mt-0.5">{ord.phone}</p>}
                    </div>
                    <div>
                      <p className="font-mono text-neutral-500 uppercase tracking-wider text-[10px]">Shipping Address</p>
                      <p className="text-neutral-200 mt-1 leading-relaxed">{ord.shippingAddress}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-mono uppercase text-neutral-400 font-semibold">Purchased Card Items</p>
                    {ord.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center">
                            {item.quantity}x
                          </span>
                          <div>
                            <p className="font-bold text-white text-sm">{item.product?.name || 'TAGIT NFC Card'}</p>
                            <p className="font-mono text-neutral-400">SKU: {item.product?.sku || 'TAGIT-STD'}</p>
                          </div>
                        </div>

                        {item.customEngravingText && (
                          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 font-mono text-amber-300 flex items-center gap-2">
                            <span>✨ Laser Engraving:</span>
                            <span className="font-bold uppercase tracking-wider">"{item.customEngravingText}"</span>
                          </div>
                        )}

                        <span className="font-mono font-bold text-white text-sm">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Section: Fulfillment Controls */}
                <div className="lg:w-80 flex flex-col justify-between pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6 space-y-4">
                  <div>
                    <p className="text-xs font-mono uppercase font-semibold text-neutral-400 mb-2">Order Total</p>
                    <p className="text-3xl font-black font-mono text-amber-400">${ord.totalAmount?.toFixed(2)}</p>

                    <div className="mt-6 space-y-3">
                      <p className="text-xs font-mono uppercase font-semibold text-neutral-400">Change Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={isUpdating || ord.status === 'PROCESSING'}
                          onClick={() => handleStatusChange(ord.id, 'PROCESSING')}
                          className="py-1.5 px-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-mono font-medium border border-blue-500/20 disabled:opacity-30 transition-all"
                        >
                          Processing
                        </button>
                        <button
                          disabled={isUpdating || ord.status === 'ENGRAVING'}
                          onClick={() => handleStatusChange(ord.id, 'ENGRAVING')}
                          className="py-1.5 px-2.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-mono font-medium border border-purple-500/20 disabled:opacity-30 transition-all"
                        >
                          Engraving
                        </button>
                      </div>
                    </div>

                    {/* Tracking Input */}
                    <div className="mt-6 space-y-2 pt-4 border-t border-white/10">
                      <p className="text-xs font-mono uppercase font-semibold text-neutral-400">Shipment & Tracking</p>
                      <select
                        value={inputs.courier}
                        onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: { ...inputs, courier: e.target.value } })}
                        className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-amber-500"
                      >
                        <option value="DHL Express">DHL Express</option>
                        <option value="FedEx Priority">FedEx Priority</option>
                        <option value="Local Courier / Pronto">Local Courier / Pronto</option>
                      </select>
                      <input
                        type="text"
                        placeholder="DHL-8849201-US"
                        value={inputs.tracking}
                        onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: { ...inputs, tracking: e.target.value } })}
                        className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleSaveTracking(ord.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span>🚀</span>
                      <span>{isUpdating ? 'Saving...' : 'Mark Shipped & Save Tracking'}</span>
                    </button>

                    {ord.status !== 'DELIVERED' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(ord.id, 'DELIVERED')}
                        className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all disabled:opacity-50"
                      >
                        Mark Delivered ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
