import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';

import dotenv from 'dotenv';

import sendEmail from './lib/send-email';

dotenv.config();

const app = new Hono();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: process.env.NODE_ENV === 'production' ? ['https://ghall.dev'] : '*',
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

app.post('/contact', async (c) => {
	try {
		const body = await c.req.json();

		await sendEmail(body);
		return c.json({ success: true });
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to send email' }, 500);
	}
});

app.get('/health', (c) => c.json({ status: 'OK' }));

export default app;
