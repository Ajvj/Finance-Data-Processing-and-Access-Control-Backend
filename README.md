# Finance Data Processing and Access Control Backend

A backend assignment implementation for a finance dashboard system with:
- Role-based access control (viewer, analyst, admin)
- User management
- Financial record CRUD with filters
- Dashboard summary and trend APIs
- Validation and error handling
- Persistent storage using local JSON file (`src/data/store.json`)

## Tech Stack
- Node.js
- Express
- JWT auth
- Zod validation
- JSON file persistence (simple, assignment-friendly)

## Setup
1. Install dependencies:
   - `npm install`
2. Create environment file:
   - Copy `.env.example` to `.env`
3. Start server:
   - `npm run dev` (or `npm start`)

Server runs at `http://localhost:3000`.

## Default Admin
On first run, a default admin user is created automatically:
- Email: value of `DEFAULT_ADMIN_EMAIL`
- Password: value of `DEFAULT_ADMIN_PASSWORD`

## API Overview

### Health
- `GET /health`

### Auth
- `POST /api/auth/login`

Body:
```json
{
  "email": "admin@finance.local",
  "password": "admin123"
}
```

### Users (Admin only)
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`

Create user body:
```json
{
  "name": "Ananya",
  "email": "ananya@example.com",
  "password": "secure123",
  "role": "analyst",
  "status": "active"
}
```

### Financial Records
- `GET /api/records` (viewer, analyst, admin)
- `POST /api/records` (admin only)
- `PATCH /api/records/:id` (admin only)
- `DELETE /api/records/:id` (admin only, soft delete)

Filters for `GET /api/records`:
- `type=income|expense`
- `category=...`
- `startDate=YYYY-MM-DD`
- `endDate=YYYY-MM-DD`

Create record body:
```json
{
  "amount": 1200,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "Monthly salary"
}
```

### Dashboard (viewer, analyst, admin)
- `GET /api/dashboard/summary`
- `GET /api/dashboard/trends?period=monthly`
- `GET /api/dashboard/trends?period=weekly`

## Access Control Matrix
- **Viewer**: read records, read dashboard
- **Analyst**: read records, read dashboard
- **Admin**: full access to users and records + all read APIs

## Validation and Error Handling
- Request body validation via Zod
- Appropriate status codes (`400`, `401`, `403`, `404`, `409`, `500`)
- Consistent JSON error responses

## Assumptions
- Authentication is email/password login with JWT
- Registration is admin-managed (users created by admin)
- Records are soft deleted for safer audit trail
- JSON file persistence is acceptable for assignment/demo usage

## Suggested Improvements
- Move to PostgreSQL/MySQL for production
- Add pagination and search for record list
- Add unit/integration tests
- Add Swagger/OpenAPI docs
- Add refresh tokens and password reset flow
