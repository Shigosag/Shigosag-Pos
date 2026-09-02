# Shigosag POS API Documentation

## Authentication
All requests except `/auth` require a `Bearer <token>` header.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `POST /api/auth/login` | POST | Login and receive JWT |
| `POST /api/auth/register` | POST | Create new staff account |

## POS Operations (Nigerian Standard)
| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/api/pos/verify-account` | POST | `{ accountNumber, bankCode }` | Verify NUBAN |
| `/api/pos/process-transfer` | POST | `{ amount, bank, accountName }` | Log Transfer |

## Inventory
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/products` | GET | List products (Paginated) |
| `POST /api/products` | POST | Create product (Admin only) |
