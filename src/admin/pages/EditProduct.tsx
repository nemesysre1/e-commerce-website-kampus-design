import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthHeader } from "../../lib/api";

export default function EditProduct() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:4000/api/products/${id}`);
      const data = await res.json();
      setForm(data);
    })();
  }, [id]);

  const submit = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", String(form.price));
    fd.append("category", form.category);
    fd.append("seller", form.seller);
    fd.append("location", form.location);
    if (file) fd.append("image", file);
    const res = await fetch(`http://localhost:4000/api/products/${id}`, {
      method: "PUT",
      body: fd,
      headers: { ...getAuthHeader() }
    });
    if (res.ok) {
      alert("Tersimpan");
      nav("/admin/products");
    } else {
      alert("Error");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Produk</h1>
      <div className="grid gap-3">
        <input placeholder="Nama" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
        <input placeholder="Harga" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="input" />
        <input placeholder="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input" />
        <input placeholder="Seller" value={form.seller} onChange={e => setForm({ ...form, seller: e.target.value })} className="input" />
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input" />
        <div>
          <img src={form.image} className="w-32 h-32 object-cover" alt="" />
        </div>
        <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded" onClick={submit}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
