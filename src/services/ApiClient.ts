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
     * Sends a POST request to /api/resumes to upload a resume
     * @param resume - the resume file to upload
     * @param resumeName - the name of the resume
     * @param textContent - the text content of the resume
     * @returns a resume object containing the uploaded resume's details
     */
    async uploadResume(resume: File, resumeName: string, textContent: string): Promise<Resume> {
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
    async retrieveResumes(): Promise<Resume[]> {
        const response = await this.httpClient.get('/api/resumes')

        return response.data
    }

    /**
     * Sends a GET request to /api/resumes/:resumeId to retrieve a preSignedUrl the associated resume
     * @param resumeId - the ID of the resume to retrieve
     * @returns a preSignedUrl for the resume
     */
    async retrievePresignedUrl(resumeId: string): Promise<string> {
        const response = await this.httpClient.get(`/api/resumes/${resumeId}`)

        return response.data.url
    }
}
