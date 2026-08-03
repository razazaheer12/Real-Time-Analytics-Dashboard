'use client';

import { useAuth } from '@/context/AuthContext';
import RequireRole from '@/components/RequireRole';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 fixed left-0 top-0">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Analytics</h2>
        <p className="text-xs text-gray-400 mt-1">Real-Time Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        <a href="/dashboard" className="block px-3 py-2 rounded bg-gray-800 hover:bg-gray-700">
          Dashboard
        </a>
        <a href="/settings" className="block px-3 py-2 rounded hover:bg-gray-800">
          Settings
        </a>

        <RequireRole allowedRoles={['ADMIN']}>
          <div className="pt-2 mt-2 border-t border-gray-800">
            <p className="text-xs text-gray-500 px-3 mb-1">Admin</p>
            <a href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-800">
              Manage Users
            </a>
            <p className="text-xs text-gray-400 px-3 mt-1">
              Export options available on the Dashboard page
            </p>
          </div>
        </RequireRole>
      </nav>

      <div className="border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-300">{user?.email}</p>
        <span className="inline-block text-xs px-2 py-1 mt-1 rounded bg-blue-600">
          {user?.role}
        </span>
        <button
          onClick={logout}
          className="w-full mt-3 text-sm text-red-400 hover:text-red-300 text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}