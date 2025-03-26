import {
	getJobApplicationService,
	handleError,
	validateJobApplicationFormData,
	validateSessionAndGetUser
} from '@/lib/apiUtils'
import connectToDb from '@/lib/mongoConnection'
import { MongoJobApplicationRepository } from '@/repositories/MongoJobApplicationRepository'
import { JobApplicationService } from '@/services/JobApplicationService'
import type { JobApplication } from '@/types/JobApplication'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const user = await validateSessionAndGetUser(['sub'])
		const jobApplicationService = await getJobApplicationService()

		const body = await request.json()
		const { jobTitle, companyName, jobDescription, resume } = validateJobApplicationFormData(body)

		const newJobApplication = await jobApplicationService.createJobApplication(
			{
				jobTitle,
				companyName,
				jobDescription,
				resume,
				status: 'Applied',
				dateApplied: Date.now()
			} as Omit<JobApplication, 'id' | 'lastModified'>,
			user.sub
		)

		return NextResponse.json(newJobApplication, { status: 200 })
	} catch (error) {
		return handleError(error, 'Error creating job application')
	}
}

export async function GET() {
	try {
		const user = await validateSessionAndGetUser(['sub'])

		const connection = await connectToDb()
		const jobApplicationRepository = new MongoJobApplicationRepository(connection)
		const jobApplicationService = new JobApplicationService(jobApplicationRepository)

		const jobApplications = await jobApplicationService.getJobApplicationsByOwnerId(user.sub)

		return NextResponse.json(jobApplications, { status: 200 })
	} catch (error) {
		return handleError(error, 'Error getting job applications')
	}
}
