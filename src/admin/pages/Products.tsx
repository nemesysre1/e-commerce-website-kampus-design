// src/admin/pages/Products.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthHeader, apiFetch } from "../../lib/api";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const p = await apiFetch("/api/products");
        setProducts(Array.isArray(p) ? p : []);
      } catch (err) {
        console.error("Fetch products", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error(await res.text());
      setProducts(products.filter(p => p.id !== id));
      alert("Produk dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Produk</h1>
        <Link to="/admin/products/add" className="px-3 py-2 bg-primary text-white rounded">Tambah Produk</Link>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {products.length === 0 && <div className="p-4 bg-white rounded shadow">Belum ada produk.</div>}
          {products.map(p => (
            <div key={p.id} className="p-4 bg-white rounded shadow flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={p.image || p.imageUrl || ""} alt={p.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">Rp {Number(p.price).toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/admin/products/${p.id}/edit`} className="px-3 py-1 border rounded">Edit</Link>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
