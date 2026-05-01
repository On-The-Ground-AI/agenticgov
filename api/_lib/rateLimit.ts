import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Simple in-memory rate limiter for Vercel serverless functions.
 *
 * Note: In-memory storage is per-instance and resets on cold starts.
 * For production with strict rate limiting, use Redis or Vercel KV.
 * This implementation provides basic protection against abuse.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  keyPrefix?: string;    // Optional prefix for the key
}

// In-memory store (per serverless instance)
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60000; // 1 minute

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key);
    }
  }
}

/**
 * Get a unique identifier for the request.
 * Uses IP address, falling back to user ID if available.
 */
function getRequestKey(req: VercelRequest, userId?: string): string {
  // Try to get IP from various headers
  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string"
    ? forwarded.split(",")[0].trim()
    : req.headers["x-real-ip"] as string || "unknown";

  // If we have a user ID, use that for more accurate limiting
  if (userId) {
    return `user:${userId}`;
  }

  return `ip:${ip}`;
}

/**
 * Check if a request is rate limited.
 * Returns true if the request should be blocked.
 */
export function isRateLimited(
  req: VercelRequest,
  config: RateLimitConfig,
  userId?: string
): { limited: boolean; remaining: number; resetTime: number } {
  cleanup();

  const key = `${config.keyPrefix || "rl"}:${getRequestKey(req, userId)}`;
  const now = Date.now();

  let entry = store.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    store.set(key, entry);

    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit middleware that can be used in API handlers.
 * Returns a function that checks rate limits and sends 429 if exceeded.
 */
export function rateLimitMiddleware(config: RateLimitConfig) {
  return function checkRateLimit(
    req: VercelRequest,
    res: VercelResponse,
    userId?: string
  ): boolean {
    const result = isRateLimited(req, config, userId);

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", config.maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
    res.setHeader("X-RateLimit-Reset", Math.ceil(result.resetTime / 1000).toString());

    if (result.limited) {
      res.setHeader("Retry-After", Math.ceil((result.resetTime - Date.now()) / 1000).toString());
      res.status(429).json({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      });
      return true; // Request was blocked
    }

    return false; // Request allowed
  };
}

/**
 * Pre-configured rate limiters for different endpoint types.
 */
export const rateLimits = {
  // Standard API endpoints (60 requests per minute)
  standard: rateLimitMiddleware({
    windowMs: 60 * 1000,
    maxRequests: 60,
    keyPrefix: "std",
  }),

  // AI endpoints (slower, more expensive - 20 per minute)
  ai: rateLimitMiddleware({
    windowMs: 60 * 1000,
    maxRequests: 20,
    keyPrefix: "ai",
  }),

  // Auth endpoints (prevent brute force - 10 per minute)
  auth: rateLimitMiddleware({
    windowMs: 60 * 1000,
    maxRequests: 10,
    keyPrefix: "auth",
  }),

  // Waitlist signup (very limited - 5 per hour per IP)
  waitlist: rateLimitMiddleware({
    windowMs: 60 * 60 * 1000,
    maxRequests: 5,
    keyPrefix: "wl",
  }),

  // Feedback submission (limited - 10 per hour)
  feedback: rateLimitMiddleware({
    windowMs: 60 * 60 * 1000,
    maxRequests: 10,
    keyPrefix: "fb",
  }),
};

/**
 * Helper to apply rate limiting in an API handler.
 *
 * Usage:
 * ```ts
 * import { applyRateLimit, rateLimits } from "./lib/rateLimit.js";
 *
 * export default async function handler(req, res) {
 *   if (applyRateLimit(rateLimits.ai, req, res)) return;
 *   // ... rest of handler
 * }
 * ```
 */
export function applyRateLimit(
  limiter: ReturnType<typeof rateLimitMiddleware>,
  req: VercelRequest,
  res: VercelResponse,
  userId?: string
): boolean {
  return limiter(req, res, userId);
}
