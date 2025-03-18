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

    /**
     * Deletes a job application by id
     * @param jobApplicationId - The id of the job application to delete
     * @param userId - The id of the user
     * @returns The deleted job application object
     */
    async deleteJobApplicationById(jobApplicationId: string, userId: string): Promise<JobApplication> {
        try {
            const jobApplication = await this.jobApplications.getJobApplicationById(jobApplicationId)

            if (!jobApplication) {
                throw new Error('No job application found with the provided id')
            }

            const ownerId = await this.jobApplications.getOwnerId(jobApplication)

            if (ownerId !== userId) {
                throw new Error('User does not own this job application')
            }

            const deletedJobApplication = await this.jobApplications.deleteJobApplicationById(jobApplicationId)

            return deletedJobApplication
        } catch (error) {
            console.error(`JobApplicationService failed to delete a job application by id: ${error}`)
            throw new Error('JobApplicationService failed to delete a job application by id')
        }
    }

    /**
     * Updates a job application by id
     * @param jobApplicationId - The id of the job application to update
     * @param updatedFields - The updated fields of the job application
     * @param userId - The id of the user
     * @returns The updated job application object
     */
    async updateJobApplicationById(
        jobApplicationId: string,
        updatedFields: Partial<JobApplication>,
        userId: string
    ): Promise<JobApplication> {
        try {
            const jobApplication = await this.jobApplications.getJobApplicationById(jobApplicationId)

            if (!jobApplication) {
                throw new Error('No job application found with the provided id')
            }

            const ownerId = await this.jobApplications.getOwnerId(jobApplication)

            if (ownerId !== userId) {
                throw new Error('User does not own this job application')
            }

            const updatedJobApplication = await this.jobApplications.updateJobApplicationById(
                jobApplicationId,
                updatedFields
            )

            return updatedJobApplication
        } catch (error) {
            console.error(`JobApplicationService failed to update a job application: ${error}`)
            throw new Error('JobApplicationService failed to update a job application')
        }
    }
}
