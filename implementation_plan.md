# Scanty's Closet Implementation Plan

Based on the Product Requirements Document, this plan outlines the technical implementation for developing the **Scanty's Closet** e-commerce platform.

## User Review Required

> [!IMPORTANT]
> Please review the chosen technical stack structure below. The PRD mentions React for frontend and Node.js/Express for backend.
> Do you prefer setting this up as a monorepo (e.g., using Turborepo or simple npm workspaces) to share types/configuration, or as two entirely separate folders (`frontend` and `backend`)?
> The plan assumes we will use two separate folders (`frontend` & `backend`) within the `c:/Dev/WORK/scanty shop` workspace. Let me know if you agree.

## Proposed Architecture

We will structure the project into two main directories:
1. **Frontend**: React.js with Vite, Tailwind CSS, React Router, and a state management solution (Zustand + React Query recommended).
2. **Backend**: Node.js with Express, Prisma ORM, and PostgreSQL.

### 1. Database & Backend Setup
* Initialize Node.js + Express project in `backend/` using TypeScript.
* Set up Prisma ORM and configure the PostgreSQL connection.
* Implement the database schema (Users, Products, Categories, Product Variants, Orders, Order Items, Reviews).
* Set up authentication logic (Passport.js or custom JWT).
* Implement RESTful API endpoints for:
    * Users / Authentication
    * Products (CRUD + Filtering/Search)
    * Orders (Checkout + Management)
    * Admin Dashboard Analytics
* Set up AWS S3 / Cloudinary integration for handling high-resolution product image uploads.

### 2. Frontend Setup (Customer Storefront & Admin Dashboard)
* Initialize Vite + React + TypeScript project in `frontend/`.
* Configure Tailwind CSS and set up the brand colors (Red, Green, Silver/White, Dark Grey) as global theme variables.
* Set up routing with React Router (Public routes for the storefront, Protected routes for Admin and User Dashboard).
* Build shared reusable components (Buttons, Inputs, Modals, Product Cards).
* **Customer Storefront:**
    * Home Page (Hero section, New Arrivals, Categories).
    * Product Browsing (Robust filtering, sorting, pagination).
    * Product Detail Page (Image gallery with zoom, reviews, variant/size selection).
    * Cart & Checkout Flow (Cart summary, Shipping address collection, Payment integration).
    * User Account Dashboard (Order history, profile settings).
* **Admin Dashboard:**
    * Layout (Sidebar navigation, Header).
    * Analytics Overview (Sales metrics, Orders, Stock levels).
    * Product Management (Add/Edit products, upload images, manage sizes & variants).
    * Order Management (View full order details, update lifecycle statuses).
    * Inventory Alerts (Low stock visual indicators).

## Open Questions

> [!WARNING]
> 1. **Payment Gateway**: Do you have a preferred payment gateway (Stripe, PayPal, Paystack, etc.) for the checkout process?
> 2. **State Management**: The PRD mentions Context API or Redux Toolkit. Would you be open to using **Zustand + React Query**? It's a modern, highly efficient standard for React apps that reduces boilerplate compared to Redux, while still meeting all enterprise needs.
> 3. **Authentication Framework**: Do you prefer sticking to **Passport.js** as mentioned in the PRD, or would you be open to an alternative like **NextAuth (now Auth.js)** or standard custom secure JWTs?

## Phased Progress

- `[x]` Phase 1: Database & Backend Setup
- `[x]` Phase 2: User Authentication & Profile
- `[x]` Phase 3: Product Catalog & Basic Browsing
- `[x]` Phase 4: Shopping Cart & Checkout (Basic)
- `[x]` Phase 5: Enhanced UX & Styling
- `[x]` **Phase 6: Admin Dashboard Implementation [COMPLETED]**
    - `[x]` Admin Layout & Protected Routing
    - `[x]` Dashboard Analytics (Revenue, Orders, Products)
    - `[x]` Product Management (CRUD + Variants)
    - `[x]` Inventory Tracking & Quick Stock Updates
    - `[x]` Order Management & Status Workflow
- `[ ]` Phase 7: Order Tracking & User Dashboard updates
- `[ ]` Phase 8: Final Testing & Performance Optimization

## Verification Plan

### Automated Tests
- **Backend**: Implement integration tests (Jest + Supertest) for critical API endpoints and authentication flows.
- **Frontend**: Specific unit tests for critical functions (e.g., cart total aggregations) using Vitest.

### Manual Verification
- Verify successful sign-up, login, and access-control for both User and Admin roles.
- Test the end-to-end customer purchasing flow: Add product to cart -> Checkout -> View order created in Admin Dashboard.
- Verify product creation and successful image uploading in the Admin Dashboard.
