# System Architecture & Design Document

## Asset-Light Farming: Optimizing Operational Costs through Managed Equipment Access

---

## 1. High-Level Architecture Overview

The system is engineered as a **Modular Monolith** supporting a two-sided marketplace for agricultural machinery rentals.

```mermaid
graph TD
    subgraph Frontend Applications
        FarmerUI["Farmer Web App (React + TS + Tailwind)<br/>Port: 3000"]
        OwnerUI["Owner Web App (React + TS + Tailwind)<br/>Port: 3001"]
    end

    subgraph Backend Core
        ExpressServer["Express.js REST API Backend<br/>Port: 5000"]
        
        subgraph Internal Modules
            AuthMod["Auth & Dev OTP Module"]
            FarmerMod["Farmer & Farm Profile Module"]
            OwnerMod["Owner Profile Module"]
            EquipMod["Equipment Search & Inventory Engine"]
            BookingMod["Booking & Conflict Engine"]
        end
    end

    subgraph Database Layer
        PostgresDB[("PostgreSQL Database<br/>(agri_rental)")]
        PrismaORM["Prisma ORM"]
    end

    FarmerUI -->|REST API + JWT| ExpressServer
    OwnerUI -->|REST API + JWT| ExpressServer
    ExpressServer --> AuthMod
    ExpressServer --> FarmerMod
    ExpressServer --> OwnerMod
    ExpressServer --> EquipMod
    ExpressServer --> BookingMod
    
    AuthMod & FarmerMod & OwnerMod & EquipMod & BookingMod --> PrismaORM
    PrismaORM --> PostgresDB
```

---

## 2. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ UserRole : "has"
    Role ||--o{ UserRole : "assigned"
    User ||--o| FarmerProfile : "owns"
    User ||--o| OwnerProfile : "owns"
    User ||--o{ Booking : "creates (Farmer)"
    
    FarmerProfile ||--o{ Farm : "contains"
    Farm ||--o{ Crop : "grows"
    
    OwnerProfile ||--o{ Equipment : "lists"
    Equipment ||--o{ Booking : "has"

    User {
        string id PK
        string phone UK
        string passwordHash
        string name
        datetime createdAt
    }

    Role {
        string id PK
        enum name "FARMER, OWNER, ADMIN"
    }

    OtpVerification {
        string id PK
        string phone
        string code
        datetime expiresAt
        boolean isVerified
    }

    FarmerProfile {
        string id PK
        string userId FK
        string district
        string taluk
        string village
        float totalLandAcres
    }

    Farm {
        string id PK
        string farmerProfileId FK
        string name
        float areaAcres
    }

    OwnerProfile {
        string id PK
        string userId FK
        string businessName
        string locationName
        string contactPhone
    }

    Equipment {
        string id PK
        string ownerProfileId FK
        string title
        string equipmentType
        float pricePerDay
        string locationName
        boolean isActive
        enum verificationStatus "PENDING, VERIFIED"
    }

    Booking {
        string id PK
        string bookingNumber UK
        string equipmentId FK
        string farmerId FK
        datetime startDate
        datetime endDate
        int totalDays
        float totalAmount
        enum status "PENDING, CONFIRMED, REJECTED, COMPLETED"
    }
```

---

## 3. Booking & Conflict Validation Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    participant FarmerWeb as Farmer Web UI
    participant Backend as Express API Engine
    participant DB as PostgreSQL (Prisma)
    actor Owner
    participant OwnerWeb as Owner Web UI

    Farmer->>FarmerWeb: Selects dates (Sept 20 - Sept 22) & submits booking
    FarmerWeb->>Backend: POST /api/bookings { equipmentId, startDate, endDate }
    Backend->>DB: Query overlapping CONFIRMED/PENDING bookings for equipmentId
    
    alt Date Collision Detected
        DB-->>Backend: Existing booking conflict found
        Backend-->>FarmerWeb: 409 Conflict Error: "Date Collision: Equipment already booked"
    else Dates Available
        DB-->>Backend: No overlap
        Backend->>DB: INSERT INTO Booking (status: PENDING)
        DB-->>Backend: Booking created (BK-DEMO-XXXX)
        Backend-->>FarmerWeb: 201 Created (Booking Pending)
    end

    Owner->>OwnerWeb: Opens Owner Dashboard -> Booking Requests
    OwnerWeb->>Backend: GET /api/bookings/owner
    Backend->>DB: Fetch bookings for equipment owned by user
    DB-->>Backend: Return pending booking
    Backend-->>OwnerWeb: Display Farmer Ravi's request for Mahindra Tractor

    Owner->>OwnerWeb: Clicks [ Accept Booking ]
    OwnerWeb->>Backend: PATCH /api/bookings/:id/status { status: "CONFIRMED" }
    Backend->>DB: UPDATE Booking SET status = 'CONFIRMED'
    DB-->>Backend: Updated status in PostgreSQL
    Backend-->>OwnerWeb: 200 OK (Booking Confirmed)

    Farmer->>FarmerWeb: Refresh / View My Bookings
    FarmerWeb->>Backend: GET /api/bookings/farmer
    Backend->>DB: Query farmer's bookings
    DB-->>Backend: Return confirmed status
    FarmerWeb-->>Farmer: Displays green badge "Confirmed Booking"
```

---

## 4. Distance Awareness & Extensibility

```mermaid
graph LR
    subgraph Current Implementation (MVP)
        LocalCoords["Local Coordinates / Address Input"] --> Haversine["Haversine Formula Engine"]
        Haversine --> DistanceKm["Calculates Straight-Line Distance (km)"]
    end

    subgraph Future Integration Phase
        DistanceKm -.-> GoogleMapsMatrix["Google Maps Distance Matrix API"]
        GoogleMapsMatrix -.-> TransportPricing["Distance-Based Transport & Pricing Engine"]
    end
```
