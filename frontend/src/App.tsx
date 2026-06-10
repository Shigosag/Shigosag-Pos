import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
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
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/history" element={<History />} />
          <Route path="/airtime" element={<Airtime />} />
          <Route path="/data" element={<Data />} />
          <Route path="/balance" element={<Balance />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}