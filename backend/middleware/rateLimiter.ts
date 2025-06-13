import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    details: {
      retryAfter: 900, // 15 minutes in seconds
    },
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// More strict limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    message: 'Too many login attempts, please try again later.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    details: {
      retryAfter: 3600, // 1 hour in seconds
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
