import { NextResponse } from "next/server";
import { DatabaseNotConfiguredError, getSql } from "@/app/lib/db";
import { createRateLimiter } from "@/app/lib/rate-limit";
import {
  clientIp,
  isJson,
  isSameOrigin,
  readJsonObject,
} from "@/app/lib/request";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MINUTES = 10;
// Site-wide ceiling, so rotating IPs can't fill the inbox either.
const GLOBAL_LIMIT_MAX = 60;
const MAX_BODY_BYTES = 16 * 1024;

// Plain addresses only: no quotes, spaces, or the ?/& that would let a
// stored value add headers to the admin's mailto: link.
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const burstLimit = createRateLimiter({ limit: 10, windowMs: 60_000 });

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  // Forcing a JSON content type means a cross-site page can't post here
  // without a CORS preflight, which this route never approves.
  if (!isJson(request) || !isSameOrigin(request)) {
    return fail("Invalid request.", 400);
  }

  const ip = clientIp(request);
  if (!burstLimit(ip ?? "unknown")) {
    return fail("Too many requests. Please wait a minute and try again.", 429);
  }

  const body = await readJsonObject(request, MAX_BODY_BYTES);
  if (!body) return fail("Invalid request.", 400);

  // Bots fill hidden fields; humans do not. Look successful, store nothing.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160) || null;
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return fail("Name, email and a short message are required.", 400);
  }
  if (!EMAIL.test(email)) {
    return fail("That email address does not look right.", 400);
  }

  try {
    const sql = getSql();

    const [recent] = (await sql`
      select
        count(*) filter (where ip = ${ip})::int as from_ip,
        count(*)::int as total
      from enquiries
      where created_at > now() - make_interval(mins => ${RATE_LIMIT_MINUTES})
    `) as { from_ip: number; total: number }[];
    if (
      recent &&
      ((ip && recent.from_ip >= RATE_LIMIT_MAX) ||
        recent.total >= GLOBAL_LIMIT_MAX)
    ) {
      return fail(
        "You've sent several messages in a short time. Please wait a few minutes, or email us directly.",
        429,
      );
    }

    await sql`
      insert into enquiries (name, email, company, message, ip, user_agent, referrer)
      values (
        ${name},
        ${email},
        ${company},
        ${message},
        ${ip},
        ${request.headers.get("user-agent")?.slice(0, 500) ?? null},
        ${request.headers.get("referer")?.slice(0, 500) ?? null}
      )
    `;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      console.error(error.message);
      return fail(
        "The contact form is not connected to the database yet. Please email us directly in the meantime.",
        503,
      );
    }
    console.error("Could not save enquiry:", error);
    return fail("We could not save that just now. Please try again.", 502);
  }

  return NextResponse.json({ ok: true });
}
