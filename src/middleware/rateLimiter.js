const rateLimitMap = new Map(); 

module.exports = function rateLimiter (req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const WINDOW_TIME = 60 * 1000; 
  const MAX_REQUESTS = 5;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip).filter(ts => now - ts < WINDOW_TIME);
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length > MAX_REQUESTS) {
    return res.status(429).json({ message: "Too many requests, please slow down." });
  }

  next();
};
