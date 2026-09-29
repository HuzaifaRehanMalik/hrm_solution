# HRM Solution — company website

Marketing site for HRM Solution: AI agents, workflow automation, internal tools
and custom software for businesses.

Built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS v4.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Database (Neon)

Contact enquiries and page analytics are stored in [Neon](https://neon.tech)
Postgres, through the `@neondatabase/serverless` HTTP driver — no connection
pooling to manage on Vercel.

1. Create a Neon project and copy the **pooled** connection string.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
3. Create the tables:

```bash
npm run db:init
```

The script is idempotent — run it again any time.

### Tables

| Table | Holds |
| --- | --- |
| `enquiries` | Contact form submissions: name, email, company, message, status (`new` / `accomplished`), IP, user agent, referrer, timestamp. |
| `analytics_events` | `page_view` rows and `service_click` rows (`label` is the service name), with path, referrer, user agent and timestamp. |

Without `DATABASE_URL` the site still builds and renders. The contact form
returns a clear "not connected yet" message rather than losing the enquiry
silently, and analytics events are dropped without affecting the page.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Required. Neon pooled connection string. The only external service this site talks to. |

On Vercel, add it under **Project → Settings → Environment Variables**.

## Admin dashboard

`/admin` shows enquiries (mark accomplished, delete) and page-view analytics.
There is exactly one admin account, the email in `app/lib/auth.ts`.

```bash
npm run admin:password -- "a long new password"   # set or reset it (12+ chars)
```

Resetting from the terminal also clears a lockout and signs out every browser.

How it is protected:

- Every admin page and server action calls `requireAdmin()`; sessions are
  random tokens stored hashed in `admin_sessions` (7 days, `HttpOnly`,
  `SameSite=Lax`, `Secure` in production). Sign-out deletes the session row.
- 5 wrong passwords lock the account for 15 minutes. Attempts are counted
  atomically, so parallel requests can't bypass the limit. Note that anyone
  who knows the admin email can trigger the lockout on purpose; the reset
  command above is the way back in.
- `proxy.ts` gives `/admin` a strict nonce-based Content Security Policy and
  refuses cross-site POSTs; `next.config.ts` sets the other security headers.

## Security notes for deployment

- `/api/contact` and `/api/track` only accept same-origin `application/json`
  requests with small bodies. The contact form allows 5 messages per IP and
  60 site-wide per 10 minutes; client IPs come from `x-real-ip` /
  `x-forwarded-for`, which Vercel sets. When self-hosting, make sure your
  reverse proxy overwrites those headers.
- Per-instance in-memory limits (`app/lib/rate-limit.ts`) are a first line
  only. For stronger guarantees add platform rate limiting (e.g. Vercel
  Firewall rules on `/api/*` and `/admin/login`).

## Editing content

Almost all copy lives in `app/data/site.ts` — services, process steps,
benefits, navigation and contact details. Change it there rather than in the
components.

Brand assets: `public/logo-full.png` (lockup used in the navbar and footer),
`public/hero-mark.png` (large icon in the hero), `public/logo-mark.png`, and
`app/icon.png` / `app/apple-icon.png` / `app/favicon.ico` for browser tabs.

## Structure

```
app/
  admin/                 dashboard, login, change password, server actions
  api/contact/route.ts   saves an enquiry to Neon
  api/track/route.ts     records page views and service clicks
  components/            Navbar, Hero, Services, Process, WhyUs, Contact, Footer
  data/site.ts           all site copy and config
  lib/auth.ts            admin sessions, password hashing, lockout
  lib/db.ts              Neon client and row types
  lib/track.ts           client-side analytics helper
  globals.css            brand tokens and card/aurora utilities
proxy.ts                 strict CSP for /admin
scripts/init-db.mjs      creates the tables (npm run db:init)
public/hero-mark.png     logo mark used in the hero
```
