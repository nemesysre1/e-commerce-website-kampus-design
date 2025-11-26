// src/routes/SellerRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerRoute({ children }: { children: React.ReactNode }) {
  const { user, isSeller } = useAuth();

  if (!user) return <Navigate to="/" replace />; // not logged in -> public site
  if (!isSeller) return <Navigate to="/" replace />; // buyer trying /admin -> back to /

  return <>{children}</>;
}
