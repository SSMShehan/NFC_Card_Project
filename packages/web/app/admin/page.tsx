'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminAnalytics } from '../../services/api';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminAnalytics();
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-400 font-mono text-sm uppercase tracking-wider">Loading Executive Metrics...</p>
      </div>
    );
  }

  const metrics = analytics?.metrics || {
    totalUsers: 0,
    activeProfiles: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalTaps: 0,
    totalStock: 0,
    lowStockAlerts: 0,
  };

  const recentOrders = analytics?.recentOrders || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Analytics</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Real-time overview of TAGIT physical card inventory, NFC taps & global sales.</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all self-start sm:self-auto"
        >
          <span>↻</span>
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ── Metric Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#181824] to-[#12121A] border border-white/10 overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl shadow-black/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all" />
          <p className="text-xs font-mono uppercase font-semibold text-neutral-400">Gross Sales Revenue</p>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            ${(metrics.totalRevenue || 0).toFixed(2)}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">+18.4%</span>
            <span className="text-neutral-500">vs last month</span>
          </div>
        </div>

        {/* Total Profiles & Users */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#181824] to-[#12121A] border border-white/10 overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl shadow-black/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />
          <p className="text-xs font-mono uppercase font-semibold text-neutral-400">Total Registered Profiles</p>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            {metrics.totalUsers} <span className="text-lg text-neutral-500 font-normal">users</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-blue-400 font-medium">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">{metrics.activeProfiles} Active</span>
            <span className="text-neutral-500">instant NFC link cards</span>
          </div>
        </div>

        {/* NFC Tap Traffic */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#181824] to-[#12121A] border border-white/10 overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl shadow-black/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />
          <p className="text-xs font-mono uppercase font-semibold text-neutral-400">Global NFC Tap Count</p>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            {metrics.totalTaps} <span className="text-lg text-neutral-500 font-normal">taps</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">High Engagement</span>
            <span className="text-neutral-500">across smart devices</span>
          </div>
        </div>

        {/* Physical Stock & Alerts */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#181824] to-[#12121A] border border-white/10 overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl shadow-black/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-500/20 transition-all" />
          <p className="text-xs font-mono uppercase font-semibold text-neutral-400">Card Inventory Stock</p>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            {metrics.totalStock} <span className="text-lg text-neutral-500 font-normal">units</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium">
            {metrics.lowStockAlerts > 0 ? (
              <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-mono animate-pulse">
                {metrics.lowStockAlerts} SKUs Need Restock
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                ✅ Stock Level Optimal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Action Shortcuts ─────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#13131D]/80 border border-white/10 shadow-xl shadow-black/40">
        <h3 className="text-sm font-mono uppercase font-semibold tracking-wider text-neutral-400 mb-4">
          ⚡ Quick Management Workflows
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/cards"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-xl text-amber-400 group-hover:scale-110 transition-transform">
              💳
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Encode NFC Batch</p>
              <p className="text-xs text-neutral-500">Generate UIDs & PIN codes</p>
            </div>
          </Link>

          <Link
            href="/admin/inventory"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl text-blue-400 group-hover:scale-110 transition-transform">
              📦
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Add SKU Product</p>
              <p className="text-xs text-neutral-500">Update pricing & stock limits</p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xl text-emerald-400 group-hover:scale-110 transition-transform">
              🛒
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Ship Pending Orders</p>
              <p className="text-xs text-neutral-500">{metrics.pendingOrders} awaiting fulfillment</p>
            </div>
          </Link>

          <Link
            href="/admin/verifications"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl text-purple-400 group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Review Queue</p>
              <p className="text-xs text-neutral-500">Moderation requests</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Recent E-Commerce Orders ───────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#13131D]/80 border border-white/10 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Recent E-Commerce Orders</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Latest customer card sales and custom laser engraving requests.</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all font-mono uppercase tracking-wider font-semibold"
          >
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-neutral-500 text-sm">No recent orders yet. Head to Orders Pipeline to test or create orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono uppercase text-neutral-500 tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Card Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-white">{ord.customerName}</p>
                      <p className="text-xs text-neutral-500">{ord.customerEmail}</p>
                    </td>
                    <td className="py-4 px-4">
                      {ord.items?.map((item: any) => (
                        <div key={item.id} className="text-xs text-neutral-300">
                          <span className="font-bold text-white">{item.quantity}x</span> {item.product?.name || 'TAGIT NFC Card'}
                          {item.customEngravingText && (
                            <p className="text-[11px] text-amber-400 font-mono italic mt-0.5">
                              Engraving: "{item.customEngravingText}"
                            </p>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-white">${ord.totalAmount?.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border ${
                          ord.status === 'SHIPPED' || ord.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : ord.status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/orders?orderNumber=${ord.orderNumber}`}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all border border-white/5"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
