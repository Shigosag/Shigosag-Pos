# 🚀 Shigosag POS Terminal API v3.0

## Base URL
`https://api.shigosag.com/api`

## Authentication
Bearer Token required for all protected routes.
`Authorization: Bearer <JWT_TOKEN>`

## 🔐 Authentication Endpoints
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Create institution account |
| `POST` | `/auth/login` | Session initiation |
| `GET` | `/auth/profile` | Current terminal context |

## 💸 POS Operations (Atomic)
| Method | Route | Payload |
| :--- | :--- | :--- |
| `POST` | `/pos/verify-account` | `{ accountNumber: string }` |
| `POST` | `/pos/process-transfer` | `{ amount, accountNumber, bank }` |
| `POST` | `/pos/checkout` | `{ items: [], total: number }` |

## 📦 Inventory
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/products` | List all SKU with stock levels |
| `POST` | `/products` | Create new SKU (Manager+) |

## Security Features
- **Rate Limiting:** 200 req / 15 mins per IP.
- **Serializable Isolation:** Prevents double-spending on transfers.
- **Soft Deletes:** `deletedAt` logic on all entities.
