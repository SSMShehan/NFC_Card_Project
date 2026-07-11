'use client';

import React, { useEffect, useState } from 'react';
import { getAdminInventory, upsertAdminProduct, deleteAdminProduct } from '../../../services/api';

export default function AdminInventoryPage() {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NFC Card <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Inventory</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Manage physical card SKUs, pricing, stock levels & reorder alerts.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto"
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
                className={`p-6 rounded-2xl bg-[#13131D]/90 border transition-all flex flex-col justify-between group ${
                  isLowStock
                    ? 'border-red-500/50 shadow-lg shadow-red-500/5'
                    : 'border-white/10 hover:border-amber-500/40 shadow-xl shadow-black/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-400">
                      {item.sku}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-semibold">
                      {item.nfcChipType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-4 group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 min-h-[32px]">
                    {item.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-mono text-neutral-500 uppercase">Unit Price</p>
                      <p className="text-2xl font-black font-mono text-white">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-neutral-500 uppercase">Available Stock</p>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <span
                          className={`text-2xl font-black font-mono ${
                            isLowStock ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                          }`}
                        >
                          {item.stockQuantity}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">units</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-4">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isLowStock ? 'bg-red-500' : item.stockQuantity < 50 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, (item.stockQuantity / 150) * 100)}%` }}
                    />
                  </div>

                  {isLowStock && (
                    <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Low Stock Warning (Threshold: {item.lowStockThreshold})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
                    >
                      Edit SKU
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors border border-red-500/20"
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
          <div className="bg-[#14141F] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-black">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Card SKU' : 'Add New Card SKU'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="TAGIT-MATTE-BLK"
                    className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">NFC Chip Type</label>
                  <select
                    value={formData.nfcChipType}
                    onChange={(e) => setFormData({ ...formData, nfcChipType: e.target.value })}
                    className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  >
                    <option value="NTAG215">NTAG215 (504 bytes)</option>
                    <option value="NTAG216">NTAG216 (888 bytes)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="TAGIT Obsidian Metal Card"
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brushed stainless steel finish..."
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Alert Threshold</label>
                  <input
                    type="number"
                    required
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                    className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
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
