import React, { useState } from "react";

export default function AddProducts() {
  const [product, setProduct] = useState({ name: "", price: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Produk ditambahkan:", product);
    alert("Produk berhasil ditambahkan!");
    setProduct({ name: "", price: "", description: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Nama Produk"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Harga Produk"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Deskripsi Produk"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Tambah</button>
      </form>
    </div>
  );
}
