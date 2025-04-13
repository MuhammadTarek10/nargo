# 🛍️ Nargo

**Nargo** is a full-featured open-source e-commerce API built with [NestJS](https://nestjs.com/), [PostgreSQL](https://www.postgresql.org/), and [Redis](https://redis.io/). It supports user authentication, product management, cart operations, orders, and more – all with clean architecture and modular structure.

## 🚀 Features

- 🔐 **Authentication** with JWT (Admin & Customer roles)
- 🛒 **Cart Management**: Add/remove products to/from cart
- 📦 **Product Management**: List, filter, create, update, delete
- 🧾 **Order Management**: Create and view orders
- 👤 **User Profiles**
- 📬 **Email Integration** using Nodemailer
- ⚡ **Request Throttling** with global guards
- 💾 **Caching** using Redis
- 🧰 **Centralized Error Handling**
- 📘 **Full REST API** with structured routing
- 🐳 **Dockerized** setup with PostgreSQL & Redis
- 🧱 Clean, modular, and scalable architecture

> ✨ _Admin Dashboard and Real-Time Notifications are planned for future releases!_

## 🧱 Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache**: Redis
- **Auth**: JWT
- **Email**: Nodemailer
- **Containerization**: Docker, Docker Compose

## ⚙️ Getting Started

### 1. Clone the project

```bash
git clone https://github.com/your-username/nargo.git
cd nargo
```

### 2. Create .env file

Copy .env.example and fill in your environment variables:

```bash
cp .env.example .env
```

### 3. Start the services

```bash
docker compose up -d
```

This will start the NestJS app, PostgreSQL, and Redis containers.

```bash
npx prisma migrate dev
npx prisma generate
```

## 🔐 Roles

- **Admin**: Can manage all resources (products, users, orders, etc.)
- **Customer**: Can browse products, manage cart, and place orders

## 📑 API Endpoints

### 🧾 Auth

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Login and get token |

### 👤 User

| Method | Endpoint    | Description      |
| ------ | ----------- | ---------------- |
| GET    | `/users/me` | Get current user |

### 📦 Products

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| GET    | `/products`     | List all products      |
| GET    | `/products/:id` | Get product by ID      |
| POST   | `/products`     | Create product (Admin) |
| PUT    | `/products/:id` | Update product (Admin) |
| DELETE | `/products/:id` | Delete product (Admin) |

### 🛒 Cart

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/carts`            | View user’s cart         |
| POST   | `/carts/products`            | Add product to cart      |
| DELETE | `/carts/product/:id` | Remove product from cart |

### 📬 Orders

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/orders`           | View user orders        |
| POST   | `/orders`           | Create new order        |
| GET    | `/orders/:id`       | View specific order     |
| GET    | `/orders/all`     | View all orders (Admin) |
| DELETE | `/orders/:id` | Delete order (Admin)    |

---
