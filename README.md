# Food Court | Restaurant Reservation & Table Management System (Angular Edition)

A full-stack, enterprise-grade restaurant reservation and dining table floor management system built with **Angular (v18+)** and a **Node.js / Express REST API** backend.

---

## 🌟 Academic & Technical Highlights (Teacher / Evaluation Checklist)

| Requirement | Implementation in Food Court |
|---|---|
| **Modern Angular Architecture** | Angular 18+ **Standalone Components** (`standalone: true`), no NgModule bloat. |
| **Reactive State Management** | **RxJS `BehaviorSubject` & `Observable`** (`tables$`, `reservations$`, `waitlist$`, `guests$`). |
| **JavaScript / TypeScript Array Operations** | Live interactive studio demonstrating **`filter`**, **`map`**, **`reduce`**, **`find`**, and **`sort`** on real dining data. |
| **Full Client-Side Routing** | Angular Router (`provideRouter`) with routes for **Dashboard**, **Floor Plan**, **Reservations**, **Waitlist**, **Guest CRM**, and **Analytics**. |
| **Two-Way Data Binding & Forms** | `[(ngModel)]` and `FormsModule` for reactive search, filtering, and reservation/waitlist modal forms. |
| **HTTP Client & Dependency Injection** | `provideHttpClient()` connecting to Node.js/Express REST API on Port 5000 with automatic offline seed data fallback. |
| **Authentication & Route Guards** | **Angular Functional Route Guards (`authGuard`, `loginGuard`)** protecting floor routes, session persistence in `localStorage`, and role-based staff login (Admin, Manager, Hostess). |
| **Interactive UX & Audio Feedback** | Web Audio API synthesizer chimes on seating/booking and floating Toast notification system. |
| **Run Sheet Export** | 1-click **CSV export** for daily host stand seating runs. |

---

## 📁 Project Architecture & Clean Folder Layout

```
Restaurant/
│
├── backend/                       # 🟢 Node.js + Express REST API Server (Port 5000)
│   ├── data/
│   │   ├── database.js            # JSON file database manager
│   │   └── restaurant_db.json     # Persistent database storage file
│   ├── routes/
│   │   ├── analytics.js           # Analytics & metrics endpoints
│   │   ├── reservations.js        # Reservation CRUD, seating & complete endpoints
│   │   ├── tables.js              # Table management & status endpoints
│   │   └── waitlist.js            # Walk-in waitlist queue endpoints
│   ├── .env                       # Backend port (5000) & environment config
│   ├── index.js                   # Express server entry point
│   └── package.json               # Backend dependencies & scripts
│
├── frontend-angular/              # 🅰️ Angular 18/21 Standalone Application (Port 4200)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── navbar/        # NavbarComponent (live clock, occupancy meter, backend status)
│   │   │   │   ├── sidebar/       # SidebarComponent (navigation links & architecture badge)
│   │   │   │   └── toast/         # ToastComponent (floating animated action notifications)
│   │   │   ├── models/            # Table, Reservation, Waitlist, GuestProfile, Metrics interfaces
│   │   │   ├── pages/
│   │   │   │   ├── dashboard/     # Floor metrics KPIs, daily schedule, floor preview
│   │   │   │   ├── tables/        # 2D Floor layout, section filters, table detail modal
│   │   │   │   ├── reservations/  # Booking intake modal, search, seat, complete, CSV export
│   │   │   │   ├── waitlist/      # Walk-in queue, quoted wait times, priority seating
│   │   │   │   ├── guests/        # Guest CRM, VIP tags, spend history, dietary allergies
│   │   │   │   └── analytics/     # Live TypeScript Array Operations Studio (filter/map/reduce/find/sort)
│   │   │   ├── services/          # RestaurantService (HttpClient, RxJS Observables, Web Audio)
│   │   │   ├── app.config.ts      # Application config (provideHttpClient, provideRouter)
│   │   │   ├── app.routes.ts      # Angular Router route configurations
│   │   │   ├── app.ts             # Root standalone component
│   │   │   └── app.html           # Main layout template
│   │   ├── index.html             # Angular index HTML
│   │   ├── main.ts                # Bootstrap application
│   │   └── styles.css             # Dark luxury styling
│   ├── angular.json               # Angular CLI workspace config
│   ├── package.json               # Angular dependencies & scripts
│   └── tsconfig.json              # TypeScript configuration
│
├── frontend-react/                # ⚛️ React 18 + Vite Frontend Application (Port 3000) [Bonus Dual-Framework]
│
├── .env                           # Environment configuration
├── .env.example
├── package.json                   # Root orchestrator with concurrently scripts
└── README.md                      # Comprehensive documentation
```

---

## 🚀 How to Run the Project (Step-by-Step)

### Option 1: Run Angular + Backend Together (Recommended)
From the root folder (`Restaurant`), simply run:
```bash
npm run dev
# or
npm start
```

This single command launches both:
- **🅰️ Angular Application**: [http://localhost:4200](http://localhost:4200)
- **🟢 Express REST API**: [http://localhost:5000](http://localhost:5000/api/health)

---

### Option 2: Run Separately in Two Terminals

**Terminal 1 (Backend API):**
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000`*

**Terminal 2 (Angular Frontend):**
```bash
cd frontend-angular
npm start
```
*Angular runs on `http://localhost:4200`*

---

### Option 3: Production Build
```bash
npm run build
```
Creates an optimized production bundle in `frontend-angular/dist/`.

---

## 🖥️ Views & Features in the Angular Application

### 1. 📊 Dashboard (`/`)
- Real-time occupancy percentage gauge, open tables count, active diners, and total expected daily covers.
- Today's upcoming reservations schedule and instant floor status chips.

### 2. 🪑 Table Floor Plan (`/tables`)
- Interactive 2D floor layout categorized by dining area (**Main Hall**, **Garden Patio**, **Rooftop Terrace**, **VIP Lounge**).
- Filter by capacity (**2-seater**, **4-seater**, **6-seater**, **8-seater**).
- **Interactive Table Detail Modal**: Click on any table to see its linked reservation, guest party, or change its status (Seat Walk-In, Mark Available, Maintenance).

### 3. 📅 Reservations Manager (`/reservations`)
- New Booking Modal with guest name, phone, party size, date, seating time, table assignment, and occasion.
- Real-time search by guest name or phone number.
- Status filters: `ALL`, `CONFIRMED`, `SEATED`, `COMPLETED`, `CANCELLED`.
- **Export Run Sheet (CSV)**: Generates and downloads a clean spreadsheet for the host stand.

### 4. ⏳ Walk-In Waitlist (`/waitlist`)
- Host intake queue for parties without pre-existing reservations.
- Tracks quoted wait minutes, party size, preferred section, and arrival time.
- 1-click **"Seat at Open Table"** finds an available table matching the party size and transitions them directly into seated diners.

### 5. 👥 Guest CRM & VIP Directory (`/guests`)
- Diner database tracking total visits, cumulative dining spend, and hospitality preferences.
- VIP guest badges and filter.
- Dietary restriction badges (Vegetarian, Gluten-Free, Halal, Nut Allergy, etc.).
- Direct "Book Table" action linked to reservations.

### 6. 📈 Floor Analytics & Live Array Operations Studio (`/analytics`)
- Dining section capacity breakdown with progress indicators.
- **Interactive Array Operations Studio**: Allows your teacher/evaluator to click `.filter()`, `.map()`, `.reduce()`, `.find()`, and `.sort()` buttons to execute pure TypeScript array transformations live against real restaurant data and inspect the exact JSON result!
- Academic comparison table explaining time-complexity and non-mutating pure functions.

---

## 🛠️ Technology Stack
- **Framework**: Angular 18+ (Standalone Components)
- **Language**: TypeScript 5.9+
- **Reactive Programming**: RxJS 7.8+ (`BehaviorSubject`, `Observable`, `async` pipe)
- **Forms**: Angular `FormsModule` with `[(ngModel)]`
- **Routing**: `@angular/router` with active link highlighting
- **Styling**: Modern CSS3 (Dark luxury slate & rose gold palette, CSS Grid, Flexbox)
- **Backend API**: Node.js, Express.js, CORS
- **Storage**: Persistent JSON database with sample dining records
