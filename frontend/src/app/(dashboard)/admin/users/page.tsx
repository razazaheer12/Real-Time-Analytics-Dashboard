'use client';

import { useState, FormEvent } from 'react';
import api from '@/lib/axios';
import { useUsers, ManagedUser } from '@/hooks/useUsers';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import RequireRole from '@/components/RequireRole';

function AddUserForm({ onCreated }: { onCreated: () => void }) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ManagedUser['role']>('VIEWER');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/users', { name, email, password, role });
      showToast(`User ${email} created successfully`, 'success');
      setName('');
      setEmail('');
      setPassword('');
      setRole('VIEWER');
      onCreated();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create user', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Add New User</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as ManagedUser['role'])}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="VIEWER">VIEWER</option>
          <option value="ANALYST">ANALYST</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button
          type="submit"
          disabled={creating}
          className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}

function EditUserPanel({
  targetUser,
  onClose,
  onSaved,
  onDeleted,
}: {
  targetUser: ManagedUser;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [name, setName] = useState(targetUser.name);
  const [email, setEmail] = useState(targetUser.email);
  const [role, setRole] = useState(targetUser.role);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isSelf = currentUser?.id === targetUser.id;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, any> = { name, email, role };
      if (newPassword) payload.newPassword = newPassword;

      await api.patch(`/users/${targetUser.id}`, payload);
      showToast(`Updated ${email} successfully`, 'success');
      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/users/${targetUser.id}`);
      showToast(`Deleted ${targetUser.email}`, 'success');
      onDeleted();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Edit User</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
          ✕
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as ManagedUser['role'])}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="ANALYST">ANALYST</option>
          <option value="VIEWER">VIEWER</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Reset Password <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      <div className="border-t pt-4">
        {isSelf ? (
          <p className="text-xs text-gray-400 text-center">You cannot delete your own account</p>
        ) : (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`w-full px-4 py-2 rounded text-sm disabled:opacity-50 ${
              confirmDelete
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            {deleting
              ? 'Deleting...'
              : confirmDelete
              ? 'Click again to confirm delete'
              : 'Delete User'}
          </button>
        )}
      </div>
    </div>
  );
}

function ManageUsersContent() {
  const { users, loading, error, refetch } = useUsers();
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  if (loading) return <p className="text-gray-500">Loading users...</p>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        {selectedUser ? (
          <EditUserPanel
            targetUser={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSaved={refetch}
            onDeleted={refetch}
          />
        ) : (
          <AddUserForm onCreated={refetch} />
        )}
      </div>
    </div>
  );
}

export default function ManageUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Manage Users</h1>
      <RequireRole
        allowedRoles={['ADMIN']}
        fallback={
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            You don&apos;t have permission to view this page.
          </div>
        }
      >
        <ManageUsersContent />
      </RequireRole>
    </div>
  );
}