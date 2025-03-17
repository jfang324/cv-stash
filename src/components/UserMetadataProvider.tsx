'use client'
import { User } from '@/interfaces/User'
import { ApiClient } from '@/services/ApiClient'
import { useUser } from '@auth0/nextjs-auth0'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

interface UserMetadataProviderProps {
    children: React.ReactNode
}

export interface UserMetadataContextType {
    user: User | null
    isLoading: boolean
    refreshUserMetadata: () => Promise<void>
}

export const UserMetadataContext = createContext<UserMetadataContextType | null>(null)

export const UserMetadataProvider = ({ children }: UserMetadataProviderProps) => {
    const { user, isLoading } = useUser()
    const [userMetadata, setUserMetadata] = useState<User | null>(null)
    const apiClient = useMemo(() => new ApiClient(), [])

    useEffect(() => {
        const fetchUserMetadata = async () => {
            if (!isLoading && user) {
                try {
                    const userMetadata = await apiClient.initializeUser()
                    setUserMetadata(userMetadata)
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchUserMetadata()
    }, [user, isLoading, apiClient])

    /**
     * Refreshes the user metadata
     */
    const refreshUserMetadata = useCallback(async () => {
        try {
            const userMetadata = await apiClient.initializeUser()
            setUserMetadata(userMetadata)
        } catch (error) {
            console.error(error)
        }
    }, [apiClient])

    const contextValue = useMemo(
        () => ({
            user: userMetadata,
            isLoading,
            refreshUserMetadata,
        }),
        [userMetadata, isLoading, refreshUserMetadata]
    )

    return <UserMetadataContext.Provider value={contextValue}>{children}</UserMetadataContext.Provider>
}
