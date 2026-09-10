# 🚀 Shigosag POS

[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, real-time POS (Point of Sale) system for web and mobile. Built with **React**, **TypeScript**, **Vite**, **Express**, **Prisma**, **PostgreSQL**, **Socket.IO**, and **Expo**.

---

## 🌐 Live Demo

🚀 **Try Shigosag POS:**  
https://shigosag-pos-juwyi.faable.link/

---

| Light Mode | Colored Mode |
| :---: | :---: |
| ![POS Dashboard](screenshots/dashboard_light_mobile.png) | ![POS Dashboard](screenshots/dashboard_colored_mobile.png) |

### 🎥 System Walkthrough & Demo

<div align="center">
  <video src="https://github.com/user-attachments/assets/18b4d967-9126-4b85-8b3f-bfb8cd6147fb" width="100%" controls></video>
</div>

**Timestamps:**
- **0:00** - Dashboard Colored Mode Overview
- **0:19** - Dashboard Light Mode Overview
- **0:35** - Sidebar Overview
- **1:15** - History Overview
- **1:39** - Checkout Overview
- **2:16** - GitHub Repository Overview

---

## ✨ Features

- 🖥️ Modern, responsive dashboard UI  
- 🔴 Live transactions feed  
- ⚡ Quick actions for sales, products, customers, transfers, and more  
- 🌐 Real-time updates with Socket.IO  
- 💳 Stripe-ready checkout modal (simulated or real)  
- 📊 Analytics and sales chart  
- 📱 Mobile-friendly with Expo app  
- 🔒 Secure and scalable backend  

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Node.js, Express, Prisma, PostgreSQL|
| Frontend    | React, TypeScript, Vite             |
| Mobile      | React Native, Expo                  |
| Real-time   | Socket.IO                           |
| Charts      | Recharts                            |
| Security    | Helmet, CORS                        |
| Payments    | Stripe (placeholder ready)          |

---

## 📂 Project Structure

```txt
Shigosag-Pos/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── posController.ts
│   │   │   └── productController.ts
│   │   ├── lib/
│   │   │   ├── db.ts
│   │   │   ├── prisma.ts
│   │   │   └── socket.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── rbac.ts
│   │   │   ├── roleMiddleware.ts
│   │   │   └── validate.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── posRoutes.ts
│   │   │   └── productRoutes.ts
│   │   ├── services/
│   │   │   ├── ledgerService.ts
│   │   │   ├── posService.ts
│   │   │   ├── productService.ts
│   │   │   └── saleService.ts
│   │   ├── utils/
│   │   │   ├── ApiResponse.ts
│   │   │   ├── logger.ts
│   │   │   └── validateEnv.ts
│   │   ├── validations/
│   │   │   └── productValidator.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts
│   │   ├── components/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── Toast.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── POS/
│   │   │   │   └── BankTransfer.tsx
│   │   │   ├── Airtime.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Balance.tsx
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Data.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Sales.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Transfers.tsx
│   │   │   └── Withdraw.tsx
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── cartStore.ts
│   │   │   └── themeStore.ts
│   │   ├── utils/
│   │   │   └── format.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── mobile/
│   ├── assets/
│   ├── components/
│   ├── screens/
│   ├── App.tsx
│   └── package.json
│
├── docs/
│   ├── API.md
│   └── ARCHITECTURE.md
│
├── .gitignore
├── docker-compose.yml
├── LICENSE.txt
├── package.json
└── README.md
```
----

## 🖼️ Dashboard Preview

| Light Mode Top Section | Colored Mode Top Section |
| :---: | :---: |
| ![Light Mode Dashboard](screenshots/dashboard_light.png) | ![Colored Mode Dashboard](screenshots/dashboard_colored.png) |

| Light Mode Middle Section | Colored Mode Middle Section |
| :---: | :---: |
| ![Light Mode Dashboard](screenshots/dashboard_light2.png) | ![Colored Mode Dashboard](screenshots/dashboard_colored2.png) |

| Light Mode Bottom Section | Colored Mode Bottom Section |
| :---: | :---: |
| ![Light Mode Dashboard](screenshots/dashboard_light3.png) | ![Colored Mode Dashboard](screenshots/dashboard_colored3.png) |

| History | Checkout |
| :---: | :---: |
| ![History](screenshots/history.png) | ![Checkout](screenshots/checkout.png) |

---

## ⚡ Installation

## Prerequisites
- Node.js (v18+)

## Clone the repository
```bash
git clone https://github.com/Shigosag/Shigosag-Pos.git
cd Shigosag-Pos
```

## Backend

```bash
cd backend
npm install
npx prisma generate
npm run dev 
```

Browser: http://localhost:5000

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Browser: http://localhost:5173

## Mobile
```bash
cd mobile
npx create-expo-app
npm install 
npx expo start
```

## Or Docker

```bash
docker compose up --build
```

---

## 🖼️ Dashboard Mobile Preview

| Light Mode Top Section | Colored Mode Top Section |
| :---: | :---: |
| ![Light Mode Dashboard](screenshots/dashboard_light_mobile.png) | ![Colored Mode Dashboard](screenshots/dashboard_colored_mobile.png) |

| Light Mode Bottom Section | Colored Mode Bottom Section |
| :---: | :---: |
| ![Light Mode Dashboard](screenshots/dashboard_light_mobile2.png) | ![Colored Mode Dashboard](screenshots/dashboard_colored_mobile2.png) |

| History | Checkout |
| :---: | :---: |
| ![History](screenshots/history_mobile.png) | ![Checkout](screenshots/checkout_mobile.png) |

---

📜 License

MIT License © 2026 Shigosag

---

## 👤 Author & Credits

- Shigosag
- Portions of code generated with AI support
