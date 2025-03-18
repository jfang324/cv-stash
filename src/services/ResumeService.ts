import { Resume } from '@/interfaces/Resume'
import { ResumeRepository } from '@/interfaces/ResumeRepository'
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
     * Creates a resume in the database and uploads it to S3
     * @param resume - The partial resume object to create
     * @param ownerId - The id of the user/owner of the resume
     * @param file - The file to upload
     * @returns The resume object created
     */
    async createResume(resume: Omit<Resume, 'id | lastModified'>, ownerId: string, file: File): Promise<Resume> {
        try {
            const newResumeId = crypto.randomBytes(16).toString('hex')
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: newResumeId,
                Body: Buffer.from(await file.arrayBuffer()),
                ContentType: file.type,
            }

            await this.s3Client.send(new PutObjectCommand(params))

            const newResume = await this.resumes.createResume(ownerId, {
                ...resume,
                id: newResumeId,
                lastModified: Date.now(),
            })

            return newResume
        } catch (error) {
            console.error(`ResumeService failed to create a new resume: ${error}`)
            throw new Error('ResumeService failed to create a new resume')
        }
    }

    /**
     * Gets resumes with the associated ownerId
     * @param ownerId - The id of the user
     * @returns An array of resumes that belong to the user
     */
    async getResumesByOwnerId(ownerId: string): Promise<Resume[]> {
        try {
            const resumes = await this.resumes.getResumesByOwnerId(ownerId)

            return resumes
        } catch (error) {
            console.error(`ResumeService failed to retrieve resumes: ${error}`)
            throw new Error('ResumeService failed to retrieve resumes')
        }
    }

    /**
     * Gets a preSignedUrl for the resume
     * @param resumeId - The id of the resume
     * @param userId - The id of the user
     * @returns A preSignedUrl for the resume
     */
    async getPresignedUrl(resumeId: string, userId: string): Promise<string> {
        try {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: resumeId,
            }

            const resume = await this.resumes.getResumeById(resumeId)

            if (!resume) {
                throw new Error('No resume found with the provided id')
            }

            const ownerId = await this.resumes.getOwnerId(resume)

            if (ownerId !== userId) {
                throw new Error('User does not own this resume')
            }

            return await getSignedUrl(this.s3Client, new GetObjectCommand(params), { expiresIn: 3600 })
        } catch (error) {
            console.error(`ResumeService failed to retrieve a presigned url: ${error}`)
            throw new Error('ResumeService failed to retrieve a presigned url')
        }
    }

    /**
     * Deletes a resume by id
     * @param resumeId - The id of the resume to delete
     * @param userId - The id of the user
     * @returns The deleted resume object
     */
    async deleteResumeById(resumeId: string, userId: string): Promise<Resume> {
        try {
            const resume = await this.resumes.getResumeById(resumeId)

            if (!resume) {
                throw new Error('No resume found with the provided id')
            }

            const ownerId = await this.resumes.getOwnerId(resume)

            if (ownerId !== userId) {
                throw new Error('User does not own this resume')
            }

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: resumeId,
            }

            await this.s3Client.send(new DeleteObjectCommand(params))
            const deletedResume = await this.resumes.deleteResumeById(resumeId)

            return deletedResume
        } catch (error) {
            console.error(`ResumeService failed to delete a resume: ${error}`)
            throw new Error('ResumeService failed to delete a resume')
        }
    }
}
