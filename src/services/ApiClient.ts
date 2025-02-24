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

    async uploadResume(resume: File): Promise<Resume> {
        if (!resume) {
            throw new Error('No resume provided')
        }

        const formData = new FormData()
        formData.append('file', resume)

        const response = await this.httpClient.post('/api/resumes', formData)

        return response.data
    }
}
