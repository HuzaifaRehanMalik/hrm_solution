import { NextResponse } from "next/server";
import { services } from "@/app/data/site";
import { getSql } from "@/app/lib/db";
import { createRateLimiter } from "@/app/lib/rate-limit";
import {
  clientIp,
  isJson,
  isSameOrigin,
  readJsonObject,
} from "@/app/lib/request";

const SERVICE_TITLES = new Set(services.map((service) => service.title));
const MAX_BODY_BYTES = 2 * 1024;

// A visitor produces a page view and the odd service click; anything much
// beyond that is someone scripting the endpoint to skew the dashboard.
const allow = createRateLimiter({ limit: 30, windowMs: 60_000 });

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : null;
}

function cleanPath(value: unknown) {
  const path = clean(value, 300);
  return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}

function cleanReferrer(value: unknown) {
  const referrer = clean(value, 500);
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.protocol === "https:" || url.protocol === "http:"
      ? referrer
      : null;
  } catch {
    return null;
  }
}

const noContent = () => new NextResponse(null, { status: 204 });

/**
 * Analytics is best-effort: this route always answers 204 so a tracking
 * failure can never surface to a visitor or block the page.
 */
export async function POST(request: Request) {
  if (!isJson(request) || !isSameOrigin(request)) return noContent();
  if (!allow(clientIp(request) ?? "unknown")) return noContent();

  try {
    const body = await readJsonObject(request, MAX_BODY_BYTES);
    if (!body) return noContent();

    const type = body.type;
    const path = cleanPath(body.path);
    if (!path) return noContent();

    let label: string | null = null;
    if (type === "service_click") {
      label = clean(body.label, 200);
      if (!label || !SERVICE_TITLES.has(label)) return noContent();
    } else if (type !== "page_view") {
      return noContent();
    }

    await getSql()`
      insert into analytics_events (type, path, label, referrer, user_agent)
      values (
        ${type},
        ${path},
        ${label},
        ${cleanReferrer(body.referrer)},
        ${request.headers.get("user-agent")?.slice(0, 500) ?? null}
      )
    `;
  } catch (error) {
    console.error("Analytics event dropped:", error);
  }

  return noContent();
}
