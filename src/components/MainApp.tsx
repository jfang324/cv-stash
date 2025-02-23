'use client'
import { ResumeUploadDialog } from '@/components/ResumeUploadDialog'
import { useToast } from '@/hooks/use-toast'
import { ApiClient } from '@/services/ApiClient'
import { useUser } from '@auth0/nextjs-auth0'
import { useEffect, useMemo } from 'react'

export const MainApp = () => {
    const { user, isLoading } = useUser()
    const apiClient = useMemo(() => new ApiClient(), [])
    const { toast } = useToast()

    useEffect(() => {
        const initializeUser = async () => {
            if (!isLoading && user) {
                try {
                    await apiClient.initializeUser()
                } catch (error) {
                    console.error(error)
                    toast({ title: 'Error', description: 'Failed to initialize the user' })
                }
            }
        }

        initializeUser()
    }, [user, isLoading, toast, apiClient])

    return (
        <div className="w-full h-full flex flex-col">
            <ResumeUploadDialog />
            <a href="/auth/logout" className="border border-black rounded text-center m-2 p-1">
                Logout
            </a>
        </div>
    )
}
