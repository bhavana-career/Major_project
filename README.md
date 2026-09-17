# Asset-Light Farming: Optimizing Operational Costs through Managed Equipment Access

> **B.E. Information Science & Engineering Major Project**  
> **Initial Working MVP — Review 1**

---

## 🌾 Project Overview

This platform is a two-sided agricultural machinery rental ecosystem designed to reduce capital expenditure for smallholder farmers while enabling equipment owners to monetize underutilized agricultural assets.

The platform connects:
1. **Farmers / Renters:** Individuals requiring machinery for seasonal land preparation, tilling, harvesting, or spraying.
2. **Equipment Owners / Providers:** Machinery owners listing equipment for daily rental with date-based scheduling.

---

## 🏗️ Core Architecture & Tech Stack

The application uses a **Clean Modular Monolith Architecture** with a single backend service, single PostgreSQL database, and dedicated web applications.

```
                    FARMER FRONTEND (Port 3000)
                                 │
                                 ▼
                     SINGLE BACKEND (Express / TS)
                                 │
                                 ▼
                        POSTGRESQL DATABASE
                                 ▲
                                 │
                     SINGLE BACKEND (Express / TS)
                                 ▲
                                 │
                     OWNER FRONTEND (Port 3001)
```

### Tech Stack Details
- **Frontend:** React, TypeScript, Tailwind CSS, React Router DOM, Lucide Icons.
- **Backend:** Node.js, Express.js, TypeScript, REST API architecture.
- **Database & ORM:** PostgreSQL 18 with Prisma ORM.
- **Authentication:** Phone-number-first authentication, bcrypt password hashing, Development OTP Provider, JWT sessions.

---

## 🔐 Phone-First Dev OTP Authentication

Phone number is the primary identity.
For Review 1, a **Development OTP Provider** is active:
- When a user enters their phone number during registration, a 6-digit verification code (`123456` or generated code) is printed to the backend server console.
- In development mode, the OTP is also returned in the API response payload for immediate modal testing.
- Password hashing is enforced using `bcryptjs` with salt rounds.

---

## 🚀 How to Run the Application

You can start the apps in two easy ways depending on your current terminal directory:

---

### Option 1: Running from the ROOT directory (`Major_project`)

Open 3 separate terminal windows in `Major_project`:

#### Terminal 1 — Backend API Server (Port 5000)
```powershell
npm run dev:server
```

#### Terminal 2 — Farmer Web App (Port 3000)
```powershell
npm run dev:farmer
```

#### Terminal 3 — Owner Web App (Port 3001)
```powershell
npm run dev:owner
```

---

### Option 2: Running from SUBDIRECTORIES (`cd server`, etc.)

If you have navigated into the subfolders (like `cd server`), use `npm run dev`:

#### Terminal 1 — Inside `server` folder
```powershell
cd server
npm run dev
```

#### Terminal 2 — Inside `apps/farmer-web` folder
```powershell
cd apps/farmer-web
npm run dev
```

#### Terminal 3 — Inside `apps/owner-web` folder
```powershell
cd apps/owner-web
npm run dev
```

---

## 🔑 Demo Credentials for Review 1 Demonstration

The database comes pre-seeded with test accounts:

| Portal | Role | Mobile Phone | Password | Key Actions to Demonstrate |
| :--- | :--- | :--- | :--- | :--- |
| **[http://localhost:3000](http://localhost:3000)** | 🌾 **Farmer** | `9123456789` | `password123` | Search tractors, check date availability, submit booking request, track status |
| **[http://localhost:3001](http://localhost:3001)** | 🚜 **Equipment Owner** | `9876543210` | `password123` | View incoming farmer requests, click **[ Accept ]** or **[ Reject ]**, add equipment, toggle active status |

---

## 📊 Feature Scope (Review 1 MVP vs Future Roadmap)

### ✅ Implemented Now (Review 1 MVP - 100% Functional)
- [x] Unique phone-number-first registration & password login.
- [x] Development OTP provider printing to server console.
- [x] Dynamic roles schema supporting multi-role expansion.
- [x] Farmer profile, farm details, and crop details management.
- [x] Owner profile, business details, and equipment inventory.
- [x] Equipment search with type filtering, price filtering, and location-based Haversine distance calculation.
- [x] Date availability check & backend date collision validation engine.
- [x] End-to-end booking request lifecycle (PENDING -> CONFIRMED / REJECTED).
- [x] Real-time owner notification and instant Accept/Reject actions.
- [x] Shared PostgreSQL database integration across both Farmer and Owner portals.

### 🔮 Planned Future Phases (Extensible Architecture Prepared)
- Real SMS Gateway (Twilio / Fast2SMS).
- Google Maps Distance Matrix API & interactive location picker.
- Payment Gateway integration (Razorpay / UPI).
- Transporter marketplace & logistics coordination.
- Ratings and reviews system.
- Kannada & English Voice AI Assistant (Gemini API).

---

## 📄 Documentation Links
- Detailed Architecture & Sequence Diagrams: [docs/architecture.md](file:///c:/Users/bhava/OneDrive/Documents/Downloads/Major_project/docs/architecture.md)
