// src/admin/pages/DashboardHome.tsx
import React, { useEffect, useState } from "react";
import { apiFetch, getAuthHeader } from "../../lib/api";

export default function DashboardHome() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      try {
        const p = await apiFetch("/api/products");
        const o = await apiFetch("/api/orders", { headers: getAuthHeader() });

        // calculate simple revenue from orders if structure matches
        const revenue = Array.isArray(o) ? o.reduce((s: number, it: any) => s + (it.total || 0), 0) : 0;

        setStats({
          products: Array.isArray(p) ? p.length : 0,
          orders: Array.isArray(o) ? o.length : 0,
          revenue,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Ringkasan</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Produk</div>
          <div className="mt-2 text-2xl font-bold">{stats.products}</div>
        </div>

        <div className="p-5 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Pesanan</div>
          <div className="mt-2 text-2xl font-bold">{stats.orders}</div>
        </div>

        <div className="p-5 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Pendapatan (estimasi)</div>
          <div className="mt-2 text-2xl font-bold">Rp {stats.revenue?.toLocaleString?.() ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
