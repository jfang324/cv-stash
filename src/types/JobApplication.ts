import type { Resume } from '@/types/Resume'

export type JobApplication = {
	id: string
	jobTitle: string
	companyName: string
	jobDescription: string
	resume: Resume
	status: 'Applied' | 'Interviewing' | 'Rejected' | 'Offer' | 'Withdrawn'
	dateApplied: number
	lastModified: number
}
