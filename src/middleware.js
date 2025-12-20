import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';

/**
 * Initialize cors and rateLimiter middlewares.
 *  @param {Hono} app Hono app
 */
export function addMiddleware(app) {
	app.use(
		cors({
			origin:
				process.env.NODE_ENV === 'production' ? ['https://ghall.dev'] : '*',
		})
	);

	app.use(
		rateLimiter({
			windowMs: 1 * 60 * 1000, // 1 minute
			limit: 3,
			keyGenerator: (c) => {
				const xfwd = c.req.header('x-forwarded-for');
				const ip = xfwd?.split(',')[0]?.trim() ?? '';
				return ip;
			},
		})
	);
}
