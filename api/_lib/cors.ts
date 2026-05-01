import type { VercelResponse } from "@vercel/node";

/**
 * Allowed origins for CORS.
 *
 * In production, restrict to the actual frontend domain.
 * The ALLOWED_ORIGIN env var should be set to the production domain
 * (e.g., "https://agenticgov.vercel.app"). Falls back to allowing same-origin
 * only (no Access-Control-Allow-Origin header) when not configured.
 */
function getAllowedOrigin(requestOrigin: string | undefined): string | null {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  // If ALLOWED_ORIGIN is explicitly set, only allow that origin
  if (allowedOrigin) {
    if (requestOrigin === allowedOrigin) {
      return allowedOrigin;
    }
    return null;
  }

  // Development: allow localhost origins
  if (
    requestOrigin &&
    (requestOrigin.startsWith("http://localhost:") ||
      requestOrigin.startsWith("https://localhost:"))
  ) {
    return requestOrigin;
  }

  // Allow Vercel preview deployments scoped to this project only.
  // Set CORS_ALLOWED_VERCEL_PROJECT to the Vercel project slug (e.g. "uae-policy-ai-advisor")
  // so that only *.vercel.app origins containing that slug are accepted.
  const vercelSlug = process.env.CORS_ALLOWED_VERCEL_PROJECT;
  if (
    vercelSlug &&
    requestOrigin &&
    requestOrigin.endsWith(".vercel.app") &&
    requestOrigin.includes(vercelSlug)
  ) {
    return requestOrigin;
  }

  return null;
}

/**
 * Set CORS headers on the response.
 * Returns true if the origin is allowed, false if it should be rejected.
 */
export function setCorsHeaders(
  res: VercelResponse,
  requestOrigin: string | undefined
): boolean {
  const origin = getAllowedOrigin(requestOrigin);

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  return origin !== null;
}
