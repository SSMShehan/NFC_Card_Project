'use client';

import React, { useEffect, useState } from 'react';
import { getAdminNfcCards, createAdminNfcBatch, assignAdminNfcCard, getAdminInventory } from '../../../services/api';

export default function AdminCardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const [batchData, setBatchData] = useState({
    batchNumber: `BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
    productId: '',
    count: 25,
    description: 'Production Batch Run',
  });

  const [assignData, setAssignData] = useState({
    userEmail: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCardsAndProducts();
  }, []);

  const fetchCardsAndProducts = async () => {
    setLoading(true);
    try {
      const [cardsRes, prodRes] = await Promise.all([
        getAdminNfcCards(),
        getAdminInventory(),
      ]);
      if (cardsRes.success && cardsRes.data) setCards(cardsRes.data);
      if (prodRes.success && prodRes.data) {
        const prodList = prodRes.data;
        setProducts(prodList);
        if (prodList.length > 0 && !batchData.productId) {
          setBatchData((prev) => ({ ...prev, productId: prodList[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load cards/products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchData.productId) {
      alert('Please select a Product SKU.');
      return;
    }
    setSubmitting(true);
    try {
      await createAdminNfcBatch(batchData);
      setBatchModalOpen(false);
      fetchCardsAndProducts();
    } catch (err) {
      alert('Failed to provision NFC batch.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;
    setSubmitting(true);
    try {
      await assignAdminNfcCard({
        cardId: selectedCard.id,
        userEmail: assignData.userEmail,
      });
      setAssignModalOpen(false);
      fetchCardsAndProducts();
    } catch (err) {
      alert('Failed to link NFC card to user.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassign = async (card: any) => {
    if (!confirm(`Unlink card ${card.serialNumber} from user?`)) return;
    try {
      await assignAdminNfcCard({ cardId: card.id, userEmail: '' });
      fetchCardsAndProducts();
    } catch (err) {
      alert('Failed to unassign card.');
    }
  };

  const handleExportCSV = () => {
    if (cards.length === 0) {
      alert('No card records available to export.');
      return;
    }
    const headers = ['Serial Number', 'Hardware UID', 'Secure Activation PIN', 'Product Name', 'Status', 'Assigned User'];
    const rows = cards.map((c) => [
      c.serialNumber,
      c.uid,
      c.activationCode,
      c.product?.name || 'NFC Card',
      c.status,
      c.assignedUser?.email || 'UNASSIGNED',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TAGIT_NFC_Batch_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NFC Card <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Provisioning</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Encode batches of physical hardware UIDs with scratch-off activation PIN codes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center gap-2"
          >
            <span>📥</span>
            <span>Export CSV Batch</span>
          </button>
          <button
            onClick={() => setBatchModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>⚡ Generate Batch</span>
          </button>
        </div>
      </div>

      {/* Cards Table */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#13131D]/80 border border-white/10 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Provisioned Hardware Cards</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Physical NFC chips registered in the database (`Total: {cards.length}`).</p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cards.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-neutral-500 text-sm">No NFC cards generated yet. Click "Generate Batch" to encode physical cards.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono uppercase text-neutral-500 tracking-wider">
                  <th className="py-3 px-4">Serial Number</th>
                  <th className="py-3 px-4">Hardware UID</th>
                  <th className="py-3 px-4">Activation PIN</th>
                  <th className="py-3 px-4">Product Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Linked Account</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-mono">
                {cards.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-amber-400">{c.serialNumber}</td>
                    <td className="py-4 px-4 text-xs text-neutral-300 font-semibold">{c.uid}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-neutral-200 tracking-widest font-bold">
                        {c.activationCode}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-sans text-xs font-medium text-white">
                      {c.product?.name || 'Standard NFC Card'}
                    </td>
                    <td className="py-4 px-4 font-sans">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border ${
                          c.status === 'ACTIVATED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : c.status === 'ASSIGNED'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-sans text-xs">
                      {c.assignedUser ? (
                        <div>
                          <p className="font-semibold text-white">{c.assignedUser.email}</p>
                          <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                            @{c.assignedUser.profile?.username || 'profile'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-neutral-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-sans">
                      {c.status === 'UNASSIGNED' ? (
                        <button
                          onClick={() => {
                            setSelectedCard(c);
                            setAssignData({ userEmail: '' });
                            setAssignModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs font-medium text-amber-400 border border-amber-500/30 transition-all"
                        >
                          Link User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnassign(c)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 border border-red-500/30 transition-all"
                        >
                          Unlink
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Generate Batch Modal ───────────────────────────────── */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14141F] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-black">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Encode NFC Card Batch</h3>
              <button onClick={() => setBatchModalOpen(false)} className="text-neutral-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Batch Number</label>
                <input
                  type="text"
                  required
                  value={batchData.batchNumber}
                  onChange={(e) => setBatchData({ ...batchData, batchNumber: e.target.value })}
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Assigned Product SKU</label>
                <select
                  required
                  value={batchData.productId}
                  onChange={(e) => setBatchData({ ...batchData, productId: e.target.value })}
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                >
                  <option value="">Select SKU...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Cards Count to Generate</label>
                <select
                  value={batchData.count}
                  onChange={(e) => setBatchData({ ...batchData, count: Number(e.target.value) })}
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                >
                  <option value={10}>10 Cards</option>
                  <option value={25}>25 Cards</option>
                  <option value={50}>50 Cards</option>
                  <option value={100}>100 Cards (Bulk)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setBatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Encoding...' : 'Encode & Generate Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign Card Modal ──────────────────────────────────── */}
      {assignModalOpen && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14141F] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-black">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Link Card to User Account</h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-neutral-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 mt-5">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-neutral-300">
                <p>
                  <span className="text-neutral-500">Serial:</span> {selectedCard.serialNumber}
                </p>
                <p className="mt-1">
                  <span className="text-neutral-500">Hardware UID:</span> {selectedCard.uid}
                </p>
                <p className="mt-1">
                  <span className="text-neutral-500">PIN Code:</span>{' '}
                  <span className="text-amber-400 font-bold">{selectedCard.activationCode}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">User Account Email</label>
                <input
                  type="email"
                  required
                  value={assignData.userEmail}
                  onChange={(e) => setAssignData({ ...assignData, userEmail: e.target.value })}
                  placeholder="alex.miller@enterprise.com"
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Linking...' : 'Link NFC Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
