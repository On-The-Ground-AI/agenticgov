import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCorsHeaders } from "./_lib/cors";

/**
 * Public visitor counter for the AgenticGov landing page.
 *
 * GET  /api/visit  → returns { count }
 * POST /api/visit  → increments counter, returns { count }
 *
 * Backed by a tiny Neon table (auto-created on first call):
 *   create table if not exists site_visits (
 *     id integer primary key default 1,
 *     count bigint not null default 0,
 *     updated_at timestamptz not null default now(),
 *     check (id = 1)
 *   );
 *
 * If NEON_DATABASE_URL is not configured, returns { count: 0 } silently.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    return res.status(200).json({ count: 0, note: "counter disabled (no DB configured)" });
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);

    await sql`
      create table if not exists site_visits (
        id integer primary key default 1,
        count bigint not null default 0,
        updated_at timestamptz not null default now(),
        check (id = 1)
      )
    `;
    await sql`insert into site_visits (id, count) values (1, 0) on conflict (id) do nothing`;

    if (req.method === "POST") {
      const rows = (await sql`
        update site_visits
        set count = count + 1,
            updated_at = now()
        where id = 1
        returning count
      `) as Array<{ count: number | string }>;
      const count = Number(rows[0]?.count ?? 0);
      return res.status(200).json({ count });
    }

    const rows = (await sql`select count from site_visits where id = 1`) as Array<{
      count: number | string;
    }>;
    const count = Number(rows[0]?.count ?? 0);
    return res.status(200).json({ count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(200).json({ count: 0, error: message });
  }
}
