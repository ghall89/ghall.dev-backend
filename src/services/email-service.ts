import nodemailer, { type Transporter } from 'nodemailer';
import { Request, Response } from 'express';

export default class EmailService {
	contactEmail: string | undefined;
	transporter: Transporter;

	constructor() {
		this.contactEmail = process.env.CONTACT_EMAIL;

		if (!this.contactEmail) {
			throw Error('No contact email...');
		}

		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT ?? 465,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
	}

	async sendEmail(req: Request, res: Response) {
		try {
			const { name, subject, email, message } = req.body;

			if (!name || !subject || !email || !message) {
				return res
					.status(400)
					.json({ status: 'error', message: 'Missing required fields' });
			}

			const mailOptions = {
				from: `${name} <${email}>`,
				to: this.contactEmail,
				replyTo: email,
				subject: subject,
				text: message,
			};

			const info = await this.transporter.sendMail(mailOptions);
			console.log('Email sent:', info.response);
			res
				.status(200)
				.json({ status: 'success', message: 'Email sent successfully' });
		} catch (error) {
			console.error('Error sending email:', error);
			res.status(500).json({
				status: 'error',
				message: 'Error sending email, please try again.',
			});
		}
	}
}
