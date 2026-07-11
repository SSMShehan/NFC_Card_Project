'use client';

import React, { useEffect, useState } from 'react';
import { getAdminVerifications, moderateAdminVerification } from '../../../services/api';
import { useAdminTheme } from '../AdminThemeContext';

export default function AdminVerificationsPage() {
  const { isLight } = useAdminTheme();
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
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            Profile & Logo{' '}
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
              Moderation Queue
            </span>
          </h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Review AI and human moderation requests before sensitive profile changes go live.
          </p>
        </div>
      </div>

      {/* Pending Queue */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
          isLight
            ? 'bg-white border-neutral-200 shadow-neutral-200/50'
            : 'bg-[#13131D]/80 border-white/10 shadow-black/40'
        }`}
      >
        <div className={`flex items-center justify-between pb-6 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
          <div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>Pending Approval Queue</h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
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
                  className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg ${
                    isLight
                      ? 'bg-amber-50/50 border-amber-300 shadow-amber-500/10'
                      : 'bg-[#0B0B11]/90 border-amber-500/30 shadow-amber-500/5'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                          isLight ? 'bg-amber-500/15 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        Field: {item.fieldName}
                      </span>
                      <span className={`text-xs font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        Requested on {new Date(item.requestedAt).toLocaleDateString()} at {new Date(item.requestedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className={`text-sm ${isLight ? 'text-neutral-800' : 'text-neutral-300'}`}>
                      Profile Handle: <span className={`font-bold font-mono ${isLight ? 'text-neutral-900' : 'text-white'}`}>@{item.profile?.username}</span> (
                      {item.profile?.displayName})
                    </p>

                    <div
                      className={`p-3.5 rounded-xl border mt-2 font-mono text-xs ${
                        isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-white/5 border-white/10 text-white'
                      }`}
                    >
                      <span className="text-neutral-500 uppercase">Proposed New Value:</span>
                      <div className={`mt-1 font-bold break-all ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{item.newValue}</div>
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
                      className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs border transition-all disabled:opacity-50 ${
                        isLight
                          ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                          : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
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
        <div
          className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
            isLight
              ? 'bg-white border-neutral-200 shadow-neutral-200/50'
              : 'bg-[#13131D]/80 border-white/10 shadow-black/40'
          }`}
        >
          <h3 className={`text-lg font-bold pb-6 border-b ${isLight ? 'text-neutral-900 border-neutral-200' : 'text-white border-white/10'}`}>
            Recent Moderation History
          </h3>
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className={`border-b uppercase tracking-wider ${isLight ? 'border-neutral-200 text-neutral-500 bg-neutral-50' : 'border-white/10 text-neutral-500'}`}>
                  <th className="py-3 px-4">Profile</th>
                  <th className="py-3 px-4">Field</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4">Reviewed At</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${isLight ? 'divide-neutral-200' : 'divide-white/5'}`}>
                {reviewedRequests.slice(0, 15).map((r) => (
                  <tr key={r.id} className={`transition-colors ${isLight ? 'hover:bg-neutral-50' : 'hover:bg-white/[0.02]'}`}>
                    <td className={`py-3 px-4 font-bold font-sans ${isLight ? 'text-neutral-900' : 'text-white'}`}>@{r.profile?.username}</td>
                    <td className={`py-3 px-4 ${isLight ? 'text-amber-700 font-bold' : 'text-amber-400'}`}>{r.fieldName}</td>
                    <td className={`py-3 px-4 max-w-xs truncate ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>{r.newValue}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold border ${
                          r.status === 'APPROVED'
                            ? isLight ? 'bg-emerald-500/15 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isLight ? 'bg-red-500/15 text-red-800 border-red-300' : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
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
