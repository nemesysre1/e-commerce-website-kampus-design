// src/admin/components/Topbar.tsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
      <div className="text-lg font-semibold text-gray-800">Dashboard Penjual</div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div>
          <div className="text-xs text-gray-400">Masuk sebagai</div>
          <div className="font-medium">{user?.name ?? "User"}</div>
        </div>
      </div>
    </header>
  );
}
