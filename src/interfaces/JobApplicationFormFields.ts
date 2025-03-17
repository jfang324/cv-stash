import { Resume } from '@/interfaces/Resume'

export interface JobApplicationFormFields {
    jobTitle: string
    companyName: string
    jobDescription: string
    resume: Resume | null
}
