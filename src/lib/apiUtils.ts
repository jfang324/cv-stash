import { JobApplication } from '@/interfaces/JobApplication'
import { Resume } from '@/interfaces/Resume'
import { auth0 } from '@/lib/auth0'
import connectToDb from '@/lib/mongoConnection'
import getS3Client from '@/lib/s3'
import { MongoJobApplicationRepository } from '@/repositories/MongoJobApplicationRepository'
import { MongoResumeRepository } from '@/repositories/MongoResumeRepository'
import { MongoUserRepository } from '@/repositories/MongoUserRepository'
import { JobApplicationService } from '@/services/JobApplicationService'
import { ResumeService } from '@/services/ResumeService'
import { UserService } from '@/services/UserService'
import { NextResponse } from 'next/server'

/**
 * Validates the session and gets the user
 * @param requiredFields - An array of required fields in the user object
 * @returns The user object
 */
export const validateSessionAndGetUser = async (requiredFields: string[]) => {
    const session = await auth0.getSession()
    if (!session) {
        throw { status: 401, message: 'not authenticated' }
    }

    const user = session.user
    if (!user || !requiredFields.every((field) => user[field])) {
        throw { status: 422, message: 'Invalid user details' }
    }

    return user
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
 * Handles errors in the API
 * @param error - The error object
 * @returns The error response
 */
export const handleError = (error: any) => {
    console.error('Error in user operation::', error.message || error)

    const status = error.status || 500
    const message = error.message || 'Internal server error'
    return NextResponse.json({ error: message }, { status })
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
        throw { message: 'No PDF provided', status: 400 }
    }

    if (!resumeName) {
        throw { message: 'No resume name provided', status: 400 }
    }

    if (!textContent) {
        throw { message: 'Text content may be parsed incorrectly', status: 400 }
    }

    return { resumeFile, resumeName, textContent }
}

/**
 * Validates the job application form data
 * @param responseBody - The response body from the client
 * @returns The validated job application form data
 */
export const validateJobApplicationFormData = (responseBody: any) => {
    const jobTitle = responseBody.jobTitle as string
    const companyName = responseBody.companyName as string
    const jobDescription = responseBody.jobDescription as string
    const resume = responseBody.resume as Resume

    if (!jobTitle) {
        throw { message: 'No job title provided', status: 400 }
    }

    if (!companyName) {
        throw { message: 'No company name provided', status: 400 }
    }

    if (!jobDescription) {
        throw { message: 'No job description provided', status: 400 }
    }

    if (!resume) {
        throw { message: 'No resume provided', status: 400 }
    }

    return { jobTitle, companyName, jobDescription, resume }
}
