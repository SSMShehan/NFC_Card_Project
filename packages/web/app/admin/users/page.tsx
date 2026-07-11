'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminUsers, updateAdminUser, createAdminUser } from '../../../services/api';

export default function AdminUsersPage() {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">CRM & Directory</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Manage user subscriptions, elevate accounts to VIP Corporate & moderate status.</p>
        </div>
        <button
          onClick={() => {
            setErrorMsg(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <span>+ Add New Admin</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-[#13131D]/80 border border-white/10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by email, name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0B11] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-500 outline-none"
          />
          <span className="absolute left-3.5 top-2.5 text-neutral-500 text-base">🔍</span>
        </div>
        <div className="text-xs font-mono text-neutral-400 self-end sm:self-auto">
          Showing <span className="font-bold text-white">{filteredUsers.length}</span> of {users.length} accounts
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#13131D]/80 border border-white/10 shadow-xl shadow-black/40">
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
                <tr className="border-b border-white/10 text-xs font-mono uppercase text-neutral-500 tracking-wider">
                  <th className="py-3 px-4">Account & Email</th>
                  <th className="py-3 px-4">Profile & Handle</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Subscription Tier</th>
                  <th className="py-3 px-4">Status & Taps</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredUsers.map((u) => {
                  const isUpdating = updatingId === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-amber-400 font-mono text-xs uppercase">
                            {u.email.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">{u.email}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono uppercase text-neutral-400">
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
                              className="font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5 text-sm"
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
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/10'
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
                          className="bg-[#0B0B11] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-semibold focus:border-amber-500 outline-none"
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
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                              }`}
                            >
                              {u.profile.status}
                            </button>
                            <span className="text-neutral-400 font-bold">{u.profile.tapCount || 0} taps</span>
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
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all border border-white/5 inline-block"
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
          <div className="bg-[#14141F] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-black">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Add New Admin User</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin.alex@tagit.com"
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Unique Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                  placeholder="alex_admin"
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">Display Name</label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Alex Mercer (Operations)"
                  className="w-full bg-[#0B0B11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 outline-none"
                />
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
