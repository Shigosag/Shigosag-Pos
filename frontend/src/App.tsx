import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import { Navigate } from "react-router-dom";
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

export default function App() {
  const user = useAuthStore((s) => s.user);
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Redirect to login if user is null */}
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/pos/transfer" element={user ? <BankTransfer /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
          
          <Route path="/sales" element={<Sales />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/airtime" element={<Airtime />} />
          <Route path="/data" element={<Data />} />
          <Route path="/balance" element={<Balance />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
