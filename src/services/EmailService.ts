import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

export class EmailService {
	private sesClient: SESClient
	private receiverEmail: string
	private senderEmail: string

	constructor(sesClient: SESClient, receiverEmail: string, senderEmail: string) {
		if (!sesClient || !receiverEmail || !senderEmail) {
			throw new Error('No SESClient, receiverEmail or senderEmail provided to EmailService')
		}

		this.sesClient = sesClient
		this.receiverEmail = receiverEmail
		this.senderEmail = senderEmail
	}

	/**
	 * Sends an email to the receiverEmail
	 * @param name - The name of the sender
	 * @param email - The email address of the sender
	 * @param subject - The subject of the email
	 * @param message - The message body of the email
	 */
	async forwardSupportEmail(name: string, email: string, subject: string, message: string): Promise<void> {
		const params = {
			Source: this.senderEmail,
			Destination: {
				ToAddresses: [this.receiverEmail]
			},
			Message: {
				Subject: {
					Charset: 'UTF-8',
					Data: `Support email from ${name} <${email}>`
				},
				Body: {
					Text: {
						Charset: 'UTF-8',
						Data: `A support email was received from ${name} <${email}> with the subject "${subject}". The email body was:\n\n${message}`
					}
				}
			}
		}

		try {
			await this.sesClient.send(new SendEmailCommand(params))
		} catch (error) {
			console.error(`EmailService failed to send email: ${error}`)
			throw new Error('EmailService failed to send email')
		}
	}
}
