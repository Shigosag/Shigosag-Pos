# 🛡️ Shigosag POS Terminal API v4.0

## Authentication
All protected routes require a `Bearer` token.
`Authorization: Bearer <JWT_SECRET>`

## Endpoints

### 💰 POS Operations
| Method | Route | Payload | Isolation |
| :--- | :--- | :--- | :--- |
| `POST` | `/pos/checkout` | `{ items: CartItem[], total: number }` | Serializable |
| `POST` | `/pos/transfer` | `{ amount, bank, accountNumber }` | Serializable |
| `POST` | `/pos/verify-account` | `{ accountNumber }` | Mock/Read |

### 📦 Inventory Management
| Method | Route | Permission |
| :--- | :--- | :--- |
| `GET` | `/products` | PUBLIC |
| `POST` | `/products` | MANAGER+ |
| `PATCH` | `/products/:id` | MANAGER+ |

## Error Codes
- `400`: Validation Error (Zod)
- `401`: Unauthorized / Session Expired
- `403`: Insufficient Permission (RBAC)
- `409`: Conflict (Transaction Contention - Retry required)
