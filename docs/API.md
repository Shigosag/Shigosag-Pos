# 🚀 Shigosag POS API Documentation

## 🔐 Authentication
*All endpoints except `/auth/login` and `/auth/register` require `Authorization: Bearer <token>`.*

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | `{ name, email, password }` | Create staff account |
| `/api/auth/login` | POST | `{ email, password }` | Get JWT & User Object |
| `/api/auth/profile` | GET | - | Get current staff details |

## 💸 POS Operations (Nigerian Standard)
| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/api/pos/verify-account` | POST | `{ accountNumber }` | Verify NUBAN (Returns Name) |
| `/api/pos/process-transfer`| POST | `{ amount, bank, accountName }`| Process & Log Transfer |

## 📦 Inventory & Sales
| Endpoint | Method | Params / Payload | Description |
| :--- | :--- | :--- | :--- |
| `/api/products` | GET | `?page=1&limit=10` | List products (Paginated) |
| `/api/products` | POST | `{ name, price, stock }` | Add item (Admin only) |
| `/api/pos/checkout` | POST | `{ items: [], total: 0 }` | Process a retail sale |

## 📋 Response Format
**Success (200/201):**
```json
{ "status": "success", "data": { ... } }
```
**Error (400/401/500):**
```json
{ "error": "Clear error message here" }
```
