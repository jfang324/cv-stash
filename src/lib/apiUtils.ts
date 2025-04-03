import { auth0 } from '@/lib/auth0'
import connectToDb from '@/lib/mongoConnection'
import getS3Client from '@/lib/s3'
import getSESClient from '@/lib/ses'
import { MongoJobApplicationRepository } from '@/repositories/MongoJobApplicationRepository'
import { MongoResumeRepository } from '@/repositories/MongoResumeRepository'
import { MongoUserRepository } from '@/repositories/MongoUserRepository'
import { EmailService } from '@/services/EmailService'
import { JobApplicationService } from '@/services/JobApplicationService'
import { ResumeService } from '@/services/ResumeService'
import { UserService } from '@/services/UserService'
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/types/Errors'
import { JobApplicationFormFields } from '@/types/JobApplicationFormFields'
import type { Resume } from '@/types/Resume'
import { NextResponse } from 'next/server'

/**
 * Validates the session and gets the user
 * @param requiredFields - An array of required fields in the user object
 * @returns The user object
 */
export const validateSessionAndGetUser = async (requiredFields: string[]) => {
	const session = await auth0.getSession()
	if (!session) {
		throw new UnauthorizedError('Not Authenticated')
	}

	const user = session.user
	if (!user || !requiredFields.every((field) => user[field])) {
		throw new BadRequestError('Invalid user details', 422)
	}

	return user
}

/**
 * Validates the request body for a support email
 * @param body - The request body object
 * @returns The validated request body
 */
export const validateSupportEmailFormData = (body: {
	name: string
	email: string
	subject: string
	message: string
}) => {
	const { name, email, subject, message } = body

	if (!name || !email || !subject || !message) {
		throw new BadRequestError('Invalid request body', 400)
	}

	return { name, email, subject, message }
}

/**
 * Gets the UserService instance
 * @returns The UserService instance
 */
export const getUserService = async () => {
	const connection = await connectToDb()
	const userRepository = new MongoUserRepository(connection)

	return new UserService(userRepository)
}

/**
 * Gets the ResumeService instance
 * @returns The ResumeService instance
 */
export const getResumeService = async () => {
	const connection = await connectToDb()
	const resumeRepository = new MongoResumeRepository(connection)
	const s3Client = getS3Client()

	return new ResumeService(resumeRepository, s3Client)
}

/**
 * Gets the JobApplicationService instance
 * @returns The JobApplicationService instance
 */
export const getJobApplicationService = async () => {
	const connection = await connectToDb()
	const jobApplicationRepository = new MongoJobApplicationRepository(connection)

	return new JobApplicationService(jobApplicationRepository)
}

/**
 * Gets the EmailService instance
 * @returns The EmailService instance
 */
export const getEmailService = async () => {
	const sesClient = getSESClient()
	const receiverEmail = process.env.SES_RECEIVER_EMAIL
	const senderEmail = process.env.SES_SENDER_EMAIL

	if (!receiverEmail || !senderEmail) {
		throw new Error('AWS credentials or support email address is not set')
	}

	return new EmailService(sesClient, receiverEmail, senderEmail)
}

/**
 * Handles errors thrown by the API
 * @param error - The error object
 * @param loggingMessage - Prefix for the error message
 * @returns The error response
 */
export const handleError = (error: unknown, loggingMessage: string) => {
	let statusCode = 500
	let errorMessage = 'Internal Server Error'

	if (error instanceof NotFoundError || error instanceof UnauthorizedError || error instanceof BadRequestError) {
		statusCode = error.status
		errorMessage = error.message
	} else if (error instanceof Error) {
		errorMessage = error.message
	}

	console.error(`${loggingMessage}:: ${errorMessage}`)
	return NextResponse.json({ error: errorMessage }, { status: statusCode })
}

/**
 * Validates the form data for a resume
 * @param formData - The form data object
 * @returns An object containing the resume file, name, and text content
 */
export const validateResumeFormData = (formData: FormData) => {
	const resumeFile = formData.get('file')
	const resumeName = formData.get('name') as string
	const textContent = formData.get('text') as string

	if (!resumeFile || !(resumeFile instanceof File) || resumeFile.type !== 'application/pdf') {
		throw new BadRequestError('No PDF provided', 400)
	}

	if (!resumeName) {
		throw new BadRequestError('No resume name provided', 400)
	}

	if (!textContent) {
		throw new BadRequestError('Text content may be parsed incorrectly', 400)
	}

	return { resumeFile, resumeName, textContent }
}

/**
 * Validates the job application form data
 * @param body - The response body from the client
 * @returns The validated job application form data
 */
export const validateJobApplicationFormData = (body: JobApplicationFormFields & { resume: Resume }) => {
	if (!body) {
		throw new BadRequestError('Invalid request body', 400)
	}

	if (!body.jobTitle) {
		throw new BadRequestError('Job title is required', 400)
	}

	if (!body.companyName) {
		throw new BadRequestError('Company name is required', 400)
	}

	if (!body.jobDescription) {
		throw new BadRequestError('Job description is required', 400)
	}

	if (!body.resume) {
		throw new BadRequestError('Resume is required', 400)
	}

	return {
		jobTitle: body.jobTitle,
		companyName: body.companyName,
		jobDescription: body.jobDescription,
		resume: body.resume as Resume
	}
}
