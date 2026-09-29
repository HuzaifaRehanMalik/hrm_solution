import { neon } from "@neondatabase/serverless";

/**
 * Neon (Postgres) access for the site.
 *
 * DATABASE_URL comes from the Neon dashboard — use the *pooled* connection
 * string. See .env.example.
 */

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "DATABASE_URL is not set — copy .env.example to .env.local and add your Neon connection string.",
    );
    this.name = "DatabaseNotConfiguredError";
  }
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let client: ReturnType<typeof neon> | null = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DatabaseNotConfiguredError();
  if (!client) client = neon(url);
  return client;
}

/** "handled" is the older name for "accomplished" and is treated the same. */
export type EnquiryStatus = "new" | "accomplished" | "handled";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: EnquiryStatus;
  ip: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
};

export type AnalyticsEventType = "page_view" | "service_click";

/**
 * The Neon HTTP driver types its result loosely. Everything here uses the
 * default (rows-only) mode, so this narrows it in one place.
 */
export function rows<T>(result: unknown): T[] {
  return result as T[];
}
