import { apiClient } from '@/services/ApiClient'
import type { JobApplication } from '@/types/JobApplication'
import type { JobApplicationFormFields } from '@/types/JobApplicationFormFields'
import { useUser } from '@auth0/nextjs-auth0'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export function useJobApplications() {
	const { user } = useUser()

	const {
		data: jobApplications,
		isLoading: queryLoading,
		error: queryError
	} = useQuery({
		queryKey: ['job-applications', user?.sub],
		queryFn: () => apiClient.getJobApplications(),
		staleTime: 60 * 1000,
		placeholderData: []
	})

	const queryClient = useQueryClient()

	const {
		mutateAsync: createApplicationMutation,
		isPending: createMutationLoading,
		error: createMutationError
	} = useMutation({
		mutationFn: (formData: JobApplicationFormFields) => apiClient.createJobApplication(formData),
		onSuccess: (createdJobApplication) => {
			queryClient.setQueryData(
				['job-applications', user?.sub],
				[...(jobApplications || []), createdJobApplication]
			)
		}
	})

	/**
	 * Creates a new job application and updates the state
	 * @param formData - the form data of the job application to create
	 * @returns the created job application
	 */
	const createJobApplication = useCallback(
		async (formData: JobApplicationFormFields): Promise<JobApplication | undefined> => {
			try {
				const createdJobApplication = await createApplicationMutation(formData)

				return createdJobApplication
			} catch (error) {
				console.error(error)
			}
		},
		[createApplicationMutation]
	)

	const {
		mutateAsync: updateApplicationMutation,
		isPending: updateMutationLoading,
		error: updateMutationError,
		variables: updatingApplication
	} = useMutation({
		mutationFn: (jobApplication: JobApplication) => apiClient.updateJobApplication(jobApplication),
		onSuccess: (updatedJobApplication) => {
			queryClient.setQueryData(
				['job-applications', user?.sub],
				(jobApplications || []).map((app) =>
					app.id === updatedJobApplication.id ? updatedJobApplication : app
				)
			)
		}
	})

	/**
	 * Updates a job application and updates the state
	 * @param jobApplication - the job application to update
	 * @returns the updated job application
	 */
	const updateJobApplication = useCallback(
		async (jobApplication: JobApplication): Promise<JobApplication | undefined> => {
			try {
				const updatedJobApplication = await updateApplicationMutation(jobApplication)

				return updatedJobApplication
			} catch (error) {
				console.error(error)
			}
		},
		[updateApplicationMutation]
	)

	const {
		mutateAsync: deleteApplicationMutation,
		isPending: deleteMutationLoading,
		error: deleteMutationError,
		variables: deletingApplication
	} = useMutation({
		mutationFn: (jobApplication: JobApplication) => apiClient.deleteJobApplication(jobApplication),
		onSuccess: (deletedJobApplication) => {
			queryClient.setQueryData(
				['job-applications', user?.sub],
				(jobApplications || []).filter((app) => app.id !== deletedJobApplication.id)
			)
		}
	})

	/**
	 * Deletes a job application and updates the state
	 * @param jobApplication - the job application to delete
	 * @returns the deleted job application
	 */
	const deleteJobApplication = useCallback(
		async (jobApplication: JobApplication): Promise<JobApplication | undefined> => {
			try {
				const deletedJobApplication = await deleteApplicationMutation(jobApplication)

				return deletedJobApplication
			} catch (error) {
				console.error(error)
			}
		},
		[deleteApplicationMutation]
	)

	// centralized loading and error states
	const isLoading = queryLoading || createMutationLoading || updateMutationLoading || deleteMutationLoading
	const error = queryError || createMutationError || updateMutationError || deleteMutationError
	const pendingApplication = isLoading ? updatingApplication || deletingApplication : undefined

	return {
		jobApplications,
		isLoading,
		error,
		pendingApplication,
		createJobApplication,
		updateJobApplication,
		deleteJobApplication
	}
}
