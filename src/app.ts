import express, { type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import EmailService from './services/email-service';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const emailService = new EmailService();

// limit IP to 3 requests every 15 min
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 3,
});

app.use(express.json());
app.use(
	cors({
		origin: process.env.NODE_ENV === 'production' ? ['https://ghall.dev'] : '*',
		optionsSuccessStatus: 200,
	})
);
app.use(limiter);

app.post('/contact', async (req: Request, res: Response) => {
	try {
		const { body } = req;

		await emailService.sendEmail(body);
		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to send email' });
	}
});

app.get('/health', (_req: Request, res: Response) => {
	res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
