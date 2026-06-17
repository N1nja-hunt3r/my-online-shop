# ShopEase - Online Shop

Full-stack e-commerce app with a **React (Vite) frontend**, **PHP backend API**, and **MySQL database**.

## Project Structure

```
online-shop/
├── frontend/          # React + Vite (runs on :5173)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/          # useAuth, useCart, useWishlist (localStorage)
│   │   ├── data/           # Static product data
│   │   └── styles/
│   ├── public/
│   └── dist/
├── backend/           # PHP REST API
│   ├── api/
│   │   ├── products.php
│   │   ├── cart.php
│   │   ├── login.php
│   │   └── register.php
│   ├── config/
│   │   └── db.php          # MySQL connection config
│   ├── includes/
│   │   └── helpers.php     # CORS, JSON helpers
│   └── index.php
└── SQL/
    └── ecommerce.sql       # Database schema + sample data
```

## Quick Start

### Frontend (standalone - no backend needed)

```bash
cd frontend
npm install
npm run dev
```

The app runs on **http://localhost:5173**. Auth, cart, and wishlist use localStorage; product data is static.

### Backend API

```bash
# 1. Import the database
mysql -u root < SQL/ecommerce.sql

# 2. Update credentials in backend/config/db.php

# 3. Serve
php -S localhost:8000 -t backend
```

CORS allows requests from `http://localhost:5173`.

### Database

- Name: `shopease`
- Tables: `users`, `products`, `orders`, `order_items`, `cart`, `wishlist`, `messages`, `newsletter`
- Includes sample products (laptops, mobiles, refrigerators, washing machines, ACs)

## Tech Stack

| Layer    | Tech                  |
|----------|-----------------------|
| Frontend | React 19, Vite 8      |
| Backend  | PHP 8+ (vanilla)      |
| Database | MySQL                 |
