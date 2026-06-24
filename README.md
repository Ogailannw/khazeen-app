# Khazeen — Pharmacy Solutions (prototype)

A single-page React app: pharmacy stock, dispensing, clinical governance and
store operations for a multi-camp setting. This is a front-end prototype —
all data is in-memory (it resets on refresh). A real backend (Supabase) makes
it persistent and live; see the separate backend starter kit.

## Run it locally

You need **Node.js 18+** installed (https://nodejs.org).

```bash
# 1. install dependencies (first time only)
npm install

# 2. start the app
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Sign in (demo)

- Pick a role on the sign-in screen.
- Password for every role: **khazeen**
- The small gear (bottom-right of sign-in) is the Admin sign-in.
- Management has a second step: choose Main management or Sub-management.

## Build for sharing / deployment

```bash
npm run build      # creates a "dist/" folder of static files
npm run preview    # preview the production build locally
```

The `dist/` folder can be hosted on any static host (Vercel, Netlify, or your
own server). For a quick shareable link, connect this folder/repo to Vercel or
Netlify and they build it automatically.

## Project structure

```
khazeen-app/
├── index.html            # HTML entry point
├── package.json          # dependencies & scripts
├── vite.config.js        # build config
└── src/
    ├── main.jsx          # mounts the app into the page
    └── KhazeenApp.jsx     # the entire application (one file)
```

## Notes

- Libraries used: react, react-dom, recharts (charts), lucide-react (icons).
- Everything lives in `src/KhazeenApp.jsx`.
- In-memory only: notes, posts, logs, passwords etc. reset on page refresh.
