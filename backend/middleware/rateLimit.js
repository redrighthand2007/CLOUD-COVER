// Simple in-memory limiter for login, used to stop password guessing.
// Only FAILED attempts count, so an office sharing one internet connection
// is never blocked by its own successful logins. The window starts at the
// first failure; after `max` failures the IP must wait until it ends.
// (In memory: resets when the server restarts. Fine for one small server.)
function rateLimit({ windowMs, max, message }) {
    const failures = new Map();

    // Drop expired entries now and then so the map can't grow forever
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of failures) if (now > entry.resetAt) failures.delete(key);
    }, windowMs).unref();

    return (req, res, next) => {
        const now = Date.now();
        const key = req.ip;
        const entry = failures.get(key);

        if (entry && now <= entry.resetAt && entry.count >= max) {
            res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
            return res.status(429).json({ error: message });
        }

        res.on('finish', () => {
            if (res.statusCode !== 400 && res.statusCode !== 401) return;
            const current = failures.get(key);
            if (!current || Date.now() > current.resetAt) {
                failures.set(key, { count: 1, resetAt: Date.now() + windowMs });
            } else {
                current.count += 1;
            }
        });
        next();
    };
}

module.exports = { rateLimit };
