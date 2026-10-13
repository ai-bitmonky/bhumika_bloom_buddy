# BloomBuddy — web app

BloomBuddy is professional in-home plant care plus Smart Drop-off "plant hotel" hubs in Delhi NCR. This repo is the
Next.js 15 (App Router, TypeScript) web app, ported from the v1.0 HTML prototypes. It is **one site with two layouts**:

| Viewport | What you get |
| --- | --- |
| **≥ 900px** (laptops, desktops) | The BloomBuddy **website**: Home, Home Visits, Smart Drop-off, Plans & Pricing, Plant Care, For Business, Track booking, with a 5-step booking modal and an optional OTP log-in. |
| **< 900px** (phones, small tablets) | The BloomBuddy **app layout**: full-viewport (100dvh, safe-area aware), bottom tab bar with a raised Book button, screen-stack navigation with slide transitions, and bottom sheets. No drawn phone frame. |

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-check + lint included)
npm run start    # serve the production build
npm run lint
```

Deploys as a plain Next.js app (e.g. Vercel via its GitHub app). No extra config needed.
Fonts (Fraunces + DM Sans) load through `next/font/google`, so the build machine needs access to Google Fonts.

## How the 900px breakpoint works

Every route renders `<Responsive>` (`components/shared/Responsive.tsx`):

- The desktop website is server-rendered inside `.bb-desktop`.
- `.bb-mobile` holds the app. CSS in `styles/globals.css` shows exactly one of them
  (`@media (max-width: 899.98px)`), so the first paint is always the right layout: no flash and no hydration mismatch.
- The app is client-only (`next/dynamic`, `ssr: false`). It mounts only when `useIsMobile()`
  (`lib/useMediaQuery.ts`, built on `useSyncExternalStore`) reports a small viewport. If you resize across 900px,
  the page switches layouts live.

## Routes

| URL | ≥ 900px | < 900px |
| --- | --- | --- |
| `/` | Home | App Home |
| `/visits`, `/dropoff` | Website pages | Booking flow (visit / drop-off preselected) |
| `/plans`, `/business` | Website pages | App Home |
| `/care` | Plant Care | Care tab |
| `/track`, `/track/report` | Booking tracking | Live tracking / report card + rating |
| `/m/plants`, `/m/plants/:id`, `/m/plants/add` | Home | My Plants / plant detail / add plants |
| `/m/book/service`, `…/schedule`, `…/details`, `…/payment`, `…/confirmed` | redirects to `/visits` | Booking steps |
| `/m/care/diagnose`, `/m/hubs/:id`, `/m/profile` | nearest website page | Diagnose camera / hub detail / profile |
| `/m/welcome`, `/m/sign-in`, `/m/sign-in/plant-parent` | Home | Optional onboarding + sign-in |

Each app screen has a real URL. Browser back/forward, refresh and shared links keep you on the same screen.
App state such as plants, the booking draft and the guest name is kept in `sessionStorage`.

## No login required

- Every feature works as a guest: booking, diagnosis, the plans quiz, forms, tracking, rating, My Plants and Profile.
- On the website, **Log in** is an optional button. On small screens the app opens straight on Home ("Namaste, plant parent").
  Sign-up is reachable from Profile → *Sign in / Create account* or a dismissible Home banner.
- OTP is never mandatory. Each OTP step has *Continue without OTP* / *Skip for now*. A phone number alone, or nothing at all,
  is enough. If you do enter a code, any 4 digits work.

## Installable (PWA)

`public/manifest.webmanifest` sets standalone display, `start_url: "/"` and brand theme/background colours.
It includes 192/512 (+ maskable) icons rendered from the logo. The layout also sets
`theme-color` for light and dark, `apple-mobile-web-app-capable`, an `apple-touch-icon` and `viewport-fit=cover`.

## Structure

```
app/                     layout.tsx (fonts, metadata, theme init), page.tsx (/), (desktop)/* pages, m/[[...screen]]
components/desktop/      Shell, Nav, Footer, Modals (booking / login / tips), widgets, one file per page
components/mobile/       MobileApp (tab bar, sheets), MobileContext (URL router + state), Screen, screens/*
components/shared/       Sprite (all SVG art), Icon/PlantArt/Avatar, Button, Chip, Stepper, BeforeAfter,
                         Polaroid, QR, Toast, ThemeToggle, Reveal, Responsive
lib/                     data.ts (DATA + MDATA content), booking.tsx (pricing + booking context), theme.tsx,
                         useMediaQuery.ts, qr.ts, motion.ts
styles/                  tokens.css (light + dark tokens), globals.css, desktop.css, mobile.css
```

The theme is light or dark. It follows `prefers-color-scheme` until the visitor picks one, and that choice is saved in `localStorage`.
An inline script applies it before first paint. All motion respects `prefers-reduced-motion`.
