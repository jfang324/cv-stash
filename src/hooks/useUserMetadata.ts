import { apiClient } from '@/services/ApiClient'
import type { User } from '@/types/User'
import { useUser } from '@auth0/nextjs-auth0'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export function useUserMetadata() {
	const { user: authUser, isLoading: authLoading, error: authError } = useUser()

	const {
		data: user,
		isLoading: queryLoading,
		error: queryError
	} = useQuery({
		queryKey: ['user-metadata', authUser?.sub],
		queryFn: () => apiClient.initializeUser(),
		staleTime: 60 * 1000,
		enabled: !!authUser
	})

	const queryClient = useQueryClient()
	const {
		mutateAsync,
		isPending: mutationLoading,
		error: mutationError
	} = useMutation({
		mutationFn: (updatedFields: Partial<User>) => apiClient.updateUser(updatedFields),
		onSuccess: (updatedUser) => {
			queryClient.setQueryData(['user-metadata', authUser?.sub], updatedUser)
		}
	})

	//centralized loading and error states
	const isLoading = authLoading || queryLoading || mutationLoading
	const error = authError || queryError || mutationError

	/**
	 * Updates user metadata
	 * @param updatedFields - the updated fields
	 * @returns the updated user or undefined if an error occurred
	 */
	const updateUserMetadata = useCallback(
		async (updatedFields: Partial<User>): Promise<User | undefined> => {
			try {
				const updatedUser = await mutateAsync(updatedFields)

				return updatedUser
			} catch (error) {
				console.error(error)
			}
		},
		[mutateAsync]
	)

	return {
		user,
		isLoading,
		error,
		updateUserMetadata
	}
}
