import { Resend } from 'resend';
import * as z from 'zod';
import sanitizeHtml from 'sanitize-html';

const EmailMessage = z.object({
	name: z.string().transform((str) => sanitizeHtml(str)),
	subject: z.string().transform((str) => sanitizeHtml(str)),
	email: z.email(),
	message: z.string().transform((str) => sanitizeHtml(str)),
});

/**
 * @typedef {z.infer<typeof EmailMessage>} EmailMessageType
 */

/**
 * Send email with Resend.
 * @param {EmailMessageType} body Email message body
 * @returns {Promise<unknown>} Promise with a response from the Resend API
 */
export default async function sendEmail(body) {
	const { CONTACT_EMAIL, RESEND_API_KEY } = process.env;

	if (!CONTACT_EMAIL) {
		throw Error('No contact email...');
	}

	if (!RESEND_API_KEY) {
		throw Error('No Resend API key...');
	}

	const resend = new Resend(RESEND_API_KEY);

	try {
		const validatedBody = EmailMessage.parse(body);

		const mailOptions = {
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
