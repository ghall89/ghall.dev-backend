import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import dotenv from 'dotenv';

import EmailService from './services/email-service';
import { EmailMessage } from './types';

dotenv.config();

const app = new Hono();
const PORT = process.env.PORT || 3000;

const emailService = new EmailService();

app.use(
	cors({
		origin: process.env.NODE_ENV === 'production' ? ['https://ghall.dev'] : '*',
	})
);

app.post('/contact', async (c) => {
	try {
		const body = await c.req.json();

		console.log('Received email:', body);

		await emailService.sendEmail(body);
		return c.json({ success: true });
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to send email' }, 500);
	}
});

app.get('/health', (c) => c.json({ status: 'OK' }));

export default app;
