import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSql, rows } from "@/app/lib/db";

/**
 * Admin auth for the dashboard.
 *
 * - Exactly one admin: ADMIN_EMAIL. Any other email is rejected before the
 *   database is touched, and the session check re-verifies it every request.
 * - Passwords are hashed with scrypt (Node built-in, no extra packages).
 * - Sessions live in the `admin_sessions` table. The browser only holds a
 *   random token; the database stores its SHA-256, so a leaked table can't
 *   be replayed as a cookie.
 */

/**
 * The one admin identity. Deliberately a constant, not an env var or a
 * database setting: nothing in the app can change who the admin is. The
 * database enforces the same value with a CHECK constraint
 * (admin_users_fixed_email in scripts/init-db.mjs), and every admin query
 * below also filters on it.
 */
export const ADMIN_EMAIL = "rehanhuzaifa035@gmail.com";

export const SESSION_COOKIE = "hrm_admin";
const SESSION_DAYS = 7;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
export const MIN_PASSWORD_LENGTH = 12;
/** Caps the work an anonymous request can make scrypt do. */
export const MAX_PASSWORD_LENGTH = 256;

// ---------------------------------------------------------------------------
// Password hashing: "scrypt$N$r$p$salt$hash" (base64 salt and hash)
// ---------------------------------------------------------------------------

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

function scryptAsync(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: { N: number; r: number; p: number },
) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, n, r, p, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;

  const expected = Buffer.from(hashB64, "base64");
  const actual = await scryptAsync(
    password,
    Buffer.from(saltB64, "base64"),
    expected.length,
    { N: Number(n), r: Number(r), p: Number(p) },
  );
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// ---------------------------------------------------------------------------
// Credentials check with lockout
// ---------------------------------------------------------------------------

type AdminRow = {
  id: string;
  password_hash: string;
  failed_attempts: number;
};

export type LoginResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid" | "locked" };

// Burns roughly the same time as a real check so a wrong email
// can't be told apart from a wrong password by timing.
const DUMMY_HASH =
  "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==";

export async function checkCredentials(
  email: string,
  password: string,
): Promise<LoginResult> {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
    await verifyPassword(password, DUMMY_HASH);
    return { ok: false, reason: "invalid" };
  }

  const sql = getSql();

  // Reserve an attempt atomically *before* checking the password. Reading the
  // counter and writing it back afterwards would let parallel requests all see
  // the same count and get unlimited guesses past the lockout.
  const [admin] = rows<AdminRow>(
    await sql`
      update admin_users set failed_attempts = failed_attempts + 1
      where email = ${ADMIN_EMAIL}
        and (locked_until is null or locked_until <= now())
      returning id, password_hash, failed_attempts
    `,
  );

  if (!admin) {
    // Either there is no admin row yet, or the account is locked.
    const [existing] = rows<{ id: string }>(
      await sql`select id from admin_users where email = ${ADMIN_EMAIL}`,
    );
    if (existing) return { ok: false, reason: "locked" };
    await verifyPassword(password, DUMMY_HASH);
    return { ok: false, reason: "invalid" };
  }

  const lockAccount = () => sql`
    update admin_users set
      failed_attempts = 0,
      locked_until = now() + make_interval(mins => ${LOCK_MINUTES})
    where id = ${admin.id}
  `;

  // A burst of parallel requests past the limit never reaches scrypt.
  if (admin.failed_attempts > MAX_FAILED_ATTEMPTS) {
    await lockAccount();
    return { ok: false, reason: "locked" };
  }

  if (!(await verifyPassword(password, admin.password_hash))) {
    if (admin.failed_attempts >= MAX_FAILED_ATTEMPTS) {
      await lockAccount();
      return { ok: false, reason: "locked" };
    }
    return { ok: false, reason: "invalid" };
  }

  await sql`
    update admin_users set failed_attempts = 0, locked_until = null
    where id = ${admin.id}
  `;
  return { ok: true, userId: admin.id };
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  const sql = getSql();
  // Housekeeping: drop expired sessions while we're here.
  await sql`delete from admin_sessions where expires_at < now()`;
  await sql`
    insert into admin_sessions (token_hash, user_id, expires_at)
    values (${hashToken(token)}, ${userId}, ${expiresAt})
  `;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: expiresAt,
  });
}

export type AdminSession = {
  userId: string;
  email: string;
  tokenHash: string;
  passwordChangedAt: string;
};

export async function getSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  let session:
    | { user_id: string; email: string; password_changed_at: string }
    | undefined;
  try {
    [session] = rows<{
      user_id: string;
      email: string;
      password_changed_at: string;
    }>(
      await getSql()`
        select s.user_id, u.email, u.password_changed_at
        from admin_sessions s
        join admin_users u on u.id = s.user_id
        where s.token_hash = ${tokenHash}
          and s.expires_at > now()
          and u.email = ${ADMIN_EMAIL}
      `,
    );
  } catch (error) {
    // Database unreachable: treat as signed out so the login page still
    // loads (and explains the problem) instead of a 500.
    console.error("Admin session check failed:", error);
    return null;
  }

  if (!session || session.email !== ADMIN_EMAIL) return null;
  return {
    userId: session.user_id,
    email: session.email,
    tokenHash,
    passwordChangedAt: session.password_changed_at,
  };
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await getSql()`delete from admin_sessions where token_hash = ${hashToken(token)}`;
  }
  cookieStore.delete({ name: SESSION_COOKIE, path: "/admin" });
}

/** Signs out every other browser, e.g. after a password change. */
export async function destroyOtherSessions(session: AdminSession) {
  await getSql()`
    delete from admin_sessions
    where user_id = ${session.userId} and token_hash <> ${session.tokenHash}
  `;
}
