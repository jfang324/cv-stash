import { Resume } from '@/interfaces/Resume'

export interface ResumeRepository {
    getResumesByOwnerId(ownerId: string): Promise<Resume[]>
    createResume(id: string, name: string, textContent: string, ownerId: string, lastModified: number): Promise<Resume>
    getResumeById(resumeId: string, userId: string): Promise<Resume | null>
}
