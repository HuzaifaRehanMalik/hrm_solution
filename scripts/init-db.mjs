/**
 * Creates the tables this site needs in Neon. Safe to run repeatedly.
 *
 *   npm run db:init
 *
 * Reads DATABASE_URL from .env.local.
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Copy .env.example to .env.local, paste your Neon connection string, then run: npm run db:init",
  );
  process.exit(1);
}

const sql = neon(url);

const statements = [
  `create table if not exists enquiries (
     id          uuid primary key default gen_random_uuid(),
     name        text not null,
     email       text not null,
     company     text,
     message     text not null,
     status      text not null default 'new',
     ip          text,
     user_agent  text,
     referrer    text,
     created_at  timestamptz not null default now()
   )`,
  `create index if not exists enquiries_created_at_idx on enquiries (created_at desc)`,
  `create index if not exists enquiries_status_idx on enquiries (status)`,
  // "handled" was renamed to "accomplished".
  `update enquiries set status = 'accomplished' where status = 'handled'`,

  `create table if not exists analytics_events (
     id          bigserial primary key,
     type        text not null,
     path        text,
     label       text,
     referrer    text,
     user_agent  text,
     created_at  timestamptz not null default now()
   )`,
  `create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc)`,
  `create index if not exists analytics_events_type_idx on analytics_events (type, label)`,

  // Admin dashboard (/admin). Set the password with: npm run admin:password
  `create table if not exists admin_users (
     id                  bigserial primary key,
     email               text not null unique,
     password_hash       text not null,
     failed_attempts     integer not null default 0,
     locked_until        timestamptz,
     password_changed_at timestamptz not null default now(),
     created_at          timestamptz not null default now()
   )`,
  // The admin identity is fixed. The CHECK makes the database itself refuse
  // any other email, whether by UPDATE or by INSERTing a second admin.
  // Keep the address in sync with ADMIN_EMAIL in app/lib/auth.ts.
  `do $$ begin
     if not exists (
       select 1 from pg_constraint where conname = 'admin_users_fixed_email'
     ) then
       alter table admin_users add constraint admin_users_fixed_email
         check (email = 'rehanhuzaifa035@gmail.com');
     end if;
   end $$`,
  `create table if not exists admin_sessions (
     token_hash  text primary key,
     user_id     bigint not null references admin_users(id) on delete cascade,
     expires_at  timestamptz not null,
     created_at  timestamptz not null default now()
   )`,
];

try {
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log("Database ready: enquiries, analytics_events, admin_users, admin_sessions");
} catch (error) {
  console.error("Could not set up the database:", error.message);
  process.exit(1);
}
