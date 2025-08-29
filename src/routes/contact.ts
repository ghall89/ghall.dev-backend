import { Hono } from 'hono';

import sendEmail from '../lib/send-email';

export const contactRouter = new Hono();

contactRouter.post('/contact', async (c) => {
	try {
		const body = await c.req.json();

		await sendEmail(body);
		return c.json({ success: true });
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to send email' }, 500);
	}
});
