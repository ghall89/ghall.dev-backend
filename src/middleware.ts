import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';

export function addMiddleware(app: Hono) {
	app.use(
		cors({
			origin:
				process.env.NODE_ENV === 'production' ? ['https://ghall.dev'] : '*',
		})
	);

	app.use(
		rateLimiter({
			windowMs: 30 * 60 * 1000, // 30 minutes
			limit: 3,
			keyGenerator: (c) => {
				const xfwd = c.req.header('x-forwarded-for');
				const ip = xfwd?.split(',')[0]?.trim() ?? '';
				return ip;
			},
		})
	);
}
