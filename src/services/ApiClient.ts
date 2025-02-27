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
     * @returns
     */
    async initializeUser(): Promise<User> {
        const response = await this.httpClient.post('/api/users')

        return response.data
    }

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

    async retrieveResumes(): Promise<Resume[]> {
        const response = await this.httpClient.get('/api/resumes')

        return response.data
    }

    async retrievePresignedUrl(resumeId: string): Promise<string> {
        const response = await this.httpClient.get(`/api/resumes/${resumeId}`)

        return response.data.url
    }
}
