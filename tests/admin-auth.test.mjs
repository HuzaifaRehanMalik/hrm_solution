/**
 * Admin authentication tests. Local only: a throwaway Postgres in Docker,
 * never the real Neon database.
 *
 *   docker compose -f tests/docker-compose.yml up -d --wait
 *   npm run build
 *   npm run test:admin
 *
 * Everything goes over HTTP against `next start`, including direct server
 * action calls that skip the UI, so the checks exercise the same boundary an
 * attacker would. The admin password is random per run and never stored.
 */
import "./support/neon-local.mjs";
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { after, before, describe, test } from "node:test";
import { neon } from "@neondatabase/serverless";

const ADMIN = "rehanhuzaifa035@gmail.com";
const PORT = 3199;
const BASE = `http://localhost:${PORT}`;
// Deliberately ignores process.env.DATABASE_URL: only the local proxy is used.
const DATABASE_URL = "postgres://postgres:postgres@db.localtest.me:5432/main";
const PRELOAD = "--import=./tests/support/neon-local.mjs";
const sql = neon(DATABASE_URL);

let password = `local-${randomBytes(12).toString("hex")}`;
let server;

// ------------------------------------------------------------------ helpers

const env = { ...process.env, DATABASE_URL, NODE_OPTIONS: PRELOAD };

function setAdminPassword(value) {
  execFileSync(process.execPath, [PRELOAD, "scripts/set-admin-password.mjs", value], {
    env,
    stdio: "pipe",
  });
}

const actionIds = Object.fromEntries(
  Object.entries(
    JSON.parse(readFileSync(".next/server/server-reference-manifest.json", "utf8")).node,
  ).map(([id, entry]) => [entry.exportedName, id]),
);

/**
 * Calls a server action the way the React client does. `stateful` actions
 * (useActionState) take (prevState, formData); form actions take (formData).
 */
async function callAction(name, fields, { cookie, origin = BASE, path = "/admin", stateful } = {}) {
  const form = new FormData();
  // React decodes the body as a stream: the parts must come before the root
  // "0" that references them, as they do when the browser sends it.
  for (const [key, value] of Object.entries(fields)) form.set(`_1_${key}`, value);
  form.set("0", stateful ? '["$undefined","$K1"]' : '["$K1"]');
  const headers = { "Next-Action": actionIds[name], Accept: "text/x-component", Origin: origin };
  if (cookie) headers.Cookie = `hrm_admin=${cookie}`;
  const response = await fetch(BASE + path, { method: "POST", headers, body: form, redirect: "manual" });
  const token = response.headers
    .getSetCookie()
    .map((c) => /^hrm_admin=([^;]*)/.exec(c)?.[1])
    .find(Boolean);
  return { status: response.status, body: await response.text(), token };
}

const login = (email, pw) =>
  callAction("login", { email, password: pw }, { stateful: true, path: "/admin/login" });

const getAdmin = (path, cookie) =>
  fetch(BASE + path, {
    redirect: "manual",
    headers: cookie ? { Cookie: `hrm_admin=${cookie}` } : {},
  });

const resetLockout = () =>
  sql`update admin_users set failed_attempts = 0, locked_until = null`;

const adminRows = () => sql`select email from admin_users`;

// ------------------------------------------------------------------- setup

before(async () => {
  execFileSync(process.execPath, [PRELOAD, "scripts/init-db.mjs"], { env, stdio: "pipe" });
  setAdminPassword(password);

  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
    env,
    stdio: "ignore",
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE + "/admin/login")).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("next start did not come up; run `npm run build` first");
});

after(async () => {
  server?.kill();
  await resetLockout();
});

// ------------------------------------------------------------------- tests

describe("fixed admin identity", () => {
  test("the identity is a constant in code, script and database", () => {
    const auth = readFileSync("app/lib/auth.ts", "utf8");
    assert.match(auth, /export const ADMIN_EMAIL = "rehanhuzaifa035@gmail\.com";/);
    assert.doesNotMatch(auth, /ADMIN_EMAIL\s*=\s*process\.env/);
    assert.match(readFileSync("scripts/set-admin-password.mjs", "utf8"), /const ADMIN_EMAIL = "rehanhuzaifa035@gmail\.com";/);
    assert.match(readFileSync("scripts/init-db.mjs", "utf8"), /check \(email = 'rehanhuzaifa035@gmail\.com'\)/);
  });

  test("the database refuses to change the admin email", async () => {
    await assert.rejects(
      sql`update admin_users set email = 'attacker@example.com'`,
      /admin_users_fixed_email/,
    );
    await assert.rejects(
      sql`insert into admin_users (email, password_hash) values ('attacker@example.com', 'x')`,
      /admin_users_fixed_email/,
    );
    assert.deepEqual(await adminRows(), [{ email: ADMIN }]);
  });

  test("no server action exists for changing the email", () => {
    assert.deepEqual(
      Object.keys(actionIds).sort(),
      ["changePassword", "deleteEnquiry", "login", "logout", "setEnquiryStatus"],
    );
  });
});

describe("login", () => {
  before(resetLockout);

  test("the admin can sign in and reach /admin", async () => {
    const { token } = await login(ADMIN, password);
    assert.ok(token, "session cookie issued");
    const page = await getAdmin("/admin", token);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Dashboard/);
  });

  test("email matching ignores case and surrounding spaces", async () => {
    const { token } = await login("  RehanHuzaifa035@Gmail.com ", password);
    assert.ok(token);
  });

  test("a wrong password is rejected", async () => {
    const result = await login(ADMIN, "not-the-password");
    assert.equal(result.token, undefined);
    assert.match(result.body, /Incorrect email or password/);
    await resetLockout();
  });

  test("another email cannot sign in, even with the right password", async () => {
    const result = await login("attacker@example.com", password);
    assert.equal(result.token, undefined);
    assert.match(result.body, /Incorrect email or password/);
  });
});

describe("authorization and sessions", () => {
  test("unauthenticated requests to admin pages go to the login page", async () => {
    for (const path of ["/admin", "/admin/password", "/admin?filter=all"]) {
      const response = await getAdmin(path);
      assert.equal(response.status, 307, path);
      assert.match(response.headers.get("location"), /\/admin\/login$/);
    }
  });

  test("a forged session cookie is rejected", async () => {
    const response = await getAdmin("/admin", randomBytes(32).toString("base64url"));
    assert.equal(response.status, 307);
  });

  test("an expired session is rejected", async () => {
    const token = randomBytes(32).toString("base64url");
    const hash = createHash("sha256").update(token).digest("hex");
    await sql`
      insert into admin_sessions (token_hash, user_id, expires_at)
      select ${hash}, id, now() - interval '1 minute' from admin_users`;
    assert.equal((await getAdmin("/admin", token)).status, 307);
  });

  test("sessions are stored hashed, never as the cookie value", async () => {
    const { token } = await login(ADMIN, password);
    const hash = createHash("sha256").update(token).digest("hex");
    assert.equal((await sql`select 1 from admin_sessions where token_hash = ${token}`).length, 0);
    assert.equal((await sql`select 1 from admin_sessions where token_hash = ${hash}`).length, 1);
  });

  test("admin actions without a session change nothing", async () => {
    const [row] = await sql`
      insert into enquiries (name, email, message) values ('Test', 't@test.dev', 'hello')
      returning id`;
    await callAction("deleteEnquiry", { id: row.id });
    await callAction("setEnquiryStatus", { id: row.id, status: "accomplished" });
    const [after] = await sql`select status from enquiries where id = ${row.id}`;
    assert.equal(after?.status, "new");
    await sql`delete from enquiries where id = ${row.id}`;
  });

  test("a cross-origin server action is refused even with a valid session", async () => {
    const { token } = await login(ADMIN, password);
    const [row] = await sql`
      insert into enquiries (name, email, message) values ('Test', 't@test.dev', 'hello')
      returning id`;
    const result = await callAction("deleteEnquiry", { id: row.id }, { cookie: token, origin: "https://evil.example" });
    assert.ok(result.status >= 400, `status ${result.status}`);
    assert.equal((await sql`select 1 from enquiries where id = ${row.id}`).length, 1);
    await sql`delete from enquiries where id = ${row.id}`;
  });

  test("logging out deletes the session, so the old cookie stops working", async () => {
    const { token } = await login(ADMIN, password);
    assert.equal((await getAdmin("/admin", token)).status, 200);
    await callAction("logout", {}, { cookie: token });
    assert.equal((await getAdmin("/admin", token)).status, 307);
    const hash = createHash("sha256").update(token).digest("hex");
    assert.equal((await sql`select 1 from admin_sessions where token_hash = ${hash}`).length, 0);
  });
});

describe("the admin email cannot be changed", () => {
  test("the admin panel has no email field", async () => {
    const { token } = await login(ADMIN, password);
    for (const path of ["/admin", "/admin/password"]) {
      const html = await (await getAdmin(path, token)).text();
      assert.doesNotMatch(html, /<input[^>]*name="[^"]*email/i, path);
    }
  });

  test("an email smuggled into changePassword is ignored", async () => {
    const { token } = await login(ADMIN, password);
    const next = `local-${randomBytes(12).toString("hex")}`;
    const result = await callAction(
      "changePassword",
      { current: password, next, confirm: next, email: "attacker@example.com" },
      { cookie: token, stateful: true, path: "/admin/password" },
    );
    assert.match(result.body, /Password updated/);
    password = next;
    assert.deepEqual(await adminRows(), [{ email: ADMIN }]);
  });

  test("an email smuggled into other actions is ignored", async () => {
    const { token } = await login(ADMIN, password);
    const [row] = await sql`
      insert into enquiries (name, email, message) values ('Test', 't@test.dev', 'hello')
      returning id`;
    await callAction(
      "setEnquiryStatus",
      { id: row.id, status: "accomplished", email: "attacker@example.com" },
      { cookie: token },
    );
    assert.equal((await sql`select status from enquiries where id = ${row.id}`)[0].status, "accomplished");
    assert.deepEqual(await adminRows(), [{ email: ADMIN }]);
    await sql`delete from enquiries where id = ${row.id}`;
  });
});

describe("lockout", () => {
  test("five wrong passwords lock the account, even for the right password", async () => {
    await resetLockout();
    const messages = [];
    for (let i = 0; i < 5; i++) messages.push((await login(ADMIN, `wrong-${i}`)).body);
    assert.equal(messages.filter((m) => /Incorrect email or password/.test(m)).length, 4);
    assert.match(messages[4], /Too many failed attempts/);

    const blocked = await login(ADMIN, password);
    assert.equal(blocked.token, undefined);
    assert.match(blocked.body, /Too many failed attempts/);
  });

  test("the account unlocks once the lock period has passed", async () => {
    // Move the lock into the past instead of waiting 15 minutes.
    await sql`update admin_users set locked_until = now() - interval '1 second'`;
    const { token } = await login(ADMIN, password);
    assert.ok(token);
    const [row] = await sql`select failed_attempts, locked_until from admin_users`;
    assert.equal(row.failed_attempts, 0);
    assert.equal(row.locked_until, null);
  });

  test("parallel wrong passwords cannot get past the limit", async () => {
    await resetLockout();
    const results = await Promise.all(
      Array.from({ length: 20 }, (_, i) => login(ADMIN, `parallel-${i}`)),
    );
    const checked = results.filter((r) => /Incorrect email or password/.test(r.body)).length;
    assert.ok(checked <= 4, `${checked} guesses were password-checked`);
    const [row] = await sql`select locked_until > now() as locked from admin_users`;
    assert.equal(row.locked, true);
    assert.match((await login(ADMIN, password)).body, /Too many failed attempts/);
    await resetLockout();
  });
});
