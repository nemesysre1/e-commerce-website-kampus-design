import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminApp from "./admin/AdminApp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";

function BuyerRoute() {
  return <App />;
}

function SellerRoute() {
  const { isSeller } = useAuth();

  if (!isSeller) {
    return <div>Akses ditolak (bukan penjual)</div>;
  }

  return <AdminApp />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<BuyerRoute />} />
        <Route path="/admin/*" element={<SellerRoute />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
