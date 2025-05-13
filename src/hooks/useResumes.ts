import { parsePdf } from '@/lib/utils'
import { apiClient } from '@/services/ApiClient'
import type { Resume } from '@/types/Resume'
import { useUser } from '@auth0/nextjs-auth0'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useResumes() {
	const { user } = useUser()

	const {
		data: resumes,
		isLoading: queryLoading,
		error: queryError
	} = useQuery({
		queryKey: ['resumes', user?.sub],
		queryFn: () => apiClient.getResumes(),
		staleTime: 60 * 1000,
		placeholderData: []
	})

	const queryClient = useQueryClient()

	const {
		mutateAsync: createResumeMutation,
		isPending: createMutationLoading,
		error: createMutationError
	} = useMutation({
		mutationFn: (variables: { file: File; name: string; textContent: string }) =>
			apiClient.createResume(variables.file, variables.name, variables.textContent),
		onSuccess: (createdResume) => {
			queryClient.setQueryData(['resumes', user?.sub], [...(resumes || []), createdResume])
		}
	})

	/**
	 * Creates a new resume and updates the state
	 * @param file - the file to upload
	 * @param name - the name of the resume
	 * @returns the created resume or null if an error occurred
	 */
	const createResume = async (file: File, name: string): Promise<Resume | undefined> => {
		try {
			const textContent = await parsePdf(file)
			const createdResume = await createResumeMutation({ file, name, textContent })

			return createdResume
		} catch (error) {
			console.error(error)
		}
	}

	/**
	 * Previews a resume by retrieving the preSignedUrl and opening it in a new tab
	 * @param resume - the resume to preview
	 * @returns
	 */
	const previewResume = async (resume: Resume): Promise<void> => {
		try {
			const url = await apiClient.getPresignedUrl(resume)

			window.open(url, '_blank')
		} catch (error) {
			console.error(error)
		}
	}

	const {
		mutateAsync: deleteResumeMutation,
		isPending: deleteMutationLoading,
		error: deleteMutationError,
		variables: deletingResume
	} = useMutation({
		mutationFn: (resume: Resume) => apiClient.deleteResume(resume),
		onSuccess: (deletedResume) => {
			queryClient.setQueryData(
				['resumes', user?.sub],
				(resumes || []).filter((r) => r.id !== deletedResume.id)
			)
			queryClient.invalidateQueries({ queryKey: ['job-applications', user?.sub], exact: true })
		}
	})

	/**
	 * Deletes a resume and updates the state
	 * @param resume - the resume to delete
	 * @returns the deleted resume or null if an error occurred
	 */
	const deleteResume = async (resume: Resume): Promise<Resume | undefined> => {
		try {
			const deletedResume = await deleteResumeMutation(resume)

			return deletedResume
		} catch (error) {
			console.error(error)
		}
	}

	// centralized loading and error states
	const isLoading = queryLoading || createMutationLoading || deleteMutationLoading
	const error = queryError || createMutationError || deleteMutationError
	const pendingResume = isLoading ? deletingResume : undefined

	return { resumes, isLoading, error, pendingResume, createResume, previewResume, deleteResume }
}
