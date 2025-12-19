import { Resend, type CreateEmailOptions } from 'resend';
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
	const { CONTACT_EMAIL, RESEND_API_KEY } = process.env;

	if (!CONTACT_EMAIL) {
		throw Error('No contact email...');
	}

	if (!CONTACT_EMAIL) {
		throw Error('No Resend API key...');
	}

	const resend = new Resend(RESEND_API_KEY);

	try {
		const validatedBody = EmailMessage.parse(body);

		const mailOptions: CreateEmailOptions = {
			from: `${validatedBody.name} <${CONTACT_EMAIL}>`,
			to: CONTACT_EMAIL,
			replyTo: validatedBody.email,
			subject: validatedBody.subject,
			text: validatedBody.message,
		};

		return resend.emails.send(mailOptions);
	} catch (error) {
		throw Error('Error sending email: ' + error);
	}
}
