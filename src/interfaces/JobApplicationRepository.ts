import type { JobApplication } from '@/types/JobApplication'

export interface JobApplicationRepository {
	createJobApplication(ownerId: string, JobApplication: JobApplication): Promise<JobApplication>
	getJobApplicationById(id: string): Promise<JobApplication | null>
	getJobApplicationsByOwnerId(ownerId: string): Promise<JobApplication[]>
	getOwnerId(jobApplication: JobApplication): Promise<string>
	updateJobApplicationById(id: string, updatedFields: Partial<JobApplication>): Promise<JobApplication>
	deleteJobApplicationById(id: string): Promise<JobApplication>
}
