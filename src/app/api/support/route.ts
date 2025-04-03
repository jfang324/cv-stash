import { getEmailService, handleError, validateSupportEmailFormData } from '@/lib/apiUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const EmailService = await getEmailService()
		const body = await request.json()

		const { name, email, subject, message } = validateSupportEmailFormData(body)

		await EmailService.forwardSupportEmail(name, email, subject, message)

		return NextResponse.json({ message: 'Support email sent successfully' }, { status: 200 })
	} catch (error) {
		return handleError(error, 'Error forwarding support email')
	}
}
