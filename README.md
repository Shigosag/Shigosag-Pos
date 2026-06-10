# 🚀 Shigosag POS

A modern, real-time POS (Point of Sale) system for web and mobile. Built with **React**, **TypeScript**, **Vite**, **Express**, **Prisma**, **PostgreSQL**, **Socket.IO**, and **Expo**.

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
├─ backend/
│  ├─ prisma/
│  │  └─ schema.prisma
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ routes/
│  │  ├─ middlewares/
│  │  ├─ services/
│  │  └─ index.ts
│  ├─ package.json
│  └─ tsconfig.json
│
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ hooks/
│  │  ├─ utils/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ package.json
│  └─ vite.config.ts
│
├─ mobile/
│  ├─ assets/
│  ├─ components/
│  ├─ screens/
│  ├─ App.tsx
│  └─ package.json
│
├─ docker-compose.yml
└─ README.md
```
---

## ⚡ Installation

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
npm install
```

## Or Docker

```bash
docker compose up --build
```

---

📜 License

MIT License © 2026 Shigosag

---

## 👤 Author & Credits

- Shigosag
- Portions of code generated with AI support
