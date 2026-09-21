# ☕ CoffeeShop – Full Stack Coffee Ordering Platform

🌐 **Live Demo:** https://coffee-shop-due2.vercel.app/

![React](https://img.shields.io/badge/Frontend-React-blue)
![Vite](https://img.shields.io/badge/Build-Vite-purple)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express.js-lightgrey)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Neon](https://img.shields.io/badge/Database-Neon-brightgreen)
![Clerk](https://img.shields.io/badge/Auth-Clerk-orange)
![Stripe](https://img.shields.io/badge/Payments-Stripe-purple)
![ImageKit](https://img.shields.io/badge/Images-ImageKit-red)
![Brevo](https://img.shields.io/badge/Email-Brevo-blue)
![Tailwind](https://img.shields.io/badge/UI-Tailwind_CSS-06B6D4)

CoffeeShop is a **full-stack coffee ordering and management platform** built using the **PERN stack**.

Customers can browse products, manage their cart, place orders, make secure online payments using Stripe, and receive automatic email notifications about their orders.

Admins can manage products, control product availability, monitor orders, view dashboard statistics, and update order statuses.

The application is deployed and uses multiple production services including **Clerk, Neon PostgreSQL, Stripe, ImageKit, Brevo, and Vercel**.

---

# ✨ Features

## 👤 Authentication & Authorization

- Secure authentication using **Clerk**
- User signup and login
- Protected frontend routes
- Protected backend routes
- Admin-only routes
- Role-based authorization using Clerk metadata
- Automatic synchronization of authenticated users with PostgreSQL

---

## ☕ Product Management

### Customer

- Browse coffee shop menu
- View product images
- View product descriptions
- View product prices
- View product categories
- Only available products are shown to customers

### Admin

- Add new products
- Upload product images
- Edit existing products
- Update product name
- Update product description
- Update product price
- Change product category
- Replace product image
- Mark products as Available
- Mark products as Not Available

Products are not physically deleted from the database, which preserves historical references from previous orders.

---

## 🛒 Shopping Cart

- Add products to cart
- Increase quantity
- Decrease quantity
- Remove products from cart
- Persistent cart using PostgreSQL
- Cart count displayed in navbar
- Toast notifications
- Cart automatically cleared after successful payment

### Cart Architecture

```text
Customer
   ↓
Add Product
   ↓
Cart Context
   ↓
Cart API
   ↓
PostgreSQL
   ↓
carts
   ↓
cart_items
```

---

## 💳 Online Payments

Payments are handled using **Stripe Checkout**.

### Payment Features

- Stripe Checkout integration
- INR payments
- Secure payment processing
- Stripe Checkout Sessions
- Stripe metadata
- Stripe webhook verification
- Automatic order status update
- Automatic cart clearing after successful payment
- Payment confirmation email

### Stripe Payment Flow

```text
Customer
    ↓
Cart
    ↓
Checkout
    ↓
Create Pending Order
    ↓
Create Stripe Checkout Session
    ↓
Redirect Customer to Stripe
    ↓
Customer Completes Payment
    ↓
Stripe
    ↓
Stripe Webhook
    ↓
checkout.session.completed
    ↓
Find Order using Stripe Metadata
    ↓
Order Status → PAID
    ↓
Send Brevo Email
    ↓
Clear Cart
```

---

## 📦 Order Management

### Customer

Customers can:

- View previous orders
- View individual order details
- View order status
- View total order amount
- View delivery information
- View pickup information
- Track their order progress

### Admin

Admins can:

- View all customer orders
- View customer name
- View customer email
- View order amount
- View delivery method
- View delivery information
- Update order status
- Manage pickup orders
- Manage delivery orders

---

## 🔄 Order Status Flow

### Pickup

```text
PAID
 ↓
PREPARING
 ↓
READY
 ↓
DELIVERED
```

### Delivery

```text
PAID
 ↓
PREPARING
 ↓
READY
 ↓
OUT_FOR_DELIVERY
 ↓
DELIVERED
```

Orders can also be cancelled where the business rules allow it.

The backend validates status transitions instead of allowing arbitrary status changes.

---

## 📧 Email Notification System

CoffeeShop uses **Brevo** for transactional email notifications.

Customers automatically receive emails when important order events occur.

### Email Notifications

| Order Status     | Customer Notification    |
| ---------------- | ------------------------ |
| Paid             | Payment confirmed        |
| Preparing        | Order is being prepared  |
| Ready            | Order is ready           |
| Out for Delivery | Order is on the way      |
| Delivered        | Order delivered          |
| Cancelled        | Order cancelled          |

### 📧 Email Architecture

```text
                    ┌──────────────────┐
                    │     Customer     │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ Stripe Checkout  │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ Stripe Webhook   │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ Express Backend  │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ PostgreSQL       │
                    │ Order → PAID     │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │      Brevo       │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ Customer Email   │
                    └──────────────────┘
```

Admin status changes also trigger Brevo notifications:

```text
Admin
  ↓
Change Order Status
  ↓
Express API
  ↓
PostgreSQL
  ↓
Brevo
  ↓
Customer Email
```

---

## 🖼️ Image Management

Product images are stored using **ImageKit**.

### Upload Flow

```text
Admin
  ↓
Select Product Image
  ↓
React FormData
  ↓
Express + Multer
  ↓
Memory Storage
  ↓
ImageKit
  ↓
Image URL
  ↓
PostgreSQL
```

The application uses memory storage instead of writing files to the server filesystem, making the upload process compatible with serverless deployment environments such as Vercel.

---

## 📊 Admin Dashboard

The admin dashboard provides an overview of the shop.

### Dashboard Statistics

- Total Orders
- Total Revenue
- Pending Orders
- Total Products

### Admin Navigation

```text
Admin Dashboard
       │
       ├── Dashboard
       │
       ├── Manage Products
       │      ├── Add Product
       │      ├── Edit Product
       │      └── Availability
       │
       └── Manage Orders
              ├── View Orders
              └── Update Status
```

---

## 🚚 Delivery & Pickup

Customers can choose between:

### Pickup

The customer collects the order from the coffee shop.

### Delivery

The customer provides:

- Full Name
- Phone Number
- Address
- City
- State
- PIN Code

The backend stores the delivery information with the order.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      Customer       │
                         │   React Frontend    │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / REST
                                    ↓
                         ┌─────────────────────┐
                         │   Express Backend   │
                         │      Node.js        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ↓                     ↓                     ↓
     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
     │ Neon PostgreSQL│    │     Clerk      │    │    ImageKit    │
     │    Database    │    │ Authentication │    │     Images     │
     └────────────────┘    └────────────────┘    └────────────────┘
              │
              │
              ↓
     ┌────────────────┐
     │     Stripe     │
     │    Payments    │
     └───────┬────────┘
             │
             ↓
     ┌────────────────┐
     │ Stripe Webhook │
     └───────┬────────┘
             │
             ↓
     ┌────────────────┐
     │     Brevo      │
     │ Email Service  │
     └────────────────┘
```

---

# 🔄 Complete Application Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         COFFEESHOP                            │
└───────────────────────────────────────────────────────────────┘

                         FRONTEND
                            │
                            │
                  React + Vite + Tailwind
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ↓              ↓              ↓
          Clerk          Cart Context    React Router
             │              │              │
             └──────────────┼──────────────┘
                            │
                            ↓
                       REST API
                            │
                            ↓
                         BACKEND
                            │
                   Node.js + Express
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ↓                    ↓                    ↓
 Controllers           Middleware             Routes
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                            ↓
                     Neon PostgreSQL
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ↓                 ↓                 ↓
       Products           Carts             Orders
          │                                   │
          │                                   ↓
          │                              Order Items
          │
          ↓
       Categories

External Services:

       Clerk
         │
         └── Authentication

       ImageKit
         │
         └── Product Images

       Stripe
         │
         ├── Checkout
         └── Webhooks

       Brevo
         │
         └── Email Notifications
```

---

# 🗄️ Database Architecture

CoffeeShop uses **Neon PostgreSQL** with relational tables.

### Main Tables

```text
users
categories
products
carts
cart_items
orders
order_items
```

### Database Relationship

```text
                    ┌──────────────┐
                    │    users     │
                    └──────┬───────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ↓                           ↓
        ┌──────────┐                ┌──────────┐
        │  carts   │                │  orders  │
        └────┬─────┘                └────┬─────┘
             │                           │
             ↓                           ↓
      ┌─────────────┐             ┌─────────────┐
      │ cart_items  │             │ order_items │
      └──────┬──────┘             └──────┬──────┘
             │                           │
             │                           │
             ↓                           ↓
        ┌──────────┐               ┌──────────┐
        │ products │◄──────────────┤ products │
        └────┬─────┘               └──────────┘
             │
             ↓
       ┌────────────┐
       │ categories │
       └────────────┘
```

---

# 🧩 Database Tables

### Users

Stores application users connected to Clerk.

```text
users
├── id
├── clerk_user_id
├── name
└── email
```

### Categories

```text
categories
├── id
├── name
└── created_at
```

### Products

```text
products
├── id
├── name
├── description
├── price
├── image_url
├── category_id
├── is_available
└── created_at
```

### Carts

```text
carts
├── id
├── user_id
├── created_at
└── updated_at
```

### Cart Items

```text
cart_items
├── id
├── cart_id
├── product_id
└── quantity
```

### Orders

```text
orders
├── id
├── user_id
├── total_amount
├── status
├── delivery_method
├── delivery_full_name
├── delivery_phone
├── delivery_address
├── delivery_city
├── delivery_state
├── delivery_pin_code
├── stripe_session_id
└── created_at
```

### Order Items

```text
order_items
├── id
├── order_id
├── product_id
├── quantity
└── price
```

The `price` field stores the price at the time of purchase, preserving historical order information even if the product price changes later.

---

# 🔐 Security Architecture

The application uses multiple layers of security.

```text
Customer Request
       ↓
Clerk Authentication
       ↓
Backend Auth Middleware
       ↓
Admin Middleware
       ↓
Controller
       ↓
Database
```

### Security Features

- Clerk authentication
- Protected routes
- Admin authorization
- Backend role verification
- Stripe webhook signature verification
- Environment variables for secrets
- Brevo API key stored only on backend
- Stripe secret key stored only on backend
- Clerk secret key stored only on backend
- ImageKit private key stored only on backend
- Database credentials stored in environment variables

---

# 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- React Hot Toast
- Fetch API
- Clerk React

### Backend

- Node.js
- Express.js
- ES Modules
- REST APIs
- Clerk Express
- Multer

### Database

- PostgreSQL
- Neon PostgreSQL
- @neondatabase/serverless
- Raw SQL

### Authentication

- Clerk

### Payments

- Stripe
- Stripe Checkout
- Stripe Webhooks

### Image Upload

- ImageKit

### Email Notifications

- Brevo

### Deployment

- Vercel

---

# 📂 Project Structure

```text
CoffeeShop
│
├── client
│   ├── src
│   │   │
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminOrders.jsx
│   │   │
│   │   ├── context
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── services
│   │   │   └── ...
│   │   │
│   │   ├── layouts
│   │   │   └── MainLayout.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server
│   ├── src
│   │   │
│   │   ├── config
│   │   │   └── imagekit.js
│   │   │
│   │   ├── controllers
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── adminOrderController.js
│   │   │   └── adminDashboardController.js
│   │   │
│   │   ├── middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── adminMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   │
│   │   ├── routes
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── adminOrderRoutes.js
│   │   │   └── adminDashboardRoutes.js
│   │   │
│   │   ├── utils
│   │   │   ├── imagekitUpload.js
│   │   │   └── sendOrderStatusEmail.js
│   │   │
│   │   ├── db.js
│   │   └── server.js
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚡ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd coffee-shop
```

### 2. Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

Open another terminal:

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

### Server `.env`

```env
DATABASE_URL=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=

CLIENT_URL=
```

### Client `.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_URL=
```

⚠️ **Never commit `.env` files or secret API keys to GitHub.**

---

# ▶️ Running the Project

### Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

---

# 🌐 Production Deployment

The project is deployed using **Vercel**.

Production architecture:

```text
                         VERCEL
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ↓                           ↓
      React Frontend              Express Backend
             │                           │
             │                           │
             │              ┌────────────┼────────────┐
             │              │            │            │
             │              ↓            ↓            ↓
             │           Neon         Clerk        ImageKit
             │
             │
             └───────────────────────────────────────┐
                                                     │
                                                     ↓
                                                   Stripe
                                                     │
                                                     ↓
                                                Webhook
                                                     │
                                                     ↓
                                                   Brevo
                                                     │
                                                     ↓
                                                Customer
```

---

# 🔔 Stripe Webhook

The backend exposes a Stripe webhook endpoint:

```text
/api/payments/webhook
```

Stripe sends payment events to this endpoint.

The webhook:

1. Verifies Stripe's signature
2. Reads the order ID from metadata
3. Updates the order status
4. Sends payment confirmation email
5. Clears the customer's cart

---

# 📧 Brevo Email System

The email service is implemented as a reusable backend utility:

```text
server/src/utils/sendOrderStatusEmail.js
```

The controller provides:

- `email`
- `customerName`
- `orderId`
- `status`

The utility generates the appropriate email content and sends it through Brevo.

---

# 🔄 Complete Customer Journey

```text
                    CUSTOMER
                       │
                       ↓
                Clerk Sign In
                       │
                       ↓
                  Browse Menu
                       │
                       ↓
                  Add to Cart
                       │
                       ↓
                Review Cart
                       │
                       ↓
                   Checkout
                       │
                       ↓
               Stripe Payment
                       │
                       ↓
               Payment Success
                       │
                       ↓
             Stripe Webhook
                       │
                       ↓
                Order = PAID
                       │
                       ├──────────────→ 📧 Confirmation Email
                       │
                       ↓
                 Cart Cleared
                       │
                       ↓
                  Admin View
                       │
                       ↓
                  Preparing
                       │
                       ├──────────────→ 📧 Email
                       │
                       ↓
                    Ready
                       │
                       ├──────────────→ 📧 Email
                       │
                       ↓
              Out for Delivery
                       │
                       ├──────────────→ 📧 Email
                       │
                       ↓
                  Delivered
                       │
                       └──────────────→ 📧 Email
```

---

# 👨‍💼 Complete Admin Journey

```text
                      ADMIN
                        │
                        ↓
                   Admin Login
                        │
                        ↓
                Admin Dashboard
                        │
           ┌────────────┴────────────┐
           │                         │
           ↓                         ↓
     Manage Products            Manage Orders
           │                         │
     ┌─────┼─────┐                   │
     │     │     │                   ↓
     ↓     ↓     ↓              View Orders
    Add   Edit  Availability        │
                                     ↓
                              Update Status
                                     │
                                     ↓
                                  Brevo
                                     │
                                     ↓
                              Customer Email
```

---

# 🎯 Project Highlights

This project demonstrates practical full-stack engineering concepts:

- Full-stack PERN architecture
- REST API development
- React component architecture
- PostgreSQL relational database design
- Raw SQL queries
- Authentication
- Role-based authorization
- Admin dashboard
- Product management
- Persistent shopping cart
- Order management
- Payment gateway integration
- Stripe Checkout
- Stripe Webhooks
- Payment confirmation
- Image upload and cloud storage
- Email automation
- Responsive design
- Production deployment
- Environment variable management
- Serverless-compatible file uploads
- Order state management
- Customer notification system

---

# 💡 Engineering Decisions

### Why Clerk?

Clerk handles authentication and user identity securely, allowing the backend to focus on application-level authorization and business logic.

### Why Neon PostgreSQL?

The application requires relational data such as:

`Users → Orders → Order Items → Products → Categories`

PostgreSQL is well suited for these relationships.

### Why Stripe?

Stripe Checkout provides a secure hosted payment experience and webhook-based payment confirmation.

### Why ImageKit?

Product images are stored externally instead of relying on the server filesystem, making the application more suitable for serverless deployment.

### Why Brevo?

Brevo provides transactional email delivery for customer order notifications.

---

# 🚀 Future Improvements

The current system handles the core ordering and management workflow.

Possible future improvements:

- Database transactions and rollback handling
- Inventory and stock management
- Coupon and discount system
- Sales analytics
- Invoice generation
- Refund management
- Order cancellation workflow
- Staff accounts
- Advanced admin roles
- Kitchen display system
- Order printing
- Delivery partner integration
- Rate limiting
- Automated testing
- Error monitoring
- Advanced production security
- Customer reviews and ratings

---

# 📈 Learning Outcomes

Through this project, I worked with:

```text
React
   ↓
REST APIs
   ↓
Node.js + Express
   ↓
PostgreSQL
   ↓
Authentication
   ↓
Authorization
   ↓
Payments
   ↓
Webhooks
   ↓
Cloud Storage
   ↓
Email Automation
   ↓
Production Deployment
```

The project helped me understand how different services work together to build a real-world full-stack application.

---

# 👨‍💻 Author

**Kundan Kumar Dubey**

GitHub: https://github.com/kundan-kumar07
