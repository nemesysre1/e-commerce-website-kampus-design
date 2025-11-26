import React, { useState } from "react";

export default function EditProducts() {
  const [products, setProducts] = useState([
    { id: 1, name: "Produk A", price: 10000 },
    { id: 2, name: "Produk B", price: 20000 },
  ]);

  const handleEdit = (id: number) => {
    const newName = prompt("Nama baru:");
    const newPrice = prompt("Harga baru:");
    if (newName && newPrice) {
      setProducts(products.map(p => p.id === id ? { ...p, name: newName, price: Number(newPrice) } : p));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Produk</h1>
      <ul>
        {products.map(p => (
          <li key={p.id} className="flex justify-between mb-2">
            <span>{p.name} - Rp {p.price}</span>
            <button onClick={() => handleEdit(p.id)} className="bg-yellow-500 text-white p-1 rounded">Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
