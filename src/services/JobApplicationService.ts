import { JobApplication } from '@/interfaces/JobApplication'
import { JobApplicationRepository } from '@/interfaces/JobApplicationRepository'
import crypto from 'crypto'

export class JobApplicationService {
    private jobApplications: JobApplicationRepository

    constructor(jobApplicationRepository: JobApplicationRepository) {
        if (!jobApplicationRepository) {
            throw new Error('No JobApplicationRepository provided to JobApplicationService')
        }

        this.jobApplications = jobApplicationRepository
    }

    /**
     * Creates a new job application if it doesn't exist, otherwise returns the existing job application
     * @param jobApplication - The job application object to create or retrieve
     * @param ownerId - The id of the user/owner of the job application
     * @returns The created or retrieved job application object
     */
    async createJobApplication(
        jobApplication: Omit<JobApplication, 'id' | 'lastModified'>,
        ownerId: string
    ): Promise<JobApplication> {
        try {
            const newJobApplicationId = crypto.randomBytes(16).toString('hex')
            const newJobApplication = await this.jobApplications.createJobApplication(ownerId, {
                ...jobApplication,
                id: newJobApplicationId,
                lastModified: Date.now(),
            })

            return newJobApplication
        } catch (error) {
            console.error(`JobApplicationService failed to create a new job application: ${error}`)
            throw new Error('JobApplicationService failed to create a new job application')
        }
    }

    /**
     * Gets job applications with the associated ownerId
     * @param ownerId - The id of the user
     * @returns An array of job applications that belong to the user
     */
    async getJobApplicationsByOwnerId(ownerId: string): Promise<JobApplication[]> {
        try {
            const jobApplications = await this.jobApplications.getJobApplicationsByOwnerId(ownerId)

            return jobApplications
        } catch (error) {
            console.error(`JobApplicationService failed to retrieve job applications: ${error}`)
            throw new Error('JobApplicationService failed to retrieve job applications')
        }
    }
}
