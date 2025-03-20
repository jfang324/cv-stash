'use client'
import { Resume } from '@/interfaces/Resume'
import { parsePdf } from '@/lib/utils'
import { apiClient } from '@/services/ApiClient'
import { useEffect, useState } from 'react'

export const useResumes = () => {
    const [resumes, setResumes] = useState<Resume[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const fetchedResumes = await apiClient.getResumes()

                setResumes(fetchedResumes)
            } catch (error) {
                console.error(error)
                setError('Failed to retrieve resumes')
            }
        }

        fetchResumes()
    }, [])

    /**
     * Creates a new resume and updates the state
     * @param file - the file to upload
     * @param name - the name of the resume
     * @returns the created resume or null if an error occurred
     */
    const createResume = async (file: File, name: string): Promise<Resume | null> => {
        try {
            const textContent = await parsePdf(file)
            const createdResume = await apiClient.createResume(file, name, textContent)

            setResumes([...resumes, createdResume])
            setError(null)

            return createdResume
        } catch (error) {
            console.error(error)
            setError('Failed to create resume')

            return null
        }
    }

    /**
     * Previews a resume by retrieving the preSignedUrl and opening it in a new tab
     * @param resume - the resume to preview
     * @returns
     */
    const previewResume = async (resume: Resume): Promise<void> => {
        try {
            const url = await apiClient.getPresignedUrl(resume)

            setError(null)
            window.open(url, '_blank')
        } catch (error) {
            console.error(error)
            setError('Failed to retrieve presigned url')
        }
    }

    /**
     * Deletes a resume and updates the state
     * @param resume - the resume to delete
     * @returns the deleted resume or null if an error occurred
     */
    const deleteResume = async (resume: Resume): Promise<Resume | null> => {
        try {
            const deletedResume = await apiClient.deleteResume(resume)

            setResumes(resumes.filter((r) => r.id !== deletedResume.id))
            setError(null)

            return deletedResume
        } catch (error) {
            console.error(error)
            setError('Failed to delete resume')

            return null
        }
    }

    return { resumes, createResume, previewResume, deleteResume, error }
}
