import { JobApplication } from '@/interfaces/JobApplication'
import {
    getJobApplicationService,
    handleError,
    validateJobApplicationFormData,
    validateSessionAndGetUser,
} from '@/lib/apiUtils'
import connectToDb from '@/lib/mongoConnection'
import { MongoJobApplicationRepository } from '@/repositories/MongoJobApplicationRepository'
import { JobApplicationService } from '@/services/JobApplicationService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const user = await validateSessionAndGetUser(['sub'])
        const jobApplicationService = await getJobApplicationService()

        const responseBody = await request.json()
        const { jobTitle, companyName, jobDescription, resume } = validateJobApplicationFormData(responseBody)

        const newJobApplication = await jobApplicationService.createJobApplication(
            {
                jobTitle,
                companyName,
                jobDescription,
                resume,
                status: 'Applied',
            } as Omit<JobApplication, 'id' | 'lastModified'>,
            user.sub
        )

        return NextResponse.json(newJobApplication, { status: 200 })
    } catch (error: any) {
        return handleError(error)
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await validateSessionAndGetUser(['sub'])

        const connection = await connectToDb()
        const jobApplicationRepository = new MongoJobApplicationRepository(connection)
        const jobApplicationService = new JobApplicationService(jobApplicationRepository)

        const jobApplications = await jobApplicationService.getJobApplicationsByOwnerId(user.sub)

        return NextResponse.json(jobApplications, { status: 200 })
    } catch (error: any) {
        console.error('Error retrieving job applications::', error.message || error)
        return NextResponse.json({ error: error.message || 'Error retrieving job applications' }, { status: 500 })
    }
}
