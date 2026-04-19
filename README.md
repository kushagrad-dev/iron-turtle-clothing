# 🐢 Iron Turtle — Premium Fitness & Streetwear E-Commerce

A production-ready full-stack e-commerce web application for the **Iron Turtle** fitness and streetwear clothing brand.

![Iron Turtle](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript, Vite |
| **UI Library** | Material UI (MUI v6) |
| **State Management** | TanStack Query + Context API |
| **Routing** | React Router v7 |
| **Animations** | Framer Motion |
| **Backend** | Node.js + Express 5 + TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (Google OAuth) |
| **Styling** | MUI Dark Theme + Custom Design System |

## Features

### 🛍️ Shopping Experience
- Hero section with premium branding
- Product listing with filters (category, price range, rating, sort)
- Product detail pages with image gallery, size/color selectors
- Persistent cart (localStorage + backend sync)
- Checkout flow with shipping form
- Order tracking and history

### 🔐 Authentication
- Google OAuth login via Supabase Auth
- Protected routes (profile, orders, wishlist, checkout)
- JWT/session handling with auto-refresh
- Admin role-based access control

### ❤️ Additional Features
- Wishlist system with add/remove
- Product reviews & ratings (aggregated on product)
- Search functionality with live results
- Admin panel (product CRUD + order management)
- SEO-optimized (meta tags, semantic HTML)
- Mobile responsive design
- Smooth animations & micro-interactions

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account

### 1. Clone & Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** and run the migration script:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
   This creates all tables, RLS policies, triggers, and seed data.

3. Enable **Google Auth**:
   - Go to **Authentication → Providers → Google**
   - Enable it and add your Google OAuth credentials
   - Set redirect URL to `http://localhost:5173` (dev) or your production URL

4. Copy your project credentials from **Settings → API**:
   - Project URL
   - Anon (public) key
   - Service Role key

### 3. Configure Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:4000/api
```

**Backend** (`backend/.env`):
```env
PORT=4000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:4000/api/health

### 5. Make Yourself Admin

After signing in with Google, run this in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
```

## Project Structure

```
iron-turtle/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   ├── product/         # ProductCard
│   │   │   ├── common/          # ProtectedRoute
│   │   │   └── cart/            # (extensible)
│   │   ├── pages/               # 10 lazy-loaded pages
│   │   ├── hooks/               # React Query hooks
│   │   ├── services/            # API client + Supabase
│   │   ├── context/             # Auth + Cart contexts
│   │   ├── theme/               # MUI dark theme config
│   │   └── types/               # TypeScript interfaces
│   ├── index.html
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/         # Request handlers (7 files)
│   │   ├── routes/              # Express routes (8 files)
│   │   ├── middleware/          # Auth + error handling
│   │   ├── config/              # Supabase client
│   │   ├── types/               # TypeScript interfaces
│   │   └── index.ts             # Express app entry
│   ├── tsconfig.json
│   └── package.json
├── supabase/
│   └── migrations/              # SQL migration scripts
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/auth/me` | ✅ | Get profile |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| GET | `/api/products` | — | List products (filters, pagination) |
| GET | `/api/products/:slug` | — | Get product by slug |
| POST | `/api/products` | 🔒 Admin | Create product |
| PUT | `/api/products/:id` | 🔒 Admin | Update product |
| DELETE | `/api/products/:id` | 🔒 Admin | Delete product |
| GET | `/api/categories` | — | List categories |
| GET | `/api/cart` | ✅ | Get cart items |
| POST | `/api/cart` | ✅ | Add to cart |
| POST | `/api/cart/sync` | ✅ | Sync localStorage cart |
| PUT | `/api/cart/:id` | ✅ | Update cart item |
| DELETE | `/api/cart/:id` | ✅ | Remove from cart |
| GET | `/api/orders` | ✅ | List orders |
| POST | `/api/orders` | ✅ | Create order |
| PUT | `/api/orders/:id/status` | 🔒 Admin | Update order status |
| GET | `/api/wishlist` | ✅ | Get wishlist |
| POST | `/api/wishlist` | ✅ | Add to wishlist |
| DELETE | `/api/wishlist/:product_id` | ✅ | Remove from wishlist |
| GET | `/api/reviews/product/:id` | — | Get product reviews |
| POST | `/api/reviews` | ✅ | Create review |
| DELETE | `/api/reviews/:id` | ✅ | Delete review |
| GET | `/api/search?q=` | — | Search products |

## Deployment

### Frontend → Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your deployed backend URL)
4. Deploy!

### Backend → Render / Railway

1. Connect your GitHub repo
2. Set root directory to `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables:
   - `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL` (your Vercel deployment URL)

### Database → Supabase

Already hosted! Just run the migration SQL and configure Auth providers.

## Design System

| Element | Value |
|---------|-------|
| Background | `#0a0a0a` (deep black) |
| Cards | `#141414` (charcoal) |
| Primary Accent | `#00ff88` (neon green) |
| Secondary Accent | `#ffd700` (gold) |
| Heading Font | Oswald (bold, uppercase) |
| Body Font | Inter (clean, modern) |

## License

MIT
