# 🛡️ Shigosag POS Institutional Terminal API v4.0

## Authentication & Headers
All non-public endpoints require standard Bearer token authorization:
`Authorization: Bearer <JWT_TOKEN>`

---

## Endpoint Specifications

### 🔐 Authentication (`/api/auth`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Creates cashier account initialized with simulation vault liquidity | Public |
| `POST` | `/api/auth/login` | Authenticates cashier and issues 24-hour JWT token | Public |
| `GET` | `/api/auth/profile` | Fetches active operator profile, current balance, and role | Yes |
| `PUT` | `/api/auth/profile` | Updates operator name, email, or password | Yes |
| `DELETE` | `/api/auth/delete-account` | Soft-deletes user profile and revokes terminal access | Yes |

---

### 💳 POS & Financial Engine (`/api/pos`)
| Method | Route | Payload | Isolation Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/pos/verify-account` | `{ accountNumber: string, bank?: string }` | Read-only | Validates 10-digit NUBAN destination account |
| `POST` | `/api/pos/process-transfer` | `{ amount: number, accountNumber: string, bankName: string, accountName: string }` | Serializable | Atomic transfer debit from user balance |
| `POST` | `/api/pos/checkout` | `{ items: CartItem[], total: number, paymentMethod?: string }` | Serializable | Validates stock, decrements inventory, increments cashier vault balance |
| `GET` | `/api/pos/transactions` | Query: `?page=1&limit=50` | Scoped by User | Returns paginated audit ledger records strictly for caller |

---

### 📦 Inventory Management (`/api/products`)
| Method | Route | Payload | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Query: `?search=&category=&page=1&limit=100` | Lists active inventory with stock counts |
| `GET` | `/api/products/:id` | None | Fetches detailed product record |
| `POST` | `/api/products` | `{ name: string, price: number, stock: number, category?: string, barcode?: string }` | Adds new inventory item with real-time socket broadcast |
| `PUT` | `/api/products/:id` | Partial product schema | Updates pricing, stock levels or categories |
| `DELETE` | `/api/products/:id` | None | Soft-deletes and archives item |
