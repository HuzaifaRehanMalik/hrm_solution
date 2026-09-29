/**
 * Sets (or resets) the admin password from your terminal.
 * Use it if you forget the password or get locked out.
 *
 *   npm run admin:password -- "your new password"
 *
 * Reads DATABASE_URL from .env.local. Signs out every browser.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const ADMIN_EMAIL = "rehanhuzaifa035@gmail.com"; // keep in sync with app/lib/auth.ts
const MIN_LENGTH = 12; // keep in sync with MIN_PASSWORD_LENGTH in app/lib/auth.ts

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set in .env.local.");
  process.exit(1);
}

const password = process.argv[2];
if (!password || password.length < MIN_LENGTH) {
  console.error(
    `Usage: npm run admin:password -- "new password"  (at least ${MIN_LENGTH} characters)`,
  );
  process.exit(1);
}

const [N, r, p] = [16384, 8, 1];
const salt = randomBytes(16);
const key = scryptSync(password, salt, 64, { N, r, p });
const hash = ["scrypt", N, r, p, salt.toString("base64"), key.toString("base64")].join("$");

const sql = neon(url);

try {
  const [admin] = await sql`
    insert into admin_users (email, password_hash)
    values (${ADMIN_EMAIL}, ${hash})
    on conflict (email) do update set
      password_hash = excluded.password_hash,
      failed_attempts = 0,
      locked_until = null,
      password_changed_at = now()
    returning id
  `;
  await sql`delete from admin_sessions where user_id = ${admin.id}`;
  console.log(`Admin password set for ${ADMIN_EMAIL}. Sign in at /admin/login`);
} catch (error) {
  console.error("Could not set the password:", error.message);
  console.error("Run `npm run db:init` first if the admin tables don't exist.");
  process.exit(1);
}
