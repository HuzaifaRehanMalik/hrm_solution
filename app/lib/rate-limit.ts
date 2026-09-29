/**
 * Small in-memory fixed-window limiter.
 *
 * Best effort only: each server instance keeps its own counts, so on a
 * serverless host the real ceiling is `limit × instances`. It exists to blunt
 * floods cheaply, before any database work. Anything that must hold across
 * instances (the admin lockout, the contact form cap) is enforced in Postgres.
 */

type Window = { count: number; resetAt: number };

const MAX_KEYS = 10_000;

export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  const windows = new Map<string, Window>();

  return function allow(key: string): boolean {
    const now = Date.now();

    if (windows.size >= MAX_KEYS) {
      for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
      // Still full of live keys: someone is rotating identities. Start over
      // rather than grow without bound.
      if (windows.size >= MAX_KEYS) windows.clear();
    }

    const current = windows.get(key);
    if (!current || current.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    current.count += 1;
    return current.count <= limit;
  };
}
