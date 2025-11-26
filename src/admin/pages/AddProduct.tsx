import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeader } from "../../lib/api";

export default function AddProduct() {
  const [form, setForm] = useState<any>({ name: "", price: 0, category: "", seller: "", location: "", imageUrl: "" });
  const [file, setFile] = useState<File | null>(null);
  const nav = useNavigate();

  const submit = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", String(form.price));
    fd.append("category", form.category);
    fd.append("seller", form.seller);
    fd.append("location", form.location);
    if (file) fd.append("image", file);
    else fd.append("imageUrl", form.imageUrl);

    const res = await fetch("http://localhost:4000/api/products", {
      method: "POST",
      body: fd,
      headers: { ...getAuthHeader() } // includes token
    });
    if (res.ok) {
      alert("Produk ditambahkan");
      nav("/admin/products");
    } else {
      const txt = await res.text();
      alert("Error: " + txt);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk</h1>
      <div className="grid gap-3">
        <input placeholder="Nama" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
        <input placeholder="Harga" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="input" />
        <input placeholder="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input" />
        <input placeholder="Seller" value={form.seller} onChange={e => setForm({ ...form, seller: e.target.value })} className="input" />
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input" />
        <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="input" />
        <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded" onClick={submit}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
