# AuraBistro | Multi-Frontend Restaurant Reservation & Table Management System

A production-grade, enterprise restaurant management system with **two full frontend implementations (React JS and Angular)** connected to a shared **Node.js / Express REST API Backend**.

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
├── frontend-react/                # ⚛️ React 18 + Vite Frontend Application (Port 3000)
│   ├── public/                    # Assets & icons
│   ├── src/
│   │   ├── components/            # Reusable functional components
│   │   │   ├── common/            # Navbar, Sidebar, Modal, Badge, Toast, StatsCard
│   │   │   ├── converter/         # HTML-to-JSX Converter & Cheatsheet
│   │   │   ├── reservations/      # ReservationCard, Form, List, Filters
│   │   │   └── tables/            # FloorPlan (2D), TableCard, TableGrid, TableTimeline
│   │   ├── context/               # RestaurantContext (Context API + React Hooks)
│   │   ├── hooks/                 # useRestaurant custom hook
│   │   ├── pages/                 # Dashboard, Tables, Reservations, Waitlist, Guests, Analytics, Converter
│   │   ├── services/              # api.js (Frontend-to-Backend REST client with fallback)
│   │   ├── styles/                # CSS Variables, index.css, CSS Modules
│   │   ├── utils/                 # Audio synthesizer, CSV export, HTML-to-JSX regex engine
│   │   ├── App.jsx                # Router & root modals
│   │   └── main.jsx               # React 18 root bootstrap
│   ├── index.html                 # HTML template with Google Fonts
│   ├── package.json               # React dependencies & scripts
│   └── vite.config.js             # Vite configuration with proxy to Port 5000
│
├── frontend-angular/              # 🅰️ Angular 18/21 Frontend Application (Port 4200)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # NavbarComponent, SidebarComponent
│   │   │   ├── models/            # Table, Reservation, Waitlist, Metrics TypeScript interfaces
│   │   │   ├── pages/             # Dashboard, Tables, Reservations, Waitlist, Analytics
│   │   │   ├── services/          # RestaurantService (HttpClient, RxJS Observables)
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
├── .env                           # Environment configuration
├── .env.example
├── package.json                   # Root orchestrator with concurrently scripts
└── README.md                      # Comprehensive documentation
```

---

## 🚀 How to Run the Applications

### 1. Run React Frontend + Backend Together (Port 3000 + 5000)
```bash
npm run dev:react
# or
npm start
```
- **React App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### 2. Run Angular Frontend + Backend Together (Port 4200 + 5000)
```bash
npm run dev:angular
```
- **Angular App**: [http://localhost:4200](http://localhost:4200)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### 3. Run All Three (Backend + React + Angular) Simultaneously
```bash
npm run dev:all
```
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **React App**: [http://localhost:3000](http://localhost:3000)
- **Angular App**: [http://localhost:4200](http://localhost:4200)

---

### 4. Run Directly from Individual Folders

#### Backend:
```bash
cd backend
npm start
```

#### React Frontend:
```bash
cd frontend-react
npm start
```

#### Angular Frontend:
```bash
cd frontend-angular
npm start
```

---

## ⚖️ React JS vs Angular Implementation Comparison

| Feature | `frontend-react` (React JS) | `frontend-angular` (Angular) |
| :--- | :--- | :--- |
| **Component Architecture** | Functional Components (`Navbar.jsx`, `TableCard.jsx`) | Standalone Components (`@Component`, TypeScript classes) |
| **Templating Syntax** | **JSX** (`className`, `htmlFor`, `{isOpen && ...}`) | **Angular HTML Templates** (`*ngIf`, `*ngFor`, `(click)`) |
| **State Management** | **React Hooks** (`useState`, `useEffect`, `useContext`) | **RxJS Observables** (`BehaviorSubject`, `Observable`) |
| **Dependency Injection** | React Context API (`RestaurantContext`, `useRestaurant`) | Angular Dependency Injection (`inject(RestaurantService)`) |
| **Routing** | `react-router-dom` (`<Routes>`, `<Route>`, `<NavLink>`) | `@angular/router` (`provideRouter`, `routerLink`, `router-outlet`) |
| **Data Fetching** | Fetch API with custom service client (`api.js`) | Angular `HttpClient` with RxJS pipes |

---

## 📡 Shared Backend REST API Endpoints (`backend/`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & service health check |
| `GET` | `/api/tables` | Get all dining tables (filters: `?section=...&status=...&minCapacity=...`) |
| `POST` | `/api/tables` | Add custom table (number, capacity, section, shape) |
| `PUT` | `/api/tables/:id/status` | Update table status (`available`, `occupied`, `reserved`, `maintenance`) |
| `GET` | `/api/reservations` | Get all reservations (filters: `?status=...&date=...&search=...`) |
| `POST` | `/api/reservations` | Create reservation & allocate table |
| `PUT` | `/api/reservations/:id` | Update reservation details |
| `PUT` | `/api/reservations/:id/seat` | Seat guest party at table (`occupied`) |
| `PUT` | `/api/reservations/:id/complete` | Complete dining session & free table (`available`) |
| `DELETE`| `/api/reservations/:id` | Cancel reservation & release table hold |
| `GET` | `/api/waitlist` | Get walk-in queue |
| `POST` | `/api/waitlist` | Add walk-in diner with quoted wait time |
| `POST` | `/api/waitlist/:id/seat` | Seat waitlist party at open table |
| `DELETE`| `/api/waitlist/:id` | Remove from waitlist |
| `GET` | `/api/analytics` | Occupancy rates, party distributions, total covers |
| `POST` | `/api/reset` | Reset database back to pristine initial demo seeds |

---

## 📜 License
MIT License. Developed for Full-Stack Restaurant Reservation & Table Management demonstration.
