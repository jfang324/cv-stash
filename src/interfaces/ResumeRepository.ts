import { Resume } from '@/interfaces/Resume'

export interface ResumeRepository {
    getResumesByOwnerId(ownerId: string): Promise<Resume[]>
    createResume(ownerId: string, resume: Resume): Promise<Resume>
    getResumeById(id: string): Promise<Resume | null>
    getOwnerId(resume: Resume): Promise<string>
}
