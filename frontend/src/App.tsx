import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import { useAuthStore } from "./store/authStore";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import BankTransfer from "./pages/POS/BankTransfer";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Analytics from "./pages/Analytics";
import Transfers from "./pages/Transfers";
import Withdraw from "./pages/Withdraw";
import History from "./pages/History";
import Airtime from "./pages/Airtime";
import Data from "./pages/Data";
import Balance from "./pages/Balance";

// Wrapper: Checks login and only attaches the Sidebar to protected pages
function ProtectedLayout() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC PAGES: Pure full-screen card, no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED PAGES: Wrapped inside Sidebar + Top Header */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pos/transfer" element={<BankTransfer />} />
          <Route path="/history" element={<History />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/airtime" element={<Airtime />} />
          <Route path="/data" element={<Data />} />
          <Route path="/balance" element={<Balance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
