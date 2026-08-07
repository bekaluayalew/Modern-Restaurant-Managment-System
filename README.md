# Modern Restaurant Management System (MRMS)

A full-stack restaurant/coffee-shop ordering platform. Customers can browse the menu, 
add items to a cart, check out, and track their order. Admins get a protected dashboard 
to view all orders and update their status.

## Tech Stack

**Frontend:** React 19, Vite, React Router, Axios, Recharts, React Icons
**Backend:** Node.js, Express, MongoDB (Mongoose)
**Auth:** JWT + bcrypt password hashing

## Project Structure
├── backend/ # Express API + MongoDB models
│ ├── models/ # Product, User, Order schemas
│ ├── server.js # API routes & entry point
│ ├── seedData.js # Populates the DB with sample products/users
│ └── migrateData.js
└── frontend/ # React + Vite app
└── src/
├── pages/ # Route-level pages
├── components/ # customer/, admin/, common/
├── context/ # Auth + Cart state
└── services/ # API client (axios)

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB database (local or MongoDB Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string

Seed the database with sample products and users:

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:
VITE_API_URL=http://localhost:5000/api

Start the dev server:

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

## Available Scripts

**Backend** (`backend/`)
- `npm run dev` — start the API with nodemon (auto-restart)
- `npm start` — start the API normally
- `npm run seed` — populate the database with sample data
- `npm run migrate` — run data migration script

**Frontend** (`frontend/`)
- `npm run dev` — start the Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Features

- Customer menu browsing with product cards and categories
- Shopping cart with persistent state (localStorage)
- Checkout flow with order confirmation
- User registration and login (JWT-based auth, hashed passwords)
- Admin dashboard (role-protected) to view orders and update order status

## Notes

- Admin access requires a user with `role: 'admin'` in the database — seeding creates one 
  by default (check `backend/seedData.js` for credentials).
- `.env` files are git-ignored and must be created locally per the steps above.