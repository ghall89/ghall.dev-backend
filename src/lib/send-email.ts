import nodemailer, { type Transporter } from 'nodemailer';
import * as z from 'zod';
import sanitizeHtml from 'sanitize-html';

const EmailMessage = z.object({
	name: z.string().transform((str) => sanitizeHtml(str)),
	subject: z.string().transform((str) => sanitizeHtml(str)),
	email: z.email(),
	message: z.string().transform((str) => sanitizeHtml(str)),
});

type EmailMessageType = z.infer<typeof EmailMessage>;

export default async function sendEmail(body: EmailMessageType) {
	const contactEmail = process.env.CONTACT_EMAIL;

	if (!contactEmail) {
		throw Error('No contact email...');
	}

	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST ?? '',
		port: 465,
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	try {
		const validatedBody = EmailMessage.parse(body);

		const mailOptions = {
			from: `${validatedBody.name} <${validatedBody.email}>`,
			to: contactEmail,
			replyTo: validatedBody.email,
			subject: validatedBody.subject,
			text: validatedBody.message,
		};

		return transporter.sendMail(mailOptions);
	} catch (error) {
		throw Error('Error sending email: ' + error);
	}
}
