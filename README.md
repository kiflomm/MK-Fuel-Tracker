# Frontend - Mekelle Fuel Tracker

Next.js frontend for the Fuel Monitor platform. It now includes:

- A marketing landing page at `/`
- Authentication flows:
  - `/sign-in`
  - `/forgot-password`
  - `/reset-password`
- Protected application area under `/app` with role-based redirect placeholders

## Prerequisites

- Node.js 20+
- Backend API running and reachable from the frontend

## Environment Variables

Create `.env.local` in the `frontend` directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_BASE_URL` should point to the backend service that exposes `/auth/*`.
For cookie-based refresh/logout to work, backend CORS and cookie settings must allow your frontend origin.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Auth Integration Notes

- Access token is handled in client auth state after login/refresh.
- Refresh/logout depend on `httpOnly` refresh cookie, so requests use `credentials: include`.
- Session bootstrap attempts refresh on app load; if refresh fails, user remains logged out.
- `/app` is protected client-side and redirects users by role:
  - `GOVERNMENT_ADMIN` -> `/app/admin`
  - `STATION_MANAGER` -> `/app/station-manager`
  - `STATION_WORKER` -> `/app/station-worker`
  - `VEHICLE_OWNER` -> `/app/owner`

## Manual QA Checklist

- Landing page loads and CTA links work.
- Sign in succeeds with valid credentials.
- Sign in shows error for invalid credentials.
- Forgot password flow submits successfully.
- Reset code verification + password reset works.
- Reloading a protected route restores session via refresh.
- Sign out clears session and redirects to sign-in.

## Scripts

- `pnpm dev` - Run development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Notes

You may see existing lint errors in generated/shared UI files unrelated to the auth/landing implementation.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)

