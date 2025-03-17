import { JobApplication } from '@/interfaces/JobApplication'

export interface JobApplicationRepository {
    getJobApplicationsByOwnerId(ownerId: string): Promise<JobApplication[]>
    createJobApplication(ownerId: string, JobApplication: JobApplication): Promise<JobApplication>
}
