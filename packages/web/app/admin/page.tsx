'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminAnalytics } from '../../services/api';
import { useAdminTheme } from './AdminThemeContext';

export default function AdminDashboardPage() {
  const { isLight } = useAdminTheme();
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
        <p className={`font-mono text-sm uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
          Loading Executive Metrics...
        </p>
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
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            Executive{' '}
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
              Analytics
            </span>
          </h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Real-time overview of TAGIT physical card inventory, NFC taps & global sales.
          </p>
        </div>
        <button
          onClick={fetchData}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm ${
            isLight
              ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-700'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
          }`}
        >
          <span>↻</span>
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ── Metric Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div
          className={`relative p-6 rounded-2xl border overflow-hidden group transition-all shadow-xl ${
            isLight
              ? 'bg-white border-neutral-200/80 shadow-neutral-200/50 hover:border-amber-500/60'
              : 'bg-gradient-to-br from-[#181824] to-[#12121A] border-white/10 shadow-black/50 hover:border-amber-500/50'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all" />
          <p className={`text-xs font-mono uppercase font-semibold ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Gross Sales Revenue
          </p>
          <h3 className={`text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            LKR {(metrics.totalRevenue || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">+18.4%</span>
            <span className="text-neutral-500">vs last month</span>
          </div>
        </div>

        {/* Total Profiles & Users */}
        <div
          className={`relative p-6 rounded-2xl border overflow-hidden group transition-all shadow-xl ${
            isLight
              ? 'bg-white border-neutral-200/80 shadow-neutral-200/50 hover:border-blue-500/60'
              : 'bg-gradient-to-br from-[#181824] to-[#12121A] border-white/10 shadow-black/50 hover:border-blue-500/50'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />
          <p className={`text-xs font-mono uppercase font-semibold ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Total Registered Profiles
          </p>
          <h3 className={`text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            {metrics.totalUsers} <span className="text-lg text-neutral-500 font-normal">users</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">
              {metrics.activeProfiles} Active
            </span>
            <span className="text-neutral-500">instant NFC link cards</span>
          </div>
        </div>

        {/* NFC Tap Traffic */}
        <div
          className={`relative p-6 rounded-2xl border overflow-hidden group transition-all shadow-xl ${
            isLight
              ? 'bg-white border-neutral-200/80 shadow-neutral-200/50 hover:border-purple-500/60'
              : 'bg-gradient-to-br from-[#181824] to-[#12121A] border-white/10 shadow-black/50 hover:border-purple-500/50'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />
          <p className={`text-xs font-mono uppercase font-semibold ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Global NFC Tap Count
          </p>
          <h3 className={`text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            {metrics.totalTaps} <span className="text-lg text-neutral-500 font-normal">taps</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">High Engagement</span>
            <span className="text-neutral-500">across smart devices</span>
          </div>
        </div>

        {/* Physical Stock & Alerts */}
        <div
          className={`relative p-6 rounded-2xl border overflow-hidden group transition-all shadow-xl ${
            isLight
              ? 'bg-white border-neutral-200/80 shadow-neutral-200/50 hover:border-red-500/60'
              : 'bg-gradient-to-br from-[#181824] to-[#12121A] border-white/10 shadow-black/50 hover:border-red-500/50'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-500/20 transition-all" />
          <p className={`text-xs font-mono uppercase font-semibold ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Card Inventory Stock
          </p>
          <h3 className={`text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            {metrics.totalStock} <span className="text-lg text-neutral-500 font-normal">units</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium">
            {metrics.lowStockAlerts > 0 ? (
              <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-700 dark:text-red-400 font-mono animate-pulse">
                {metrics.lowStockAlerts} SKUs Need Restock
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                ✅ Stock Level Optimal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Action Shortcuts ─────────────────────────────── */}
      <div
        className={`p-6 rounded-2xl border shadow-xl ${
          isLight
            ? 'bg-white border-neutral-200 shadow-neutral-200/50'
            : 'bg-[#13131D]/80 border-white/10 shadow-black/40'
        }`}
      >
        <h3 className={`text-sm font-mono uppercase font-semibold tracking-wider mb-4 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
          ⚡ Quick Management Workflows
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/cards"
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${
              isLight
                ? 'bg-neutral-50 hover:bg-amber-500/10 border-neutral-200 hover:border-amber-500/40'
                : 'bg-white/5 hover:bg-amber-500/10 border-white/5 hover:border-amber-500/40'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-xl text-amber-500 group-hover:scale-110 transition-transform">
              💳
            </div>
            <div>
              <p className={`text-sm font-semibold transition-colors ${isLight ? 'text-neutral-900 group-hover:text-amber-700' : 'text-white group-hover:text-amber-400'}`}>
                Encode NFC Batch
              </p>
              <p className="text-xs text-neutral-500">Generate UIDs & PIN codes</p>
            </div>
          </Link>

          <Link
            href="/admin/inventory"
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${
              isLight
                ? 'bg-neutral-50 hover:bg-blue-500/10 border-neutral-200 hover:border-blue-500/40'
                : 'bg-white/5 hover:bg-amber-500/10 border-white/5 hover:border-amber-500/40'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl text-blue-500 group-hover:scale-110 transition-transform">
              📦
            </div>
            <div>
              <p className={`text-sm font-semibold transition-colors ${isLight ? 'text-neutral-900 group-hover:text-blue-700' : 'text-white group-hover:text-amber-400'}`}>
                Add SKU Product
              </p>
              <p className="text-xs text-neutral-500">Update pricing & stock limits</p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${
              isLight
                ? 'bg-neutral-50 hover:bg-emerald-500/10 border-neutral-200 hover:border-emerald-500/40'
                : 'bg-white/5 hover:bg-amber-500/10 border-white/5 hover:border-amber-500/40'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xl text-emerald-500 group-hover:scale-110 transition-transform">
              🛒
            </div>
            <div>
              <p className={`text-sm font-semibold transition-colors ${isLight ? 'text-neutral-900 group-hover:text-emerald-700' : 'text-white group-hover:text-amber-400'}`}>
                Ship Pending Orders
              </p>
              <p className="text-xs text-neutral-500">{metrics.pendingOrders} awaiting fulfillment</p>
            </div>
          </Link>

          <Link
            href="/admin/verifications"
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${
              isLight
                ? 'bg-neutral-50 hover:bg-purple-500/10 border-neutral-200 hover:border-purple-500/40'
                : 'bg-white/5 hover:bg-amber-500/10 border-white/5 hover:border-amber-500/40'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl text-purple-500 group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <div>
              <p className={`text-sm font-semibold transition-colors ${isLight ? 'text-neutral-900 group-hover:text-purple-700' : 'text-white group-hover:text-amber-400'}`}>
                Review Queue
              </p>
              <p className="text-xs text-neutral-500">Moderation requests</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Recent E-Commerce Orders ───────────────────────────── */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
          isLight
            ? 'bg-white border-neutral-200 shadow-neutral-200/50'
            : 'bg-[#13131D]/80 border-white/10 shadow-black/40'
        }`}
      >
        <div className={`flex items-center justify-between pb-6 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
          <div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              Recent E-Commerce Orders
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Latest customer card sales and custom laser engraving requests.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className={`text-xs px-4 py-2 rounded-xl border transition-all font-mono uppercase tracking-wider font-semibold ${
              isLight
                ? 'bg-amber-500/15 border-amber-300 text-amber-800 hover:bg-amber-500/25'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-neutral-500 text-sm">
              No recent orders yet. Head to Orders Pipeline to test or create orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs font-mono uppercase tracking-wider ${isLight ? 'border-neutral-200 text-neutral-500 bg-neutral-50' : 'border-white/10 text-neutral-500'}`}>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Card Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${isLight ? 'divide-neutral-200' : 'divide-white/5'}`}>
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} className={`transition-colors ${isLight ? 'hover:bg-neutral-50' : 'hover:bg-white/[0.02]'}`}>
                    <td className={`py-4 px-4 font-mono font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                      {ord.orderNumber}
                    </td>
                    <td className="py-4 px-4">
                      <p className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-white'}`}>{ord.customerName}</p>
                      <p className="text-xs text-neutral-500">{ord.customerEmail}</p>
                    </td>
                    <td className="py-4 px-4">
                      {ord.items?.map((item: any) => (
                        <div key={item.id} className={`text-xs ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                          <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>{item.quantity}x</span>{' '}
                          {item.product?.name || 'TAGIT NFC Card'}
                          {item.customEngravingText && (
                            <p className={`text-[11px] font-mono italic mt-0.5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                              Engraving: "{item.customEngravingText}"
                            </p>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className={`py-4 px-4 font-mono font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                      LKR {ord.totalAmount?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border ${
                          ord.status === 'SHIPPED' || ord.status === 'DELIVERED'
                            ? isLight ? 'bg-emerald-500/15 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : ord.status === 'PENDING'
                              ? isLight ? 'bg-amber-500/15 text-amber-800 border-amber-300' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : isLight ? 'bg-blue-500/15 text-blue-800 border-blue-300' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/orders?orderNumber=${ord.orderNumber}`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          isLight
                            ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/5'
                        }`}
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
