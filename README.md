# 🏥 Doctor Tracker — Frontend Administration Client

> **Enterprise-grade clinical administrative dashboard built for hospital operations, physician roster tracking, and patient workload management.**  
> Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS** with fluid viewport `calc()` typography, and zero-dependency mathematical SVG data visualizations.

---

## 📑 Table of Contents
1. [Frontend Overview](#-frontend-overview)
2. [Why Each Frontend Technology Was Chosen (প্রযুক্তিসমূহের যৌক্তিকতা)](#-why-each-frontend-technology-was-chosen-প্রযুক্তিসমূহের-যৌক্তিকতা)
3. [Architecture & Modular Directory Structure](#-architecture--modular-directory-structure)
4. [Zero-Dependency SVG Charting Engine](#-zero-dependency-svg-charting-engine)
5. [Fluid Viewport Responsive Design System (`calc`)](#-fluid-viewport-responsive-design-system-calc)
6. [Core Pages & Module Breakdown](#-core-pages--module-breakdown)
7. [Interactive UI Components & Ergonomics](#-interactive-ui-components--ergonomics)
8. [Installation & Setup Guide](#-installation--setup-guide)
9. [Build Performance & Code Quality](#-build-performance--code-quality)

---

## 🌟 Frontend Overview

The **Doctor Tracker Admin Client** is engineered for clinical directors, hospital administrators, and triage coordinators. Built entirely without mock data, it connects directly to the Node.js/Express REST API with stateless JWT session handling, reactive multi-criteria filters, and smooth micro-animations.

### Key Highlights:
- **Zero-Dependency SVG Analytics**: Custom mathematical SVG charts (`admissions-trend-chart.jsx` & `patients-per-doctor-chart.jsx`) deliver interactive hover tooltips, animated entrance curves, and zero hydration errors on React 19.
- **Fluid Viewport Mathematics**: Uses CSS `calc((X/375)*100vw)` on mobile and `calc((Y/1920)*100vw)` on widescreen displays, guaranteeing zero horizontal scroll and zero text wrapping across all viewports.
- **Strict Modular Pattern**: Domain separation where every feature is divided into `utils/`, `components/`, and an orchestrating `[feature]-view.jsx`.
- **Role-Based UI Guards**: Adapts views, action menus, and edit privileges based on the authenticated administrator's permission level (`superAdmin`, `admin`, `viewer`).
- **Clinical Archival Auditing**: Integrated toggle views for `Active Inpatients` vs. `Archived Records` and `Active Doctors` vs. `Archived Doctors` with single-click restoration.

---

## 💡 Why Each Frontend Technology Was Chosen (প্রযুক্তিসমূহের যৌক্তিকতা)

| Package / Technology | Version | Why It Was Chosen (কেন ব্যবহার করা হয়েছে) |
| :--- | :---: | :--- |
| **Next.js (App Router)** | `15.2.x` | Hybrid Server-Side Rendering (SSR) & Static Site Generation (SSG) for ultra-fast initial page loads; file-system based modular routing (`/`, `/doctors`, `/patients`, `/access`, `/login`); automatic route code splitting keeping First Load JS under **142 kB**. |
| **React** | `19.0.x` | Latest concurrent rendering features, instant state updates without layout thrashing, improved hook ergonomics (`useMemo`, `useCallback`, `useRef`), and seamless hydration. |
| **Tailwind CSS** | `3.4.x` | Utility-first CSS allowing fluid typography via CSS `calc()`. Eliminates rigid media-query jumps and guarantees pixel-perfect rendering across standard breakpoints (`sm`, `md`, `lg`, `xl`) down to narrow 320px mobile screens. |
| **Zero-Dependency SVG Charts** | Native SVG | **Recharts and Chart.js were intentionally bypassed** because they bloat bundles by 150kB+, trigger peer-dependency conflicts with React 19, and cause SSR hydration mismatches. Pure mathematical SVG charts provide 100% reliable rendering, zero dependencies, and smooth Bézier curves. |
| **clsx + tailwind-merge (`cn`)**| `2.1.x / 3.0.x` | Safely combines conditional class names and resolves Tailwind CSS class specificity conflicts dynamically. |
| **lucide-react** | `0.488.x` | Lightweight, tree-shakable SVG icon set with consistent visual language (`Stethoscope`, `Activity`, `HeartPulse`, `ShieldCheck`, `Eye`, `EyeOff`, etc.). Negligible bundle footprint compared to heavy icon font packs. |
| **@radix-ui/react-slot** | `1.1.x` | Enables polymorphic component composition (e.g. `Button` rendering as a child anchor link without HTML wrapper pollution). |
| **tailwindcss-animate** | `1.0.x` | Lightweight CSS animation utilities for smooth modal fade-ins, sliding drawers, and dropdown reveals. |

---

## 🏗 Architecture & Modular Directory Structure

The project follows a clean **domain-driven modular architecture**:

```
doctorTrackerAdmin/src/
├── app/                        # Next.js 15 App Router pages & layouts
│   ├── access/page.jsx         # Access Control & Staff Management
│   ├── doctors/page.jsx        # Specialist Directory & Roster Management
│   ├── login/page.jsx          # Secure Portal Authentication
│   ├── patients/page.jsx       # Inpatient & Outpatient Clinical Registry
│   ├── layout.jsx              # Root application layout with fonts & metadata
│   ├── page.jsx                # Healthcare Operations Dashboard (Home)
│   └── globals.css             # Tailwind design tokens, fluid calc utilities
├── components/                 # Shared cross-module UI widgets
│   ├── doctors/                # Doctor modals (add, detail, delete)
│   ├── layout/                 # Global layout primitives
│   │   ├── dashboard-layout.jsx# Responsive sidebar wrapper
│   │   ├── navbar.jsx          # Sticky top navigation bar
│   │   ├── notification-dropdown.jsx # Real-time notification center
│   │   └── sidebar.jsx         # Responsive collapsible navigation
│   └── ui/                     # Primitive reusable UI components
│       ├── badge.jsx           # Clinical severity & status badges
│       ├── button.jsx          # Accessible button with loading states
│       ├── card.jsx            # Elevation container cards
│       ├── custom-date-picker.jsx # Calendar range picker
│       ├── custom-select.jsx   # Accessible high-z-index select dropdown
│       ├── input.jsx           # Text inputs with icon slots
│       ├── skeleton.jsx        # Loading state skeleton placeholders
│       └── table.jsx           # Responsive clinical data table
├── modules/                    # Feature domains (Modular Architecture)
│   ├── access/                 # Staff permissions & access request workflow
│   ├── auth/                   # Authentication forms, password toggles & validation
│   ├── dashboard/              # KPI cards, SVG trend charts, workload charts
│   ├── doctors/                # Doctor table, filter pills, patient assignment
│   └── patients/               # Patient table, multi-criteria filter grid, action menu
├── services/                   # Isolated API service layer (fetch wrappers)
│   ├── accessService.js        # Staff role changes, request approvals
│   ├── analyticsService.js     # Dashboard parallel aggregation fetcher
│   ├── authService.js          # Login, token storage, session management
│   ├── doctorService.js        # Doctor CRUD & assigned patient calls
│   └── patientService.js       # Patient CRUD, date filters & archival toggles
└── utils/                      # Authentication helpers, token readers & formatters
```

### Modular Pattern in Action
Every domain module (`dashboard`, `doctors`, `patients`, `access`, `auth`) follows the 3-tier convention:
```
module/
├── utils/              # Pure logic, validators, SVG math, catalog constants
├── components/         # Reusable presentation and interactive widgets
└── [module]-view.jsx   # Clean declarative orchestrator
```

---

## 📈 Zero-Dependency SVG Charting Engine

Traditional charting libraries (Chart.js, Recharts) introduce heavy runtime bundles (150kB+), trigger peer-dependency warnings on React 19, and frequently cause SSR hydration mismatches. 

**Doctor Tracker solves this with mathematically pure, zero-dependency SVG charts:**

### 1. 30-Day Admissions Trend Chart (`admissions-trend-chart.jsx`)
- **Mathematical Bézier Curves**: Constructs cubic Bézier path strings (`M... C...`) from daily admission timestamps and volume counts.
- **Gradient Fill Area**: Renders a semi-transparent linear gradient fill beneath the curve (`url(#trendGradient)`).
- **Interactive Inspection**: Real-time crosshair indicator and floating tooltip detailing date, admissions count, and percentage change.
- **Responsive Width**: Scales continuously using `viewBox="0 0 1000 320"` with `preserveAspectRatio="none"`.

### 2. Specialist Workload Distribution Chart (`patients-per-doctor-chart.jsx`)
- **Dynamic Bar Heights**: Automatically normalizes patient counts against the maximum workload specialist.
- **Clinical Threshold Indication**: Color-coded gradients highlight specialists operating near capacity limits.
- **Interactive Tooltips**: Hovering any bar reveals physician name, specialty, and active inpatient count.

---

## 📱 Fluid Viewport Responsive Design System (`calc`)

Instead of jarring jumps across standard media queries, Doctor Tracker utilizes **continuous fluid scaling**:

- **Mobile Viewports (< 640px)**: 
  Scales relative to standard 375px mobile dimensions using:
  ```css
  font-size: calc((X / 375) * 100vw);
  padding: calc((Y / 375) * 100vw);
  height: calc((Z / 375) * 100vw);
  ```
- **Widescreen Displays (lg / 1920px)**:
  Scales relative to 1920px resolution using:
  ```css
  font-size: calc((X / 1920) * 100vw);
  padding: calc((Y / 1920) * 100vw);
  ```

### Responsive Bugs Prevented:
1. **Zero Text Wrapping on Mode Tabs**: Buttons use responsive labels (`Admin Sign In` / `Request Access` on `< sm`, full labels on `sm+`) so they never wrap into multiple awkward lines on small screens.
2. **Zero Button Overflow**: Long submit button labels are responsively shortened on mobile (`Submit Access Request`) to prevent text clipping at container edges.
3. **No Horizontal Scroll**: Parent layouts use `overflow-x: clip`, allowing sticky navigation to remain active without triggering horizontal scrollbars.

---

## 🖥 Core Pages & Module Breakdown

### 1. Healthcare Operations Dashboard (`/`)
- **Executive KPI Cards**: Real-time counts of Total Doctors, Total Patients, Average Workload per Specialist, and Active Diagnoses.
- **Hospital Ward Capacity**: Real-time clinical alert status with non-wrapping department pill badges.
- **Specialist Workload Distribution**: SVG bar chart displaying patient distribution per specialist.
- **30-Day Admissions Trend**: Interactive SVG area chart tracking chronological patient flow.
- **Pathology & Condition Distribution**: Visual progress breakdown of top diagnoses.

### 2. Specialist Registry (`/doctors`)
- **Curated USA Specialist Roster**: Profiles with verified portraits, hospital affiliations, consultation fees, and available days.
- **Registry Mode Toggle**: Switch between `Active Doctors`, `Archived Doctors`, and `All Doctors`.
- **Specialty Filter Pills**: Horizontal scrollable pills for instantaneous filtering across medical specialties.
- **Doctor Patients Drawer**: Dedicated drawer allowing administrators to inspect all patients assigned to a specific doctor, assign new patients directly, or remove patient cases.

### 3. Patient Management (`/patients`)
- **Full Clinical CRUD**: Register new patients, edit medical information, and safely archive records.
- **Multi-Parameter Filter Grid**: Search bar, diagnosis select dropdown, triage care status selector (`Active`, `Under Observation`, `Recovered`, `Critical`), and custom admission date range picker.
- **Audit-Compliant Archival View**: Toggle between `Active Inpatients`, `Archived Records`, and `All Patient History` with single-click restoration.
- **Clinical Action Menu**: Modal inspection of patient charts with full treatment notes and emergency contacts.

### 4. Access Control & Team Management (`/access`)
- **Staff Roster Table**: Shows administrator accounts, emails, permission levels, departments, and active statuses.
- **Interactive Role Switcher**: Custom high z-index accessible dropdown (`z-[999]`) to update roles (`superAdmin`, `admin`, `viewer`) in real time.
- **Pending Access Requests**: Review and approve portal membership applications submitted via the login screen.
- **Add Staff Modal**: Register new clinical administrators with predetermined privilege tiers.

### 5. Portal Authentication & Access Requests (`/login`)
- **Administrator Sign In**: Official email and password authentication with immediate JWT issuance.
- **Request Access / Join**: Public membership application allowing clinical staff to apply for portal access with administrator verification.
- **Password Eye Toggle**: Interactive SVG `Eye`/`EyeOff` toggle built cleanly inside input fields with fluid `calc()` sizing.

---

## 🎯 Interactive UI Components & Ergonomics

1. **Sticky Header Navigation (`navbar.jsx`)**:
   - Uses `sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs`.
   - Connected with `overflow-x: clip` in root layouts, ensuring the navbar remains permanently pinned while scrolling.
2. **Centered Notifications Center (`notification-dropdown.jsx`)**:
   - On mobile/tablet screens, opens perfectly centered with a semi-transparent dismiss backdrop.
   - Live unread notification count badge, category icons, timestamps, and mark-all-read action.
3. **Administrator Profile Dropdown (`navbar.jsx`)**:
   - Displays logged-in administrator name, email, department, and active permission badge.
   - Dedicated red Logout button with complete session token cleanup and redirect to `/login`.
4. **Accessible Custom Select (`custom-select.jsx`)**:
   - Replaces native OS selects with fully styled, high z-index (`z-[999]`) dropdowns with outside-click dismiss listeners.

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (verified on Node 20 & 22)
- **Doctor Tracker Backend Server** running on `https://shakib-ant-doctor-tracker-server.vercel.app` (or local `http://localhost:5000`)

### 2. Setup Steps
```bash
# 1. Enter frontend directory
cd doctorTrackerAdmin

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Verify API URL in .env.local:
# NEXT_PUBLIC_API_URL=https://shakib-ant-doctor-tracker-server.vercel.app/api/employeeApp
```

### 3. Run Development Server
```bash
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

### 4. Production Build & Linting
```bash
# Check code quality (ESLint)
npm run lint

# Compile optimized production build
npm run build

# Start production server
npm run start
```

### 5. Default Administrator Credentials
- **URL**: `http://localhost:3000/login`
- **Email**: `admin@doctortracker.com`
- **Password**: `Password@123`
- **Role**: `superAdmin`

---

## ⚡ Build Performance & Code Quality

### Next.js Production Build Output
```
Route (app)                                 Size  First Load JS
┌ ○ /                                    13.1 kB         137 kB
├ ○ /_not-found                            977 B         102 kB
├ ○ /access                              8.55 kB         133 kB
├ ○ /doctors                             12.1 kB         141 kB
├ ○ /icon.svg                                0 B            0 B
├ ○ /login                               6.83 kB         119 kB
└ ○ /patients                            13.6 kB         142 kB
+ First Load JS shared by all             101 kB
```
- **0 ESLint Warnings, 0 Errors**: Passes `npm run lint` cleanly.
- **100% Static Prerendered**: All administrative routes are compiled as static pages with dynamic client-side hydration.
- **Sub-142 kB First Load JS**: Superfast page loads on mobile cellular networks.

---

### 💙 Maintained by
**Doctor Tracker Frontend Engineering Team**
