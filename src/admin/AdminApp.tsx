// src/admin/AdminApp.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import DashboardHome from './pages/DashboardHome';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

export default function AdminApp() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6">
          <Routes>
            <Route
              index
              element={<DashboardHome />}
            />
            <Route
              path="products"
              element={<Products />}
            />
            <Route
              path="products/add"
              element={<AddProduct />}
            />
            <Route
              path="products/:id/edit"
              element={<EditProduct />}
            />
            <Route
              path="orders"
              element={<Orders />}
            />
            <Route
              path="settings"
              element={<Settings />}
            />
            <Route
              path="*"
              element={
                <Navigate
                  to="/admin"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
