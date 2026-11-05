# 🏥 Doctor Tracker — Admin Dashboard Client (`doctorTrackerAdmin`)

> High-performance clinical administrative interface built with Next.js 15 (App Router), React 19, Tailwind CSS with fluid viewport `calc()` typography, and zero-dependency SVG data visualizations.

## Quick Start
```bash
# Install dependencies
npm install

# Setup local environment
cp .env.example .env.local

# Run development server
npm run dev

# Run lint & production build
npm run lint
npm run build
```

## Key Technologies & Architectural Decisions
- **Next.js 15.2 (App Router)**: Fast Server-Side Rendering (SSR) and static prerendering across all routes with sub-142kB initial bundles.
- **React 19**: Concurrent rendering and modern hook architecture.
- **Zero-Dependency SVG Charts**: Recharts/Chart.js were replaced with custom mathematical SVG charts to avoid bundle bloat and React 19 hydration issues.
- **Fluid Tailwind CSS**: Custom viewport `calc()` system ensuring zero text wrapping, zero button clipping, and flawless mobile responsiveness.
- **Lucide React**: Scalable, lightweight SVG icon system.

*For complete architecture, endpoints, and setup instructions, refer to the [Root README](../README.md).*
