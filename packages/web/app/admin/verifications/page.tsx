'use client';

import React, { useEffect, useState } from 'react';
import { getAdminVerifications, moderateAdminVerification } from '../../../services/api';

export default function AdminVerificationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getAdminVerifications();
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setUpdatingId(id);
    try {
      await moderateAdminVerification(id, { status });
      fetchRequests();
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} request.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const reviewedRequests = requests.filter((r) => r.status !== 'PENDING');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile & Logo <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Moderation Queue</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Review AI and human moderation requests before sensitive profile changes go live.</p>
        </div>
      </div>

      {/* Pending Queue */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#13131D]/80 border border-white/10 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Pending Approval Queue</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Requires administrator verification (`Total Pending: {pendingRequests.length}`).
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-neutral-500 text-sm">No pending verification requests at this time. All clean! ✅</p>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {pendingRequests.map((item) => {
              const isUpdating = updatingId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-[#0B0B11]/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg shadow-amber-500/5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                        Field: {item.fieldName}
                      </span>
                      <span className="text-xs font-mono text-neutral-500">
                        Requested on {new Date(item.requestedAt).toLocaleDateString()} at {new Date(item.requestedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-300">
                      Profile Handle: <span className="font-bold text-white font-mono">@{item.profile?.username}</span> (
                      {item.profile?.displayName})
                    </p>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mt-2 font-mono text-xs text-white">
                      <span className="text-neutral-500 uppercase">Proposed New Value:</span>
                      <div className="mt-1 font-bold text-emerald-400 break-all">{item.newValue}</div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-3 shrink-0">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleModerate(item.id, 'APPROVED')}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isUpdating ? 'Applying...' : '✓ Approve & Live'}
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleModerate(item.id, 'REJECTED')}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30 transition-all disabled:opacity-50"
                    >
                      ✕ Reject Request
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History Table */}
      {reviewedRequests.length > 0 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#13131D]/80 border border-white/10 shadow-xl shadow-black/40">
          <h3 className="text-lg font-bold text-white pb-6 border-b border-white/10">Recent Moderation History</h3>
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 uppercase text-neutral-500 tracking-wider">
                  <th className="py-3 px-4">Profile</th>
                  <th className="py-3 px-4">Field</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4">Reviewed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {reviewedRequests.slice(0, 15).map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold text-white font-sans">@{r.profile?.username}</td>
                    <td className="py-3 px-4 text-amber-400">{r.fieldName}</td>
                    <td className="py-3 px-4 text-neutral-300 max-w-xs truncate">{r.newValue}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold border ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">
                      {r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
