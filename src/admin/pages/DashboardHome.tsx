import React from "react";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Penjual</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/dashboard/add-products" className="p-4 bg-blue-500 text-white rounded">Tambah Produk</Link>
        <Link to="/dashboard/products" className="p-4 bg-green-500 text-white rounded">Daftar Produk</Link>
        <Link to="/dashboard/orders" className="p-4 bg-yellow-500 text-white rounded">Pesanan</Link>
        <Link to="/dashboard/settings" className="p-4 bg-gray-500 text-white rounded">Pengaturan</Link>
        <Link to="/dashboard/homepage-settings" className="p-4 bg-purple-500 text-white rounded">Pengaturan Laman Utama</Link>
      </div>
    </div>
  );
}
