# 🏟️ SportsZone - Premium Sports Court Booking Platform

A clean, modern, and high-performance sports court booking application inspired by SportsZone Bookings. Engineered with a real-time availability engine, 14-day booking calendar, zero double-booking atomic concurrency guarantees, player phone verification flow, and an administrative management dashboard.

---

## 🚀 Key Features

### 1. 🌟 Clean Modern Homepage
- **Facility Hero**: Value proposition, direct CTAs, feature badges.
- **Sport Categories**: Quick filters for Football, Padel, Tennis, and Basketball.
- **Featured Sports Courts**: Real-time hourly rates, surfaces, operating hours, and booking triggers.
- **Why Choose Us**: Transparent venue advantages.

### 2. 📅 SportsZone-Inspired Availability & Booking Engine
- **14-Day Date Bar**: Scrollable day picker with quick "Jump to Today" and native date input.
- **Multi-Sport Filters**: All, Football, Padel, Tennis, Basketball.
- **Dual View Modes**:
  - **Grid Matrix (Desktop & Tablet)**: Full time-by-court slot matrix.
  - **By Court List (Mobile First)**: Accordion-style layout optimized for smartphone screens.
- **Four Clear Visual Slot States**:
  - 🟢 **Available**: Shows price, highlighted on hover, single click to book.
  - 🔒 **Booked**: Clearly locked and unclickable.
  - ⚠️ **Blocked / Maintenance**: Admin reserved slots.
  - ⏳ **Past**: Slots in the past disabled automatically.

### 3. 📱 Mobile-First Experience
- Fast navigation, touch-friendly slot pills, full responsive collapse without horizontal squishing.

### 4. 🔒 Zero Double-Booking Atomic Backend Guarantee
- The frontend is **never trusted** for slot availability.
- The backend checks availability upon receiving the booking request.
- Uses MongoDB compound sparse unique keys (`slotLockKey`) to atomically prevent race conditions even when two users submit simultaneously at the exact millisecond.

### 5. 🛠️ Complete Admin & Management Portal
- **Metrics & Overview**: Daily revenue, all-time gross revenue, active courts count, recent bookings.
- **Interactive Day Grid**: Click any slot to view customer details, create instant walk-in reservations, or lock slots for maintenance.
- **Court CRUD Manager**: Add, edit pricing, change surface type, update operating hours, and enable/disable courts.
- **Search & Booking Records**: Real-time customer search by phone, booking reference ID, or date, plus one-click cancellations.

### 6. 📱 WhatsApp Cloud API Ready Architecture
- Dedicated notification hooks for booking confirmation, match reminders, and cancellations with pre-formatted message templates ready for live Meta credentials activation in the final WhatsApp phase.

---

## 🏗️ Project Architecture & Structure

```
sports-court-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Connection
│   ├── controllers/
│   │   ├── adminController.js    # Metrics, grid calendar, slot blocking
│   │   ├── authController.js     # Admin JWT auth & SMS/Phone OTP verification
│   │   ├── availabilityController.js # Real-time slot availability matrix
│   │   ├── bookingController.js  # Atomic booking creation & cancellations
│   │   └── courtController.js    # Court CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection & admin role guard
│   │   └── errorMiddleware.js    # Global error handlers
│   ├── models/
│   │   ├── blockedSlotModel.js   # Maintenance slots
│   │   ├── bookingModel.js       # Atomic bookings with slotLockKey
│   │   ├── courtModel.js         # Sports courts specifications
│   │   ├── otpModel.js           # Phone verification codes with TTL
│   │   └── userModel.js          # Admin / Staff accounts
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── availabilityRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── courtRoutes.js
│   ├── services/
│   │   ├── availabilityEngine.js # Dynamic slot generation & past-time checks
│   │   └── notificationService.js# WhatsApp / SMS hook payloads
│   ├── scripts/
│   │   ├── seed.js               # Initial courts and demo admin
│   │   └── testConcurrency.js    # Automated double-booking test
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── admin/            # Dashboard, Grid Schedule, Court & Booking Managers
    │   │   ├── booking/          # 14-Day DateBar, SportFilter, Matrix, Mobile Cards, Modals
    │   │   ├── common/           # Navbar, Footer, Modal
    │   │   └── home/             # Hero, Categories, Featured Courts, WhyChooseUs
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Admin authentication state
    │   │   └── BookingContext.jsx# Live date, sport filter & availability state
    │   ├── pages/
    │   │   ├── AdminDashboardPage.jsx
    │   │   ├── BookingLookupPage.jsx
    │   │   ├── BookingPage.jsx
    │   │   ├── HomePage.jsx
    │   │   └── LoginPage.jsx
    │   ├── services/
    │   │   └── api.js            # Axios client with interceptors
    │   ├── styles/
    │   │   ├── booking-grid.css  # Availability matrix and slot badges
    │   │   └── main.css          # Design system, cards, forms, badges
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🏃 Running the Application

### 1. Start the Backend API
```powershell
cd sports-court-app/backend
npm install
node scripts/seed.js   # Seeds courts and admin user
npm run dev            # Runs on http://localhost:5005
```

### 2. Start the Frontend Application
```powershell
cd sports-court-app/frontend
npm install
npm run dev            # Runs on http://localhost:5173
```

### 🔑 Demo Credentials
- **Admin Email**: `admin@sportszone.com`
- **Admin Password**: `admin123`
- **Customer Verification Code**: `123456` (also autodetected in dev mode)
