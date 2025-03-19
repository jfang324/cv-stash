import { Resume } from '@/interfaces/Resume'

export interface JobApplication {
    id: string
    jobTitle: string
    companyName: string
    jobDescription: string
    resume: Resume
    status: 'Applied' | 'Interviewing' | 'Rejected' | 'Offer' | 'Withdrawn'
    dateApplied: number
    lastModified: number
}
