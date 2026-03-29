# Product Requirements Document: Scanty's Closet E-commerce Platform

## Brand Identity
*   **Brand Name**: Scanty's Closet
*   **Motto**: "Punctuality is the soul of business"
*   **Primary Brand Colors**: Red, Green, Silver/White, Dark Grey (for accents/backgrounds)
*   **Contact Number**: 0245060754
*   **Social Media Handles**: Scanty's Closet (Facebook, Instagram)


## 1. Introduction

### 1.1 Purpose
This Product Requirements Document (PRD) outlines the features, functionalities, and technical specifications for a new e-commerce platform dedicated to selling sneakers. The goal is to create a modern, user-friendly online store for customers and an efficient, intuitive administration dashboard for the client.

### 1.2 Scope
The project encompasses the development of a customer-facing e-commerce website and a backend administration dashboard. It will focus exclusively on selling sneakers, providing a curated and specialized shopping experience.

### 1.3 Target Audience
*   **Customers**: Sneaker enthusiasts, casual buyers, and individuals seeking specific footwear, primarily online shoppers aged 16-45.
*   **Client/Admin**: The store owner and their staff responsible for managing products, orders, and customer inquiries.

## 2. Customer-Facing Website

### 2.1 Vision & Design Principles
The customer-facing website for **Scanty's Closet** will embody a **classic yet modern design**, prioritizing aesthetics, ease of navigation, and a seamless shopping experience. The design will be clean, visually appealing, and responsive across all devices, with a strong emphasis on high-quality product imagery. The visual design will incorporate the brand's primary colors: **Red**, **Green**, and **Silver/White**, with **Dark Grey** used for accents and backgrounds, creating a distinctive and memorable brand presence.

### 2.2 Key Features & User Stories

#### 2.2.1 Product Catalog & Browsing
*   **As a customer, I want to browse a wide selection of sneakers**, so I can discover new products.
*   **As a customer, I want to filter products by brand, size, color, price range, and category (e.g., running, lifestyle)**, so I can quickly find what I'm looking for.
*   **As a customer, I want to sort products by relevance, price (low to high/high to low), and new arrivals**, so I can organize my search results.

#### 2.2.2 Product Detail Page
*   **As a customer, I want to view high-resolution images of sneakers from multiple angles with zoom functionality**, so I can inspect product details thoroughly.
*   **As a customer, I want to read detailed product descriptions, including materials, features, and sizing information**, so I can make informed purchasing decisions.
*   **As a customer, I want to see available sizes and their stock status**, so I know if my size is in stock.
*   **As a customer, I want to be notified when an out-of-stock item or size becomes available**, so I don't miss out on desired products.
*   **As a customer, I want to read and write product reviews with optional photo uploads**, so I can share my experience and benefit from others' feedback.
*   **As a customer, I want to see related or recommended products**, so I can discover complementary items.

#### 2.2.3 Shopping Cart
*   **As a customer, I want to add/remove items from my cart and adjust quantities**, so I can manage my selections before checkout.
*   **As a customer, I want to see a summary of my cart, including item prices, subtotals, and estimated shipping costs**, so I can review my order.

#### 2.2.4 Checkout Process
*   **As a customer, I want a streamlined, secure, and intuitive checkout process**, so I can complete my purchase quickly and confidently.
*   **As a customer, I want to enter my shipping and billing information easily**, with options for saving details for future purchases.
*   **As a customer, I want to select from various secure payment methods (e.g., credit card, PayPal)**, so I can use my preferred payment option.
*   **As a customer, I want to receive order confirmation via email after a successful purchase**, so I have a record of my order.

#### 2.2.5 User Accounts
*   **As a customer, I want to create and manage a personal account**, so I can track my orders, save shipping addresses, and view my purchase history.
*   **As a customer, I want to reset my password if I forget it**, so I can regain access to my account.

#### 2.2.6 Search Functionality
*   **As a customer, I want to search for sneakers by keywords (e.g., brand, model, color)**, so I can quickly find specific products.

## 3. Admin Dashboard

### 3.1 Vision & Design Principles
The admin dashboard will feature a **simple, modern, and intuitive design**, focusing on efficiency and ease of use. It will provide the client with comprehensive tools to manage the e-commerce operations effectively.

### 3.2 Key Features & User Stories

#### 3.2.1 Product Management
*   **As an admin, I want to add new sneaker products, including name, description, brand, price, multiple images, sizes, and initial stock levels**, so I can expand the product catalog.
*   **As an admin, I want to edit existing product details, images, and pricing**, so I can keep product information up-to-date.
*   **As an admin, I want to activate or deactivate products**, so I can control product visibility on the website.
*   **As an admin, I want to manage product categories and attributes (e.g., color, material)**, so I can organize the catalog effectively.

#### 3.2.2 Order Management
*   **As an admin, I want to view all customer orders with details such as customer information, ordered items, total price, and shipping address**, so I can process them efficiently.
*   **As an admin, I want to update the status of an order (e.g., Pending, Processing, Shipped, Delivered, Cancelled)**, so customers are informed of their order's progress.
*   **As an admin, I want to generate shipping labels and invoices**, so I can fulfill orders professionally.

#### 3.2.3 Inventory Management
*   **As an admin, I want to view current stock levels for all products and their variants**, so I can monitor inventory.
*   **As an admin, I want to update stock levels manually or in bulk**, so I can manage inventory efficiently.
*   **As an admin, I want to receive alerts for low stock items**, so I can reorder products in a timely manner.

#### 3.2.4 Customer Management
*   **As an admin, I want to view a list of registered customers and their basic information**, so I can understand my customer base.
*   **As an admin, I want to view a customer's order history**, so I can provide better support.

#### 3.2.5 Analytics & Reporting
*   **As an admin, I want to view key sales metrics (e.g., total sales, top-selling products, average order value)**, so I can understand business performance.
*   **As an admin, I want to see reports on inventory levels and popular sizes**, so I can make informed purchasing decisions.

## 4. Technical Requirements

### 4.1 Frontend
*   **Technology**: React.js
*   **Styling**: Tailwind CSS (for modern, utility-first styling and rapid development)
*   **State Management**: React Context API or Redux Toolkit (depending on complexity)
*   **Routing**: React Router

### 4.2 Backend
*   **Technology**: Node.js (with Express.js framework for RESTful API development)
*   **Authentication**: Passport.js or NextAuth.js (for secure user authentication and authorization)
*   **API**: RESTful API for communication between frontend and database.

### 4.3 Database
*   **Type**: PostgreSQL
*   **ORM**: Prisma or Drizzle ORM (for type-safe database interactions and schema management)

### 4.4 Hosting & Deployment
*   **Frontend**: Vercel or Netlify (for static site hosting and continuous deployment)
*   **Backend**: Render, AWS EC2, or DigitalOcean (for Node.js application hosting)
*   **Database**: Managed PostgreSQL service (e.g., AWS RDS, DigitalOcean Managed Databases)

### 4.5 Storage
*   **Asset Storage**: AWS S3 or Cloudinary (for storing high-resolution product images and other media files).

## 5. High-Level Database Schema

Below is a high-level overview of the proposed database schema. Detailed schema design will be part of the technical design phase.

| Table Name   | Key Fields                                                              | Relationships                                       |
| :----------- | :---------------------------------------------------------------------- | :-------------------------------------------------- |
| `users`      | `id` (PK), `email` (Unique), `password_hash`, `first_name`, `last_name`, `address`, `phone_number`, `created_at`, `updated_at` | One-to-many with `orders`                           |
| `products`   | `id` (PK), `name`, `description`, `brand`, `price`, `category_id`, `created_at`, `updated_at` | One-to-many with `product_variants`, `order_items`  |
| `categories` | `id` (PK), `name`                                                       | One-to-many with `products`                         |
| `product_variants` | `id` (PK), `product_id` (FK), `size`, `color`, `sku`, `stock_quantity`, `image_urls` (Array/JSONB) | Many-to-one with `products`                         |
| `orders`     | `id` (PK), `user_id` (FK), `order_date`, `total_amount`, `status`, `shipping_address`, `billing_address` | Many-to-one with `users`, One-to-many with `order_items` |
| `order_items`| `id` (PK), `order_id` (FK), `product_variant_id` (FK), `quantity`, `price_at_purchase` | Many-to-one with `orders`, Many-to-one with `product_variants` |
| `reviews`    | `id` (PK), `product_id` (FK), `user_id` (FK), `rating`, `comment`, `image_urls` (Array/JSONB), `created_at` | Many-to-one with `products`, Many-to-one with `users` |

## 6. Future Considerations & Roadmap (Phase 2)

*   **Augmented Reality (AR) / Virtual Try-on**: Integrate AR features to allow customers to virtually try on sneakers.
*   **Personalized Recommendations**: Implement AI-powered recommendation engines based on browsing history and purchase patterns.
*   **Wishlist Functionality**: Allow users to save products for later purchase.
*   **Advanced Analytics**: More in-depth sales and customer behavior analytics for the admin dashboard.
*   **Marketing & Promotions**: Features for creating and managing discounts, coupons, and promotional campaigns.

## 7. References

[1] Omnisend. (n.d.). *Footwear ecommerce trends and strategies in 2025 + examples*. Retrieved from [https://www.omnisend.com/blog/footwear-ecommerce/](https://www.omnisend.com/blog/footwear-ecommerce/)
