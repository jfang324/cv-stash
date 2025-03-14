import { Resume } from '@/interfaces/Resume'
import { ResumeRepository } from '@/interfaces/ResumeRepository'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

export class ResumeService {
    private resumes: ResumeRepository
    private s3Client: S3Client

    constructor(resumeRepository: ResumeRepository, s3Client: S3Client) {
        if (!resumeRepository) {
            throw new Error('No ResumeRepository provided to ResumeService')
        }
        if (!s3Client) {
            throw new Error('No S3Client provided to ResumeService')
        }

        this.resumes = resumeRepository
        this.s3Client = s3Client
    }

    /**
     * Creates a resume document in the database with the provided data and uploads the file to S3
     * @param providedResume - A partial resume
     * @param ownerId - The id of the user
     * @param file - The file to be uploaded to S3
     * @returns The resume object created
     */
    async createResume(providedResume: Partial<Resume>, ownerId: string, file: File): Promise<Resume> {
        if (!providedResume || !providedResume.name || !providedResume.textContent || !ownerId) {
            throw new Error('Insufficient information to create new resume')
        }

        if (!file || !(file instanceof File) || file.type !== 'application/pdf') {
            throw new Error('No file provided')
        }

        try {
            const resumeId = crypto.randomBytes(16).toString('hex')
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: resumeId,
                Body: Buffer.from(await file.arrayBuffer()),
                ContentType: file.type,
            }

            await this.s3Client.send(new PutObjectCommand(params))

            const newResume = await this.resumes.createResume(
                resumeId,
                providedResume.name,
                providedResume.textContent,
                ownerId,
                file.lastModified
            )

            return newResume
        } catch (error) {
            console.error(`ResumeService failed to create a new resume: ${error}`)
            throw new Error('ResumeService failed to create a new resume')
        }
    }

    /**
     * Retrieves all resumes owned by the user
     * @param ownerId - The id of the user
     * @returns An array of resume objects owned by the user
     */
    async getResumesByOwnerId(ownerId: string): Promise<Resume[]> {
        if (!ownerId) {
            throw new Error('No ownerId provided')
        }

        try {
            const resumes = await this.resumes.getResumesByOwnerId(ownerId)

            return resumes
        } catch (error) {
            console.error(`ResumeService failed to retrieve resumes: ${error}`)
            throw new Error('ResumeService failed to retrieve resumes')
        }
    }

    /**
     * Creates a presigned for the requested resume
     * @param resumeId - The id of the resume
     * @param userId - The id of the user
     * @returns A presigned url for the resume
     */
    async getPresignedUrl(resumeId: string, userId: string): Promise<string> {
        if (!resumeId) {
            throw new Error('No resumeId provided')
        }

        try {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: resumeId,
            }

            const resume = await this.resumes.getResumeById(resumeId, userId)

            if (!resume) {
                throw new Error('No resume found with the provided id')
            }

            return await getSignedUrl(this.s3Client, new GetObjectCommand(params), { expiresIn: 3600 })
        } catch (error) {
            console.error(`ResumeService failed to retrieve a presigned url: ${error}`)
            throw new Error('ResumeService failed to retrieve a presigned url')
        }
    }
}
