/** Fire-and-forget analytics. Never throws, never blocks the UI. */
export function track(
  type: "page_view" | "service_click",
  extra: { label?: string } = {},
) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    type,
    path: window.location.pathname,
    referrer: document.referrer || null,
    ...extra,
  });

  try {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/track", blob)) return;
  } catch {
    // fall through to fetch
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

/** Fired when a visitor clicks a service card, so the form can pre-fill. */
export const SERVICE_SELECT_EVENT = "hrm:service-select";
