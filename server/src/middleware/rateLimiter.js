import { rateLimit } from 'express-rate-limit';

// The client polls generation status while a case is being built. A low IP-wide
// limit counts each poll and can block the next create request with a plain-text
// 429. Scope the API budget to the validated guest session and keep it above the
// maximum normal polling volume; case creation has its own stricter quota.
export const API_WINDOW_MS = 15 * 60 * 1000;
export const API_REQUEST_LIMIT = 600;

export function createApiRateLimit({ windowMs = API_WINDOW_MS, limit = API_REQUEST_LIMIT } = {}) {
  return rateLimit({
    windowMs,
    limit,
    keyGenerator: (req) => req.ownerSessionId,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => res.status(429).json({
      success: false,
      error: {
        code: 'API_RATE_LIMIT',
        message: 'This session has made too many requests. Please wait briefly and try again.'
      }
    })
  });
}

export const apiRateLimit = createApiRateLimit();
