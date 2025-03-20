'use client'
import { JobApplication } from '@/interfaces/JobApplication'
import { JobApplicationFormFields } from '@/interfaces/JobApplicationFormFields'
import { apiClient } from '@/services/ApiClient'
import { useEffect, useState } from 'react'

export const useJobApplications = () => {
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchJobApplications = async () => {
            try {
                const fetchedJobApplications = await apiClient.getJobApplications()

                setJobApplications(fetchedJobApplications)
            } catch (error) {
                console.error(error)
                setError('Failed to retrieve job applications')
            }
        }

        fetchJobApplications()
    }, [])

    /**
     * Creates a new job application and updates the state
     * @param formData - the form data of the job application to create
     * @returns the created job application or null if an error occurred
     */
    const createJobApplication = async (formData: JobApplicationFormFields): Promise<JobApplication | null> => {
        try {
            const createdJobApplication = await apiClient.createJobApplication(formData)

            setJobApplications([...jobApplications, createdJobApplication])
            setError(null)

            return createdJobApplication
        } catch (error) {
            console.error(error)
            setError('Failed to create job application')

            return null
        }
    }

    /**
     * Updates a job application and updates the state
     * @param jobApplication - the job application to update
     * @returns the updated job application or null if an error occurred
     */
    const updateJobApplication = async (jobApplication: JobApplication): Promise<JobApplication | null> => {
        try {
            const updatedJobApplication = await apiClient.updateJobApplication(jobApplication)

            setJobApplications(
                jobApplications.map((app) => (app.id === updatedJobApplication.id ? updatedJobApplication : app))
            )
            setError(null)

            return updatedJobApplication
        } catch (error) {
            console.error(error)
            setError('Failed to update job application')

            return null
        }
    }

    /**
     * Deletes a job application and updates the state
     * @param jobApplication - the job application to delete
     * @returns the deleted job application or null if an error occurred
     */
    const deleteJobApplication = async (jobApplication: JobApplication): Promise<JobApplication | null> => {
        try {
            const deletedJobApplication = await apiClient.deleteJobApplication(jobApplication)

            setJobApplications(jobApplications.filter((app) => app.id !== deletedJobApplication.id))
            setError(null)

            return deletedJobApplication
        } catch (error) {
            console.error(error)
            setError('Failed to delete job application')

            return null
        }
    }

    return {
        jobApplications,
        createJobApplication,
        updateJobApplication,
        deleteJobApplication,
        error,
    }
}
