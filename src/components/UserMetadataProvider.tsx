'use client'
import { User } from '@/interfaces/User'
import { apiClient } from '@/services/ApiClient'
import { useUser } from '@auth0/nextjs-auth0'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

interface UserMetadataProviderProps {
    children: React.ReactNode
}

export interface UserMetadataContextType {
    user: User | null
    isLoading: boolean
    updateUserMetadata: (updatedFields: Partial<User>) => Promise<User | null>
}

export const UserMetadataContext = createContext<UserMetadataContextType | null>(null)

export const UserMetadataProvider = ({ children }: UserMetadataProviderProps) => {
    const { user, isLoading } = useUser()
    const [userMetadata, setUserMetadata] = useState<User | null>(null)

    useEffect(() => {
        const fetchUserMetadata = async () => {
            if (!isLoading && user) {
                try {
                    const fetchedUserMetadata = await apiClient.initializeUser()

                    setUserMetadata(fetchedUserMetadata)
                } catch (error) {
                    console.error(error)
                }
            }
        }

        fetchUserMetadata()
    }, [user, isLoading])

    /**
     * Updates the user metadata
     * @param updatedFields - the updated fields of the user
     * @returns
     */
    const updateUserMetadata = useCallback(async (updatedFields: Partial<User>): Promise<User | null> => {
        try {
            const updatedUserMetadata = await apiClient.updateUser(updatedFields)

            setUserMetadata(updatedUserMetadata)

            return updatedUserMetadata
        } catch (error) {
            console.error(error)

            return null
        }
    }, [])

    const contextValue = useMemo(
        () => ({
            user: userMetadata,
            isLoading,
            updateUserMetadata,
        }),
        [userMetadata, isLoading, updateUserMetadata]
    )

    return <UserMetadataContext.Provider value={contextValue}>{children}</UserMetadataContext.Provider>
}
