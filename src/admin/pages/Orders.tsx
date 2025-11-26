// src/admin/pages/Orders.tsx
import React, { useEffect, useState } from "react";
import { getAuthHeader, apiFetch } from "../../lib/api";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const o = await apiFetch("/api/orders", { headers: getAuthHeader() });
        setOrders(Array.isArray(o) ? o : []);
      } catch (err) {
        console.error("Fetch orders", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
      alert("Gagal update status");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pesanan</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {orders.length === 0 && <div className="p-4 bg-white rounded shadow">Belum ada pesanan.</div>}
          {orders.map(o => (
            <div key={o.id} className="p-4 bg-white rounded shadow flex justify-between items-start">
              <div>
                <div className="font-medium">{o.customerName} • Rp {Number(o.total).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{o.phone} • {o.address}</div>
                <div className="mt-2"><strong>Status:</strong> <span className="ml-2">{o.status}</span></div>
                <div className="mt-2 text-sm">{(o.items || []).map((it:any) => `${it.name} x${it.quantity}`).join(", ")}</div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => updateStatus(o.id, "processing")} className="px-3 py-1 border rounded">Proses</button>
                <button onClick={() => updateStatus(o.id, "shipped")} className="px-3 py-1 border rounded">Kirim</button>
                <button onClick={() => updateStatus(o.id, "done")} className="px-3 py-1 border rounded">Selesai</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
