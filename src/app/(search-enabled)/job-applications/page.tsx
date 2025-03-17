'use client'
import { ApiClient } from '@/services/ApiClient'
import { useEffect, useMemo } from 'react'

export default function ApplicationsPage() {
    const apiClient = useMemo(() => new ApiClient(), [])

    useEffect(() => {
        const fetchJobApplications = async () => {
            const jobApplications = await apiClient.retrieveJobApplications()
            console.log(jobApplications)
        }
        fetchJobApplications()
    }, [apiClient])

    return (
        <div className="flex flex-col gap-3 h-full p-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
                <p className="text-muted-foreground">Manage your job applications</p>
            </div>
            <div>Coming soon...</div>
        </div>
    )
}
