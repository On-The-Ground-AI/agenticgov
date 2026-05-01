import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./lib/neon";
import { setCorsHeaders } from "./lib/cors";

/**
 * Public visitor counter for the AgenticGov landing page.
 *
 * GET  /api/visit  → returns { count }
 * POST /api/visit  → increments counter, returns { count }
 *
 * Backed by a tiny Neon table:
 *   create table if not exists site_visits (
 *     id integer primary key default 1,
 *     count bigint not null default 0,
 *     updated_at timestamptz not null default now(),
 *     check (id = 1)
 *   );
 *   insert into site_visits (id, count) values (1, 0) on conflict do nothing;
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const sql = getDb();

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

    if (req.method === "GET") {
      const rows = (await sql`select count from site_visits where id = 1`) as Array<{
        count: number | string;
      }>;
      const count = Number(rows[0]?.count ?? 0);
      return res.status(200).json({ count });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Soft-fail: return 0 so the UI doesn't break if the DB isn't configured yet.
    return res.status(200).json({ count: 0, error: message });
  }
}
