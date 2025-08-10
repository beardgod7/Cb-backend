const buckets = new Map();

const MAX_TOKENS = 5; // Allow burst of 5 requests
const REFILL_RATE = 0.1; // 1 token every 10s

function leakyBucketLimiter(req, res, next) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.connection.remoteAddress ||
    "unknown";

  const now = Date.now() / 1000;
  const bucket = buckets.get(ip) || { tokens: MAX_TOKENS, lastRefill: now };

  const timeElapsed = now - bucket.lastRefill;
  const leakedTokens = timeElapsed * REFILL_RATE;
  const currentTokens = Math.min(MAX_TOKENS, bucket.tokens + leakedTokens);

  if (currentTokens < 1) {
    console.log(`⛔ BLOCKED IP ${ip}`);
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }

  buckets.set(ip, {
    tokens: currentTokens - 1,
    lastRefill: now,
  });

  console.log(`✅ ALLOWED IP ${ip} | Tokens Left: ${currentTokens.toFixed(2)}`);
  next();
}

module.exports = leakyBucketLimiter;
