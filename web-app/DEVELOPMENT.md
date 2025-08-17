# JenGen.ai Development Guide

## Quick Start

### Recommended Development Commands

```bash
# Clean start (recommended)
npm run dev:clean

# Standard development server
npm run dev

# If you need Turbopack (may have chunk loading issues)
npm run dev:turbo

# Clean development script (automatic cleanup)
./dev-start.sh
```

## Common Issues & Solutions

### Chunk Loading Errors (404 errors in console)

**Symptoms:**
```
GET /_next/static/chunks/node_modules_next_dist_445d8acf._.js 404
GET /_next/static/chunks/[turbopack]_browser_dev_hmr-client_hmr-client_ts_6aaa83c7._.js 404
```

**Quick Fix:**
```bash
npm run dev:clean
```

**Manual Fix:**
```bash
npm run clean
npm run dev
```

**Script Fix:**
```bash
./dev-start.sh
```

### When to Use Each Development Mode

- **`npm run dev`** (Default - Recommended): Stable webpack mode, no chunk errors
- **`npm run dev:turbo`** (Fast but buggy): Turbopack mode, faster but may have 404 errors  
- **`npm run dev:clean`** (Clean start): Clears cache and starts fresh
- **`./dev-start.sh`** (Automated): Handles cleanup automatically

## Development URLs

- **Main Site**: http://localhost:3000/
- **Onboarding Flow**: http://localhost:3000/onboard

## Build Commands

```bash
# Standard build
npm run build

# Clean build (if build issues)
npm run build:clean
```

## Cache Management

```bash
# Clean all caches
npm run clean

# Clean and restart
npm run dev:clean
```

## Troubleshooting

### If development server won't start:
1. `npm run clean`
2. `npm run dev`

### If chunk loading errors persist:
1. Stop server (Ctrl+C)
2. `./dev-start.sh`

### If weird caching issues:
1. `npm run clean`
2. `rm -rf node_modules`
3. `npm install`
4. `npm run dev`

## Architecture

- **Frontend**: Next.js 15.4.6 with React 19
- **Styling**: CSS Modules with responsive design
- **Components**: Modular component architecture
- **Routing**: Next.js App Router

## Key Features

- **Landing Page**: Fully responsive with partners section
- **Onboarding Flow**: 3-step process (Personal Info → Interests → Plans)
- **Mobile First**: Responsive design across all breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support