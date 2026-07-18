import React, { useState } from 'react';
import { Trash2, User, Edit2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const AdminUsers = ({ users, setUsers, t }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      showToast(t.userRemoved || 'User removed successfully', 'success');
    } catch (error) {
      console.error('Delete user error:', error);
      showToast(error.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      setUsers(users.map(u => u._id === id ? { ...u, role } : u));
      showToast(t.savedSuccess || 'Role updated successfully', 'success');
    } catch (error) {
      console.error('Update role error:', error);
      showToast(error.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  return (
    <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-serif font-semibold">{t.manageUsers}</h4>
        <span className="text-xs text-ink-soft">{users?.length || 0} users</span>
      </div>

      {users?.length === 0 ? (
        <p className="text-center text-ink-soft py-8">{t.noUsersYet}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.fullName}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden sm:table-cell">{t.email}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden md:table-cell">{t.phone}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden lg:table-cell">{t.address}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.role}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-line last:border-0">
                  <td className="py-2.5 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-maroon text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium">{user.name}</span>
                  </td>
                  <td className="py-2.5 hidden sm:table-cell text-ink-soft">{user.email}</td>
                  <td className="py-2.5 hidden md:table-cell text-ink-soft">{user.phone}</td>
                  <td className="py-2.5 hidden lg:table-cell text-ink-soft">{user.address}</td>
                  <td className="py-2.5">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="text-xs font-bold px-2 py-1 rounded-full border border-line bg-panel focus:border-vermilion focus:outline-none"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={loading}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;