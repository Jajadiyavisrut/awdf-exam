# QuickBite Food Ordering System 🍔🚀

A complete Full-Stack MERN Food Ordering Web Application built for the **ITUE301 Set A Practical Examination** (CSPIT, CHARUSAT · 24/08/2026).

---

## 📖 Project Overview

QuickBite is an intuitive food ordering system featuring a decoupled architecture:
- **Frontend**: React 18, React Router v6, Context API for state management, lazy loading with `React.lazy()` & `Suspense`, dynamic search filtering, and clean modular component design.
- **Backend**: Node.js & Express.js REST API with global request logging, JWT Bearer token authentication guard, Mongoose models with validation & population (`.populate()`), and centralized error handling.
- **Database**: MongoDB with Mongoose ORM.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React, React Router DOM (v6), Context API (`AuthContext`), Vite, Vanilla CSS Design Tokens |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), BcryptJS Password Hashing, CORS, Dotenv |
| **Database** | MongoDB, Mongoose ODM |
| **Architecture** | RESTful APIs, MVC Pattern, Bearer Token Auth, Code-Splitting / Lazy Loading |

---

## 📁 Clean Modular Project Structure

```text
quickbite/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx              # Shared branding header
│   │   │   ├── Navbar.jsx              # Shared navigation with active links & role-based visibility
│   │   │   ├── Footer.jsx              # Shared site footer
│   │   │   ├── RestaurantCard.jsx      # Reusable card with Open Now/Closed badge
│   │   │   ├── ProtectedRoute.jsx      # Auth route guard redirecting unauthenticated users to /
│   │   │   ├── AdminProtectedRoute.jsx # Route guard restricting /admin to admin users
│   │   │   ├── Loading.jsx             # Accessible loading spinner
│   │   │   └── ErrorMessage.jsx        # Alert notification component
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Landing page with viva login & featured spots
│   │   │   ├── RestaurantsPage.jsx     # Restaurant catalog with real-time client search
│   │   │   ├── OrderPage.jsx           # Protected order placement form with multi-dish cart
│   │   │   ├── AdminPanel.jsx          # Lazy-loaded order dashboard with populated relations
│   │   │   ├── LoginPage.jsx           # Dedicated login page with 1-click test fill
│   │   │   └── SignupPage.jsx          # Dedicated signup page with password regex & repeat confirmation
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Context provider managing { customer, token }
│   │   ├── services/
│   │   │   └── api.js                  # Centralized API service with Bearer token injection
│   │   ├── App.jsx                     # Main layout & Route definitions
│   │   ├── main.jsx                    # React root mount
│   │   └── index.css                   # Global responsive CSS styling system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js                       # MongoDB connection logic (MONGO_URI / MONGODB_URI)
│   ├── models/
│   │   ├── Customer.js                 # Customer schema (name, unique email, bcrypt password, role)
│   │   ├── Restaurant.js               # Restaurant schema (name, cuisine, rating, isOpen)
│   │   └── Order.js                    # Order schema with references, items, totalAmount, status enum
│   ├── routes/
│   │   ├── authRoutes.js               # Auth routes (/api/v1/auth/login, register, me)
│   │   ├── restaurantRoutes.js         # Restaurant routes (/api/v1/restaurants)
│   │   └── orderRoutes.js              # Order routes (/api/v1/orders, /:id/status)
│   ├── middleware/
│   │   ├── authGuard.js                # Bearer token verification middleware
│   │   ├── requestLogger.js            # Global HTTP request logger middleware
│   │   └── errorHandler.js             # Centralized error handler with status codes
│   ├── seed.js                         # Standalone database seeder script with bcrypt passwords
│   ├── server.js                       # Express server entry point
│   ├── .env                            # Local environment variables
│   └── package.json
│
├── .env.example                        # Sample environment variables
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/awdf-exam
JWT_SECRET=quickbite_jwt_secret_key_itue301_set_a
NODE_ENV=development
```

### Frontend (`frontend/.env` - optional):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Installation & Running the Application

### 1. Prerequisites
Ensure **Node.js** (v18+) and **MongoDB** are installed and running on your system.

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds 6 sample restaurants, Customer (visrut@example.com) & Admin (qwerty@gmail.com)
npm start        # Starts server on http://localhost:5000
```

### 3. Frontend Setup
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Pre-Configured Test Accounts

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **System Admin** | `qwerty@gmail.com` | `qwertyuiop@12345` | Full access: View all orders, update status in Admin Panel (`/admin`) |
| **Customer** | `visrut@example.com` | `Visrut@12345` | Customer access: Browse restaurants, place orders (`/order`) |

---

## 📡 Backend API Endpoints

All APIs are prefixed with `/api/v1`:

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticates customer/admin with bcrypt password & issues JWT token |
| `POST` | `/api/v1/auth/register` | Public | Registers a new customer with regex-validated password |
| `GET` | `/api/v1/restaurants` | Public | Returns all restaurants (supports `?search=` and `?cuisine=` query filters) |
| `GET` | `/api/v1/restaurants/:id`| Public | Returns single restaurant details |
| `POST` | `/api/v1/orders` | **Protected** (`authGuard`) | Creates a new food order linked to the authenticated customer |
| `GET` | `/api/v1/orders` | **Protected** (`authGuard`) | Retrieves orders with `.populate('customerId')` and `.populate('restaurantId')` |
| `PATCH`| `/api/v1/orders/:id/status`| **Protected** (`authGuard`) | Updates order status (`pending`, `preparing`, `out-for-delivery`, `delivered`, `cancelled`) |

---

## 📝 ITUE301 Examination Tasks: Files & Why

### Task 1: React Component Architecture
- **Files & Paths**:
  - `frontend/src/components/RestaurantCard.jsx`
  - `frontend/src/pages/HomePage.jsx`
  - `frontend/src/pages/RestaurantsPage.jsx`
  - `frontend/src/pages/OrderPage.jsx`
  - `frontend/src/components/Header.jsx`
  - `frontend/src/components/Navbar.jsx`
  - `frontend/src/components/Footer.jsx`
- **WHY**:
  - Promotes modularity and separation of concerns by keeping reusable UI widgets in `components/` and page-level layouts in `pages/`.
  - Reusing `RestaurantCard` across the catalog and home preview prevents duplicated code.
  - Passing `name`, `cuisine`, `rating`, and `isOpen` as props enables dynamic, parent-driven rendering and conditional visual styling (`Open Now` vs `Closed`).

---

### Task 2: React Routing and State Management
- **Files & Paths**:
  - `frontend/src/App.jsx`
  - `frontend/src/components/Navbar.jsx`
  - `frontend/src/components/ProtectedRoute.jsx`
  - `frontend/src/components/AdminProtectedRoute.jsx`
  - `frontend/src/context/AuthContext.jsx`
  - `frontend/src/pages/OrderPage.jsx`
  - `frontend/src/pages/AdminPanel.jsx`
  - `frontend/src/pages/LoginPage.jsx`
  - `frontend/src/pages/SignupPage.jsx`
- **WHY**:
  - Enables smooth client-side single-page navigation without full browser reloads using React Router.
  - Route guards (`ProtectedRoute` and `AdminProtectedRoute`) enforce security by preventing unauthenticated access to ordering and restricting the Admin Panel strictly to administrators.
  - Code-splitting `/admin` with `React.lazy()` and `Suspense` optimizes frontend performance by deferring the admin module until requested.
  - React `useState` powers dynamic order building with live subtotal and grand total recalculations.

---

### Task 3: Express REST API + Middleware
- **Files & Paths**:
  - `backend/server.js`
  - `backend/middleware/requestLogger.js`
  - `backend/middleware/authGuard.js`
  - `backend/middleware/errorHandler.js`
  - `backend/routes/authRoutes.js`
  - `backend/routes/restaurantRoutes.js`
  - `backend/routes/orderRoutes.js`
- **WHY**:
  - Exposes RESTful endpoints following standard HTTP methods and status codes (200, 201, 400, 401, 500).
  - Global `requestLogger` provides structured server-side request logging (`[METHOD] [PATH] [TIMESTAMP]`) for traceability.
  - `authGuard` middleware validates Bearer JWT tokens to secure private endpoints and reject unauthorized requests with HTTP 401.
  - Centralized `errorHandler` prevents server crashes, handles Mongoose validation errors, and avoids leaking raw stack traces to clients.

---

### Task 4: REST API Consumption in React
- **Files & Paths**:
  - `frontend/src/pages/RestaurantsPage.jsx`
  - `frontend/src/services/api.js`
  - `frontend/src/components/Loading.jsx`
  - `frontend/src/components/ErrorMessage.jsx`
- **WHY**:
  - Replaces hardcoded data with live database records fetched asynchronously via `GET /api/v1/restaurants` on mount.
  - Managing distinct `restaurants`, `loading`, and `error` states ensures intuitive user feedback during network requests.
  - Client-side in-memory search filtering enables instantaneous search results by restaurant name or cuisine without straining the backend with redundant network requests.

---

### Task 5: MongoDB + Mongoose Schema Design and Validation
- **Files & Paths**:
  - `backend/config/db.js`
  - `backend/models/Customer.js`
  - `backend/models/Restaurant.js`
  - `backend/models/Order.js`
  - `backend/seed.js`
- **WHY**:
  - Enforces database-level constraints: required fields, unique email addresses, non-negative totals, and strict order status enums.
  - Relational references (`customerId` ref `Customer`, `restaurantId` ref `Restaurant`) enable Mongoose `.populate()` for retrieving rich, linked data without duplication.
  - Integrating `bcryptjs` one-way cryptographic password hashing protects user credentials against plaintext exposure in the database.
  - Connects securely via environment variables (`MONGO_URI` / `MONGODB_URI`) to avoid hardcoding database connection details.
