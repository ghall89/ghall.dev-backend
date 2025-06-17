import nodemailer, { type Transporter } from 'nodemailer';

export default class EmailService {
	contactEmail: string | undefined;
	transporter: Transporter;

	constructor() {
		this.contactEmail = process.env.CONTACT_EMAIL;

		if (!this.contactEmail) {
			throw Error('No contact email...');
		}

		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST ?? '',
			port: 465,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
	}

	async sendEmail({
		name,
		subject,
		email,
		message,
	}: {
		name: string;
		subject: string;
		email: string;
		message: string;
	}) {
		try {
			if (!name || !subject || !email || !message) {
				throw Error('Missing required fields');
			}

			const mailOptions = {
				from: `${name} <${email}>`,
				to: this.contactEmail,
				replyTo: email,
				subject: subject,
				text: message,
			};

			return this.transporter.sendMail(mailOptions);
		} catch (error) {
			throw Error('Error sending email: ' + error);
		}
	}
}
