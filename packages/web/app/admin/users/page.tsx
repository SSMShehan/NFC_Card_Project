'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminUsers, updateAdminUser, createAdminUser } from '../../../services/api';
import { useAdminTheme } from '../AdminThemeContext';

export default function AdminUsersPage() {
  const { isLight } = useAdminTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New Admin creation states
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTier = async (userId: string, newTier: string) => {
    setUpdatingId(userId);
    try {
      await updateAdminUser(userId, { subscriptionTier: newTier });
      fetchUsers();
    } catch (err) {
      alert('Failed to update subscription tier.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!confirm(`Change profile status from ${currentStatus} to ${nextStatus}?`)) return;
    setUpdatingId(userId);
    try {
      await updateAdminUser(userId, { profileStatus: nextStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to update profile status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleAdminRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Change account role from ${currentRole} to ${nextRole}?`)) return;
    setUpdatingId(userId);
    try {
      await updateAdminUser(userId, { role: nextRole });
      fetchUsers();
    } catch (err) {
      alert('Failed to update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await createAdminUser(formData);
      if (res.success) {
        setModalOpen(false);
        setFormData({ email: '', password: '', username: '', displayName: '' });
        fetchUsers();
      } else {
        setErrorMsg(res.error || res.message || 'Failed to create admin.');
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || 'Failed to create admin.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.profile?.displayName && u.profile.displayName.toLowerCase().includes(q)) ||
      (u.profile?.username && u.profile.username.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            Customer{' '}
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
              CRM & Directory
            </span>
          </h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Manage user subscriptions, elevate accounts to VIP Corporate & moderate status.
          </p>
        </div>
        <button
          onClick={() => {
            setErrorMsg(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white dark:text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <span>+ Add New Admin</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        className={`flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl border ${
          isLight ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#13131D]/80 border-white/10'
        }`}
      >
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by email, name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 outline-none border ${
              isLight
                ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                : 'bg-[#0B0B11] border-white/10 text-white'
            }`}
          />
          <span className="absolute left-3.5 top-2.5 text-neutral-500 text-base">🔍</span>
        </div>
        <div className={`text-xs font-mono self-end sm:self-auto ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
          Showing <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>{filteredUsers.length}</span> of {users.length} accounts
        </div>
      </div>

      {/* Users Table */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
          isLight
            ? 'bg-white border-neutral-200 shadow-neutral-200/50'
            : 'bg-[#13131D]/80 border-white/10 shadow-black/40'
        }`}
      >
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-neutral-500 text-sm">No user accounts found matching "{searchQuery}".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs font-mono uppercase tracking-wider ${isLight ? 'border-neutral-200 text-neutral-500 bg-neutral-50' : 'border-white/10 text-neutral-500'}`}>
                  <th className="py-3 px-4">Account & Email</th>
                  <th className="py-3 px-4">Profile & Handle</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Subscription Tier</th>
                  <th className="py-3 px-4">Status & Taps</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${isLight ? 'divide-neutral-200' : 'divide-white/5'}`}>
                {filteredUsers.map((u) => {
                  const isUpdating = updatingId === u.id;
                  return (
                    <tr key={u.id} className={`transition-colors ${isLight ? 'hover:bg-neutral-50' : 'hover:bg-white/[0.02]'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold font-mono text-xs uppercase ${
                              isLight ? 'bg-amber-500/15 border-amber-300 text-amber-800' : 'bg-white/5 border-white/10 text-amber-400'
                            }`}
                          >
                            {u.email.slice(0, 2)}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${isLight ? 'text-neutral-900' : 'text-white'}`}>{u.email}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono uppercase ${isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-600' : 'bg-white/5 border-white/10 text-neutral-400'}`}>
                              {u.authProvider}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {u.profile ? (
                          <div>
                            <Link
                              href={`/p/${u.profile.username}`}
                              target="_blank"
                              className={`font-bold transition-colors flex items-center gap-1.5 text-sm ${
                                isLight ? 'text-neutral-900 hover:text-amber-700' : 'text-white hover:text-amber-400'
                              }`}
                            >
                              <span>{u.profile.displayName}</span>
                              <span className="text-xs">↗</span>
                            </Link>
                            <p className="text-xs font-mono text-neutral-500">@{u.profile.username}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-500 italic">No Profile Created</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <button
                          disabled={isUpdating}
                          onClick={() => handleToggleAdminRole(u.id, u.role)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border transition-all ${
                            u.role === 'SUPER_ADMIN' || u.role === 'ADMIN'
                              ? isLight
                                ? 'bg-amber-500/15 text-amber-900 border-amber-400 shadow-sm'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/10'
                              : isLight
                                ? 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                                : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                          }`}
                        >
                          {u.role}
                        </button>
                      </td>

                      <td className="py-4 px-4 font-sans">
                        <select
                          disabled={isUpdating}
                          value={u.subscriptionTier}
                          onChange={(e) => handleUpdateTier(u.id, e.target.value)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-mono font-semibold focus:border-amber-500 outline-none border ${
                            isLight
                              ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                              : 'bg-[#0B0B11] border-white/10 text-white'
                          }`}
                        >
                          <option value="FREE">FREE TIER</option>
                          <option value="PREMIUM">PREMIUM ($9.99/mo)</option>
                          <option value="CORPORATE">CORPORATE VIP</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs">
                        {u.profile ? (
                          <div className="flex items-center gap-3">
                            <button
                              disabled={isUpdating}
                              onClick={() => handleToggleStatus(u.id, u.profile.status)}
                              className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase font-bold border transition-all ${
                                u.profile.status === 'ACTIVE'
                                  ? isLight
                                    ? 'bg-emerald-500/15 text-emerald-800 border-emerald-300 hover:bg-emerald-500/25'
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                  : isLight
                                    ? 'bg-red-500/15 text-red-800 border-red-300 hover:bg-red-500/25'
                                    : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                              }`}
                            >
                              {u.profile.status}
                            </button>
                            <span className={`font-bold ${isLight ? 'text-neutral-700' : 'text-neutral-400'}`}>
                              {u.profile.tapCount || 0} taps
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-500">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        {u.profile && (
                          <Link
                            href={`/p/${u.profile.username}`}
                            target="_blank"
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border inline-block ${
                              isLight
                                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                                : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/5'
                            }`}
                          >
                            View Card
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Admin User Modal ─────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`border rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl ${
              isLight
                ? 'bg-white border-neutral-300 text-neutral-900 shadow-neutral-500/30'
                : 'bg-[#14141F] border-white/10 text-white shadow-black'
            }`}
          >
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <h3 className={`text-lg font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>Add New Admin User</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-red-500 p-1 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div
                className={`mt-4 p-3 rounded-xl border text-xs font-mono ${
                  isLight ? 'bg-red-50 border-red-300 text-red-700' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4 mt-5">
              <div>
                <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin.alex@tagit.com"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none border ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                      : 'bg-[#0B0B11] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Temporary Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none border ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                      : 'bg-[#0B0B11] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Unique Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                  placeholder="alex_admin"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-mono focus:border-amber-500 outline-none border ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                      : 'bg-[#0B0B11] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Alex Mercer (Operations)"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none border ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                      : 'bg-[#0B0B11] border-white/10 text-white'
                  }`}
                />
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
                  {submitting ? 'Creating...' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
