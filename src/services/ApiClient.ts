import { JobApplication } from '@/interfaces/JobApplication'
import { JobApplicationFormFields } from '@/interfaces/JobApplicationFormFields'
import { Resume } from '@/interfaces/Resume'
import { User } from '@/interfaces/User'
import axios, { AxiosInstance } from 'axios'

export class ApiClient {
    private httpClient: AxiosInstance

    constructor() {
        this.httpClient = axios.create()
    }

    /**
     * Sends a POST request to /api/users to initialize the user and retrieve their credentials
     * @returns a user object containing the user's credentials
     */
    async initializeUser(): Promise<User> {
        const response = await this.httpClient.post('/api/users')

        return response.data
    }

    /**
     * Sends a PUT request to /api/users to update the user's profile
     * @param updatedFields - the updated fields of the user
     * @returns the updated user object
     */
    async updateUser(updatedFields: Partial<User>): Promise<User> {
        const response = await this.httpClient.put('/api/users', updatedFields)

        return response.data
    }

    /**
     * Sends a POST request to /api/resumes to upload a resume
     * @param resume - the resume file to upload
     * @param resumeName - the name of the resume
     * @param textContent - the text content of the resume
     * @returns a resume object containing the uploaded resume's details
     */
    async createResume(resume: File, resumeName: string, textContent: string): Promise<Resume> {
        if (!resume) {
            throw new Error('No resume provided')
        }
        if (!resumeName) {
            throw new Error('No resume name provided')
        }

        const formData = new FormData()
        formData.append('file', resume)
        formData.append('name', resumeName)
        formData.append('text', textContent)

        const response = await this.httpClient.post('/api/resumes', formData)

        return response.data
    }

    /**
     * Sends a GET request to /api/resumes to retrieve all resumes
     * @returns an array of all resume objects associated with the user
     */
    async getResumes(): Promise<Resume[]> {
        const response = await this.httpClient.get('/api/resumes')

        return response.data
    }

    /**
     * Sends a GET request to /api/resumes/:resumeId to retrieve a preSignedUrl the associated resume
     * @param resume - the resume object to retrieve
     * @returns a preSignedUrl for the resume
     */
    async getPresignedUrl(resume: Resume): Promise<string> {
        const response = await this.httpClient.get(`/api/resumes/${resume.id}`)

        return response.data.url
    }

    /**
     * Sends a DELETE request to /api/resumes/:resumeId to delete a resume
     * @param resume - the resume object to delete
     * @returns the deleted resume object
     */
    async deleteResume(resume: Resume): Promise<Resume> {
        const response = await this.httpClient.delete(`/api/resumes/${resume.id}`)

        return response.data
    }

    /**
     * Sends a POST request to /api/job-applications to create a new job application
     * @param jobApplication - the job application object to create
     * @returns the created job application object
     */
    async createJobApplication(jobApplication: JobApplicationFormFields): Promise<JobApplication> {
        const response = await this.httpClient.post('/api/job-applications', jobApplication)

        return response.data
    }

    /**
     * Sends a GET request to /api/job-applications to retrieve all job applications
     * @returns an array of all job applications associated with the user
     */
    async getJobApplications(): Promise<JobApplication[]> {
        const response = await this.httpClient.get('/api/job-applications')

        return response.data
    }

    /**'
     * Sends a PUT request to /api/job-applications/:jobApplicationId to update a job application
     * @param jobApplication - the job application object to update
     * @returns the updated job application object
     */
    async updateJobApplication(jobApplication: JobApplication): Promise<JobApplication> {
        const response = await this.httpClient.put(`/api/job-applications/${jobApplication.id}`, jobApplication)

        return response.data
    }

    /**
     * Sends a DELETE request to /api/job-applications/:jobApplicationId to delete a job application
     * @param jobApplication - the job application object to delete
     * @returns the deleted job application object
     */
    async deleteJobApplication(jobApplication: JobApplication): Promise<JobApplication> {
        const response = await this.httpClient.delete(`/api/job-applications/${jobApplication.id}`)

        return response.data
    }
}

//export a single instance to be used across the app
export const apiClient = new ApiClient()
