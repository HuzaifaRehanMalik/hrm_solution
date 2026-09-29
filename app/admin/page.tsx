import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/app/lib/auth";
import { getSql, rows, type Enquiry } from "@/app/lib/db";
import { setEnquiryStatus } from "@/app/admin/actions";
import AdminHeader from "./AdminHeader";
import DeleteEnquiryButton from "./DeleteEnquiryButton";
import ViewsChart, { type DailyViews } from "./ViewsChart";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

type Counts = {
  enquiries_total: string;
  enquiries_new: string;
  views_7d: string;
  views_30d: string;
};

type Ranked = { name: string | null; total: string };

const RANGES = [7, 15, 30] as const;
type Range = (typeof RANGES)[number];

const FILTERS = [
  { key: "new", label: "New" },
  { key: "accomplished", label: "Accomplished" },
  { key: "all", label: "All" },
] as const;
type Filter = (typeof FILTERS)[number]["key"];

function isAccomplished(status: string) {
  return status === "accomplished" || status === "handled";
}

function adminHref(filter: Filter, range: Range) {
  const params = new URLSearchParams();
  if (filter !== "new") params.set("filter", filter);
  if (range !== 30) params.set("range", String(range));
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Karachi",
});

export default async function AdminDashboard({
  searchParams,
}: PageProps<"/admin">) {
  const session = await requireAdmin();
  const params = await searchParams;
  const filter: Filter =
    params.filter === "all" || params.filter === "accomplished"
      ? params.filter
      : "new";
  const range: Range =
    RANGES.find((r) => String(r) === params.range) ?? 30;

  const sql = getSql();
  const [[counts], enquiries, topPages, topServices, daily] = await Promise.all([
    sql`
      select
        (select count(*) from enquiries) as enquiries_total,
        (select count(*) from enquiries where status = 'new') as enquiries_new,
        (select count(*) from analytics_events
          where type = 'page_view' and created_at > now() - interval '7 days') as views_7d,
        (select count(*) from analytics_events
          where type = 'page_view' and created_at > now() - interval '30 days') as views_30d
    `.then(rows<Counts>),
    (filter === "all"
      ? sql`select * from enquiries order by created_at desc limit 100`
      : filter === "accomplished"
        ? sql`select * from enquiries where status in ('accomplished', 'handled') order by created_at desc limit 100`
        : sql`select * from enquiries where status = 'new' order by created_at desc limit 100`
    ).then(rows<Enquiry>),
    sql`
      select path as name, count(*) as total from analytics_events
      where type = 'page_view' and created_at > now() - interval '30 days'
      group by path order by total desc limit 8
    `.then(rows<Ranked>),
    sql`
      select label as name, count(*) as total from analytics_events
      where type = 'service_click' and created_at > now() - interval '30 days'
      group by label order by total desc limit 8
    `.then(rows<Ranked>),
    // One row per day (Pakistan time), including days with zero views.
    sql`
      with days as (
        select generate_series(
          (now() at time zone 'Asia/Karachi')::date - ${range - 1}::int,
          (now() at time zone 'Asia/Karachi')::date,
          interval '1 day'
        )::date as day
      )
      select to_char(days.day, 'YYYY-MM-DD') as day, count(e.id) as total
      from days
      left join analytics_events e
        on e.type = 'page_view'
        and (e.created_at at time zone 'Asia/Karachi')::date = days.day
      group by days.day
      order by days.day
    `.then(rows<{ day: string; total: string }>),
  ]);

  const dailyViews: DailyViews[] = daily.map((d) => ({
    day: d.day,
    total: Number(d.total),
  }));
  const rangeTotal = dailyViews.reduce((sum, d) => sum + d.total, 0);

  const stats = [
    { label: "New enquiries", value: counts.enquiries_new, highlight: true },
    { label: "All enquiries", value: counts.enquiries_total },
    { label: "Page views · 7 days", value: counts.views_7d },
    { label: "Page views · 30 days", value: counts.views_30d },
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader email={session.email} current="dashboard" />

      <main id="main" tabIndex={-1} className="outline-none mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>

        <section
          aria-label="Summary"
          className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <p className="text-xs text-muted">{stat.label}</p>
              <p
                className={`mt-2 text-3xl font-semibold tabular-nums ${
                  stat.highlight ? "text-accent" : "text-foreground"
                }`}
              >
                {Number(stat.value).toLocaleString()}
              </p>
            </div>
          ))}
        </section>

        <section aria-labelledby="views-heading" className="card mt-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2
                id="views-heading"
                className="text-base font-semibold text-foreground"
              >
                Page views · last {range} days
              </h2>
              <p className="mt-1 text-sm text-muted">
                <span className="font-semibold tabular-nums text-foreground">
                  {rangeTotal.toLocaleString()}
                </span>{" "}
                total · {(rangeTotal / range).toFixed(1)} per day on average
              </p>
            </div>
            <div className="flex gap-1 rounded-sm border border-border p-1 text-sm">
              {RANGES.map((r) => (
                <Link
                  key={r}
                  href={adminHref(filter, r)}
                  scroll={false}
                  aria-current={range === r ? "page" : undefined}
                  className={`rounded-sm px-3 py-1.5 ${
                    range === r
                      ? "bg-surface-raised text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {r} days
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <ViewsChart data={dailyViews} />
          </div>
        </section>

        <section aria-labelledby="enquiries-heading" className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2
              id="enquiries-heading"
              className="text-lg font-semibold text-foreground"
            >
              Enquiries
            </h2>
            <div className="flex gap-1 rounded-sm border border-border p-1 text-sm">
              {FILTERS.map((f) => (
                <Link
                  key={f.key}
                  href={adminHref(f.key, range)}
                  scroll={false}
                  aria-current={filter === f.key ? "page" : undefined}
                  className={`rounded-sm px-3 py-1.5 ${
                    filter === f.key
                      ? "bg-surface-raised text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          {enquiries.length === 0 ? (
            <p className="card mt-4 p-6 text-sm text-muted">
              {filter === "all"
                ? "No enquiries yet. They'll appear here when someone uses the contact form."
                : filter === "accomplished"
                  ? "Nothing marked as accomplished yet."
                  : "You're all caught up. No new enquiries."}
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {enquiries.map((enquiry) => (
                <li key={enquiry.id} className="card p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {enquiry.name}
                        {enquiry.company ? (
                          <span className="text-muted"> · {enquiry.company}</span>
                        ) : null}
                      </p>
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="break-all text-sm text-accent underline-offset-4 hover:underline"
                      >
                        {enquiry.email}
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-sm px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${
                          enquiry.status === "new"
                            ? "bg-accent/15 text-accent"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {isAccomplished(enquiry.status) ? "✓ accomplished" : "new"}
                      </span>
                      <form action={setEnquiryStatus}>
                        <input type="hidden" name="id" value={enquiry.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={
                            isAccomplished(enquiry.status) ? "new" : "accomplished"
                          }
                        />
                        <button
                          type="submit"
                          aria-label={`${
                            isAccomplished(enquiry.status)
                              ? "Mark as new"
                              : "Mark accomplished"
                          }: message from ${enquiry.name}`}
                          className="rounded-sm border border-border-strong px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
                        >
                          {isAccomplished(enquiry.status)
                            ? "Mark as new"
                            : "Mark accomplished"}
                        </button>
                      </form>
                      <DeleteEnquiryButton
                        id={enquiry.id}
                        name={enquiry.name}
                      />
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {enquiry.message}
                  </p>

                  <p className="mt-4 text-xs text-muted">
                    {dateFormat.format(new Date(enquiry.created_at))}
                    {enquiry.referrer ? ` · from ${enquiry.referrer}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RankedList
            title="Top pages · 30 days"
            empty="No page views recorded yet."
            items={topPages}
          />
          <RankedList
            title="Service clicks · 30 days"
            empty="No service card clicks yet."
            items={topServices}
          />
        </div>
      </main>
    </div>
  );
}

function RankedList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: Ranked[];
}) {
  const max = Math.max(1, ...items.map((item) => Number(item.total)));

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.name ?? "(none)"}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-foreground">
                  {item.name || "(unknown)"}
                </span>
                <span className="tabular-nums text-muted">
                  {Number(item.total).toLocaleString()}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-none bg-surface-raised">
                <div
                  className="h-full rounded-none bg-accent"
                  style={{ width: `${(Number(item.total) / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
