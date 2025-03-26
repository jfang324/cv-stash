import type { Resume } from '@/types/Resume'

export type JobApplicationFormFields = {
	jobTitle: string
	companyName: string
	jobDescription: string
	resume: Resume | null
}
