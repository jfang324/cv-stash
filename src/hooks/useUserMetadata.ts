import { UserMetadataContext, UserMetadataContextType } from '@/components/UserMetadataProvider'
import { useContext } from 'react'

export const useUserMetadata = (): UserMetadataContextType => {
    const userMetadataContext = useContext(UserMetadataContext)

    if (!userMetadataContext) {
        throw new Error('useUserMetadata must be used within a UserMetadataProvider')
    }

    return userMetadataContext
}
