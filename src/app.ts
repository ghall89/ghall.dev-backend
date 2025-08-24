import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';

import dotenv from 'dotenv';

import sendEmail from './utils/send-email';

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
		windowMs: 10 * 60 * 1000, // 10 minutes
		limit: 5,
		keyGenerator: (c) => c,
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
