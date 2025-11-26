import React from "react";

export default function Products() {
  const products = [
    { id: 1, name: "Produk A", price: 10000 },
    { id: 2, name: "Produk B", price: 20000 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
      <ul>
        {products.map(p => (
          <li key={p.id} className="border-b py-2">
            {p.name} - Rp {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
