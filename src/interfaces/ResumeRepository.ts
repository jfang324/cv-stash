import type { Resume } from '@/types/Resume'

export interface ResumeRepository {
	createResume(ownerId: string, resume: Resume): Promise<Resume>
	getResumeById(id: string): Promise<Resume | null>
	getResumesByOwnerId(ownerId: string): Promise<Resume[]>
	getOwnerId(resume: Resume): Promise<string>
	deleteResumeById(id: string): Promise<Resume>
}
