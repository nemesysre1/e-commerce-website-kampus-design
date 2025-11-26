// src/admin/components/Sidebar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Package, PlusCircle, List, Settings, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const itemClass = (p: string) =>
    `flex items-center gap-3 p-3 rounded-md transition ${path === p || path.startsWith(p) ? "bg-primary text-white" : "text-gray-200 hover:bg-gray-700/20"}`;

  return (
    <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
      <div className="p-5 text-lg font-semibold border-b border-gray-800 flex items-center justify-between">
        <div>Penjual</div>
      </div>

      <nav className="p-3 flex-1 space-y-1">
        <Link to="/admin" className={itemClass("/admin")}>
          <Home className="w-5 h-5" /> <span>Dashboard</span>
        </Link>

        <Link to="/admin/products" className={itemClass("/admin/products")}>
          <Package className="w-5 h-5" /> <span>Produk</span>
        </Link>

        <Link to="/admin/products/add" className={itemClass("/admin/products/add")}>
          <PlusCircle className="w-5 h-5" /> <span>Tambah Produk</span>
        </Link>

        <Link to="/admin/orders" className={itemClass("/admin/orders")}>
          <List className="w-5 h-5" /> <span>Pesanan</span>
        </Link>

        <Link to="/admin/settings" className={itemClass("/admin/settings")}>
          <Settings className="w-5 h-5" /> <span>Pengaturan</span>
        </Link>
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Pembeli
        </button>

        <button
          onClick={() => logout()}
          className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
