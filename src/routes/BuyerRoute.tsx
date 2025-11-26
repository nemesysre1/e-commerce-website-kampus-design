// src/routes/BuyerRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BuyerRoute({ children }: { children: React.ReactNode }) {
  const { user, isBuyer } = useAuth();

  // anonymous visitors should be able to view the public site
  if (!user) return <>{children}</>;

  // logged-in sellers should be sent to /admin
  if (!isBuyer) return <Navigate to="/admin" replace />;

  // logged-in buyers can view App
  return <>{children}</>;
}
