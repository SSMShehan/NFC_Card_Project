'use client';

import React, { useEffect, useState } from 'react';
import { getAdminInventory, upsertAdminProduct, deleteAdminProduct } from '../../../services/api';
import { useAdminTheme } from '../AdminThemeContext';

export default function AdminInventoryPage() {
  const { isLight } = useAdminTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    price: '29.99',
    stockQuantity: '100',
    lowStockThreshold: '15',
    nfcChipType: 'NTAG215',
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getAdminInventory();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        sku: item.sku,
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        stockQuantity: item.stockQuantity.toString(),
        lowStockThreshold: item.lowStockThreshold.toString(),
        nfcChipType: item.nfcChipType || 'NTAG215',
        imageUrl: item.imageUrl || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        sku: `TAGIT-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        description: '',
        price: '39.99',
        stockQuantity: '50',
        lowStockThreshold: '10',
        nfcChipType: 'NTAG216',
        imageUrl: '',
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await upsertAdminProduct({
        ...(editingItem && { id: editingItem.id }),
        ...formData,
      });
      setModalOpen(false);
      fetchInventory();
    } catch (err) {
      alert('Failed to save product SKU.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteAdminProduct(id);
      fetchInventory();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            NFC Card{' '}
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
              Inventory
            </span>
          </h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Manage physical card SKUs, pricing, stock levels & reorder alerts.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white dark:text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <span>+ Add New Card SKU</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => {
            const isLowStock = item.stockQuantity <= item.lowStockThreshold;
            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between group shadow-xl ${
                  isLowStock
                    ? isLight
                      ? 'bg-red-50/60 border-red-300 shadow-red-500/10'
                      : 'bg-[#13131D]/90 border-red-500/50 shadow-red-500/5'
                    : isLight
                      ? 'bg-white border-neutral-200/80 shadow-neutral-200/50 hover:border-amber-500/50'
                      : 'bg-[#13131D]/90 border-white/10 hover:border-amber-500/40 shadow-black/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                        isLight
                          ? 'bg-amber-500/10 border-amber-300 text-amber-800'
                          : 'bg-white/5 border-white/10 text-amber-400'
                      }`}
                    >
                      {item.sku}
                    </span>
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded border font-semibold ${
                        isLight
                          ? 'bg-purple-500/10 border-purple-300 text-purple-800'
                          : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                      }`}
                    >
                      {item.nfcChipType}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-bold mt-4 transition-colors ${
                      isLight ? 'text-neutral-900 group-hover:text-amber-700' : 'text-white group-hover:text-amber-400'
                    }`}
                  >
                    {item.name}
                  </h3>
                  <p className={`text-xs mt-1.5 line-clamp-2 min-h-[32px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    {item.description || 'No description provided.'}
                  </p>
                </div>

                <div className={`mt-6 pt-5 border-t ${isLight ? 'border-neutral-200/80' : 'border-white/10'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`text-xs font-mono uppercase ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        Unit Price
                      </p>
                      <p className={`text-2xl font-black font-mono ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                        LKR {item.price.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-mono uppercase ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        Available Stock
                      </p>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <span
                          className={`text-2xl font-black font-mono ${
                            isLowStock
                              ? isLight ? 'text-red-600 animate-pulse' : 'text-red-400 animate-pulse'
                              : isLight ? 'text-emerald-700' : 'text-emerald-400'
                          }`}
                        >
                          {item.stockQuantity}
                        </span>
                        <span className={`text-xs font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          units
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className={`w-full h-2 rounded-full overflow-hidden mb-4 ${isLight ? 'bg-neutral-200' : 'bg-white/10'}`}>
                    <div
                      className={`h-full transition-all duration-500 ${
                        isLowStock ? 'bg-red-500' : item.stockQuantity < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (item.stockQuantity / 150) * 100)}%` }}
                    />
                  </div>

                  {isLowStock && (
                    <div
                      className={`mb-4 p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                        isLight
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}
                    >
                      <span>⚠️</span>
                      <span>Low Stock Warning (Threshold: {item.lowStockThreshold})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        isLight
                          ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      Edit SKU
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className={`py-2 px-3 rounded-xl text-xs transition-colors border ${
                        isLight
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-700 border-red-300'
                          : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                      }`}
                      title="Delete SKU"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ───────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`border rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl ${
              isLight
                ? 'bg-white border-neutral-300 text-neutral-900 shadow-neutral-500/30'
                : 'bg-[#14141F] border-white/10 text-white shadow-black'
            }`}
          >
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <h3 className={`text-lg font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {editingItem ? 'Edit Card SKU' : 'Add New Card SKU'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-red-500 p-1 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="TAGIT-MATTE-BLK"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-mono focus:border-amber-500 outline-none border ${
                      isLight
                        ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                        : 'bg-[#0B0B11] border-white/10 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    NFC Chip Type
                  </label>
                  <select
                    value={formData.nfcChipType}
                    onChange={(e) => setFormData({ ...formData, nfcChipType: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-mono focus:border-amber-500 outline-none border ${
                      isLight
                        ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                        : 'bg-[#0B0B11] border-white/10 text-white'
                    }`}
                  >
                    <option value="NTAG215">NTAG215 (504 bytes)</option>
                    <option value="NTAG216">NTAG216 (888 bytes)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="TAGIT Obsidian Metal Card"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none border ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                      : 'bg-[#0B0B11] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brushed stainless steel finish..."
                  className={`w-full rounded-xl px-3.5 py-2 text-sm focus:border-amber-500 outline-none resize-none border ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                      : 'bg-[#0B0B11] border-white/10 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-sm font-mono focus:border-amber-500 outline-none border ${
                      isLight
                        ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                        : 'bg-[#0B0B11] border-white/10 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-sm font-mono focus:border-amber-500 outline-none border ${
                      isLight
                        ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                        : 'bg-[#0B0B11] border-white/10 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Alert Threshold
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-sm font-mono focus:border-amber-500 outline-none border ${
                      isLight
                        ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                        : 'bg-[#0B0B11] border-white/10 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className={`pt-4 flex items-center justify-end gap-3 border-t ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors border ${
                    isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white dark:text-black font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Product SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
