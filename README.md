# BUYVERSE

BUYVERSE is a modern multi-category marketplace built for a wide range of products, from electronics and fashion to home, beauty, wellness, and everyday essentials. It includes a React frontend, Express REST APIs, and a database-ready schema for Supabase PostgreSQL.

## Features

- Premium storefront UI with responsive product catalog
- Product search, filters, sorting, and detail pages
- Customer auth with JWT and bcrypt password hashing
- Cart, wishlist, and order tracking flows
- PayPal Sandbox-ready payment flow
- Admin dashboard for products, orders, and customers
- MarketTwin integration endpoints with API key protection
- Database schema and seed data ready for Supabase

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: Node.js + Express + REST APIs
- Database: Supabase PostgreSQL
- Authentication: JWT + bcrypt
- Payments: PayPal Sandbox API

## Project Structure

- `frontend/` - Vite React storefront
- `backend/` - Express API server
- `backend/config/` - environment and DB config
- `backend/controllers/` - request handlers
- `backend/routes/` - route modules
- `backend/services/` - business logic
- `backend/data/` - sample product dataset
- `backend/sql/` - schema file
- `backend/scripts/` - database seeding helpers

## Prerequisites

- Node.js 18+
- npm
- Supabase account (optional for database integration)
- PayPal Sandbox credentials (optional for payment testing)

## Installation

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
node server.js
```

## Supabase Setup

1. Create a PostgreSQL project in Supabase.
2. Use the SQL in `backend/sql/schema.sql` to initialize tables.
3. Add your values to `backend/.env`.
4. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## PayPal Sandbox Setup

1. Create a PayPal developer account.
2. Set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in `backend/.env`.
3. Use sandbox mode for testing only.

## Local Run

Frontend: http://localhost:5173
Backend: http://localhost:5001
Health check: http://localhost:5001/api/health

## API Documentation

- `GET /api/products` - list products
- `GET /api/products/:productId` - product detail
- `GET /api/products/search?q=keyword` - search products
- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login user
- `POST /api/markettwin/search` - MarketTwin product search
- `GET /api/markettwin/store` - store metadata
- `GET /api/markettwin/inventory` - inventory summary
- `POST /api/markettwin/orders` - create external order

## Deployment Notes

- Frontend can be deployed on Render static site.
- Backend can run on Render web service.
- Database is designed for Supabase Free tier.
- Use environment variables for AI and payment credentials.
- Free hosting may auto-sleep; expect cold starts or temporary delays.

## Troubleshooting

- Ensure backend environment variables are populated.
- Verify CORS and port settings if frontend cannot connect.
- Use correct Bearer tokens for protected routes.
- Keep PayPal sandbox credentials out of source control.

## Important Notes

This project includes a functional storefront and API scaffold with realistic sample data. Supabase and PayPal keys are configuration-dependent and must be configured separately for full live integration.
