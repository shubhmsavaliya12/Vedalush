# 🌿 Vedalush - Premium Artisanal Organic Soap Platform

Vedalush is a luxury, production-ready full-stack web application built for an artisanal, handcrafted organic skincare brand. The platform combines state-of-the-art modern e-commerce web aesthetics (glassmorphism, curated earthy/gold color palettes, micro-animations) with a high-performance Node.js/Express backend, MongoDB database, and automated transactional email receipt system.

---

## ✨ Key Features & Highlights

### 🎨 Stunning Brand UI/UX
- **Luxury Aesthetic:** Designed with a curated warm earthy palette (`#5D4E42`, `#8E7A65`, `#FDFBF7`, `#B88A5A`), modern serif/sans-serif typography hierarchy (`Playfair Display`, `Georgia`, `Inter`), and subtle glassmorphism overlays.
- **Fluid Micro-Animations:** Scroll-triggered reveals, smooth tab transitions, and hover effects powered by `framer-motion`.
- **Responsive Layout:** Perfectly tailored responsive design across mobile phones, tablets, laptops, and ultra-wide desktop monitors, featuring a slide-over mobile navigation drawer with dimmed backdrop.

### 🛍️ Customer Shopping Experience
- **Interactive Product Catalog:** Dynamic filtering by skin type, benefit badges, and real-time currency conversion (INR `₹`, USD `$`, EUR `€`) with automatic localStorage preference persistence.
- **AI-Inspired Skin Type Guide:** An interactive step-by-step diagnostic quiz that analyzes customer skin concerns and prescribes custom Vedalush soap routines.
- **Direct Order Checkout:** Streamlined order submission form with instant validation, quantity badges, and special note requests.
- **GDPR / DPDP Compliant Cookie Consent:** An elegant, non-intrusive floating popup banner allowing users to accept or decline caching preferences, connected directly to a modal legal privacy policy.

### 📧 Automated Receipt-Style Email Notifications
- **Professional Transactional Receipts:** Integrated with the **Brevo v6 API SDK** to send instant, structured order confirmation receipts to customers and alert notifications to administrators.
- **Cross-Client Compatibility:** Built with responsive HTML tables (`border-collapse: collapse`) and inline CSS styling to guarantee flawless rendering across Gmail, Apple Mail, Thunderbird, and Microsoft Outlook.

### 🔐 Secure Admin Management Portal
- **Dark-Theme Admin Dashboard:** A dedicated administrative dashboard to manage product inventory, track visitor analytics, and update live order statuses (`Pending`, `Contacted`, `Completed`).
- **Maximum Security Authentication:** Protected by JSON Web Tokens (JWT) transmitted exclusively via strict `HttpOnly` and `SameSite` cookies, completely eliminating local storage XSS token theft vulnerabilities.
- **Cloud Media Management:** Integrated with **Cloudinary** for instant, optimized product image uploads directly from the admin interface.

---

## 🚀 Technology Stack

### Frontend (`/frontend`)
- **Core Framework:** React 18, Vite
- **Styling:** Vanilla CSS, Tailwind CSS v4
- **Animations:** Framer Motion, Swiper.js
- **Routing & State:** React Router DOM, React Hook Form, Axios
- **SEO & Performance:** React Helmet Async, Route-based Code Splitting (`React.lazy`)

### Backend (`/backend`)
- **Runtime & Framework:** Node.js, Express.js
- **Database & ODM:** MongoDB, Mongoose
- **Authentication & Security:** Cookie-Parser, JSON Web Tokens (JWT), BCrypt/Crypto
- **Media & Storage:** Cloudinary SDK, Multer
- **Email Service:** Brevo Transactional Email SDK (`@getbrevo/brevo`)

---

## 📦 Project Directory Structure

```text
Vedalush/
├── backend/                   # Node.js & Express REST API Server (Port 5000)
│   ├── models/                # Mongoose Database Schemas (Order, Product, User, Visitor)
│   ├── routes/                # API Endpoints (/api/auth, /api/products, /api/orders, /api/admin)
│   ├── utils/                 # Email receipt generator (Brevo), Auth verifier, Cloudinary config
│   ├── index.js               # Express server entry point & CORS configuration
│   └── package.json           # Backend dependencies & scripts
│
├── frontend/                  # React 18 + Vite Single Page Application (Port 5173)
│   ├── public/                # Static brand logos & favicon assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/      # Modular landing sections (Hero, FeaturedProducts, DirectOrder, etc.)
│   │   │   └── ui/            # Reusable UI elements (Navbar, Footer, CookieConsent, LegalModal)
│   │   ├── context/           # Global React Contexts (AuthContext, CurrencyContext)
│   │   ├── hooks/             # Custom React hooks (useVisitorTracking)
│   │   ├── pages/             # Route views (Home, ProductDetails, Profile, AdminDashboard)
│   │   ├── App.jsx            # Main routing tree & global provider wrapping
│   │   └── index.css          # Tailwind v4 directives & custom CSS design tokens
│   └── package.json           # Frontend dependencies & scripts
│
└── DEPLOYMENT_AND_HANDOVER_GUIDE.md  # Comprehensive step-by-step production deployment & client handover guide
```

---

## 🛠️ Local Development Setup

Follow these simple steps to run the full-stack application locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/vedalush.git
cd vedalush
```

### 2. Configure Backend Environment Variables
Create a file named `.env` inside the `/backend` directory and add your development credentials (never commit real production keys to Git):

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database (Local MongoDB Compass or Atlas Cloud URI)
MONGODB_URI=mongodb://127.0.0.1:27017/vedalush_local
# Or for Cloud: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vedalush?retryWrites=true&w=majority

# Security Keys
JWT_SECRET=your_super_secret_jwt_random_string_here
SEED_SECRET=your_admin_seed_secret_string

# Cloudinary Image Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Brevo Email Service (Optional in dev: if left blank, emails print safely to server console)
BREVO_API_KEY=your_brevo_v6_api_key
BREVO_SENDER_EMAIL=support@yourdomain.com
BREVO_SENDER_NAME="Vedalush Orders"
ADMIN_EMAIL=admin@yourdomain.com
```

### 3. Start the Backend API Server
Open a terminal window and start the backend development server:
```bash
cd backend
npm install
npm run dev
```
*The server will start on `http://localhost:5000` and display `MongoDB Connected Successfully`.*

### 4. Start the Frontend React App
Open a **second terminal window** and launch the frontend Vite server:
```bash
cd frontend
npm install
npm run dev
```
*The website will open automatically at `http://localhost:5173`.*

---

## 🔐 Admin Dashboard Access & Initial Seed

To ensure maximum security, Vedalush does not expose a public administrator signup form. When launching a fresh database, create your initial Admin account using the secret seed route:

1. Ensure your backend server is running on port `5000`.
2. Send a `POST` request to `http://localhost:5000/api/admin/seed` with the header `x-seed-secret` matching your `.env` value.
3. You can run this simple command in your terminal:
   ```bash
   curl -X POST http://localhost:5000/api/admin/seed \
     -H "x-seed-secret: your_admin_seed_secret_string"
   ```
4. Once seeded, access the admin login portal at `http://localhost:5173/admin/login` using the default credentials created by your backend seed config.

---

## 📖 Production Deployment & Client Handover

For complete instructions on migrating from local **MongoDB Compass to MongoDB Atlas Cloud**, transferring **Cloudinary** accounts, linking a **Custom Domain (e.g. `www.vedalush.com`)**, and professionally delivering this codebase to your client, please see the dedicated comprehensive guide:

👉 **[Read the Full Deployment & Handover Guide (DEPLOYMENT_AND_HANDOVER_GUIDE.md)](./DEPLOYMENT_AND_HANDOVER_GUIDE.md)**

---

## 📄 License & Ownership
Copyright © 2026 Vedalush Private Limited. All rights reserved. Handcrafted with precision and artisanal care.
