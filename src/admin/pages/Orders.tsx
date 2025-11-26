import React from 'react';

export default function Orders() {
  const orders = [
    { id: 1, product: 'Produk A', customer: 'Budi', status: 'Pending' },
    { id: 2, product: 'Produk B', customer: 'Sari', status: 'Selesai' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Pesanan</h1>
      <ul>
        {orders.map((o) => (
          <li
            key={o.id}
            className="border-b py-2 flex justify-between"
          >
            <span>
              {o.product} - {o.customer}
            </span>
            <span className={o.status === 'Selesai' ? 'text-green-500' : 'text-yellow-500'}>{o.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
