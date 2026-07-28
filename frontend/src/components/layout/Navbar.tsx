'use client';

import { useSocket } from '@/hooks/useSocket';

export default function Navbar() {
  const { isConnected } = useSocket();

  return (
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-bold text-gray-900">Overview</h1>
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></span>
        {isConnected ? 'Live' : 'Disconnected'}
      </div>
    </header>
  );
}