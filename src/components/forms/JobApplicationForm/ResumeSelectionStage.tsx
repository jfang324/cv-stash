'use client'
import { ResumeUploadDialog } from '@/components/ResumeUploadDialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { useSearchIndex } from '@/hooks/useSearchIndex'
import { apiClient } from '@/services/ApiClient'
import type { JobApplicationFormFields } from '@/types/JobApplicationFormFields'
import type { Resume } from '@/types/Resume'
import { CheckCircle, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ResumeSelectionStageProps {
	formData: JobApplicationFormFields
	handleResumeSelect: (selectedResume: Resume) => void
	createResume: (file: File, name: string) => Promise<Resume | null>
}

export const ResumeSelectionStage = ({ formData, handleResumeSelect, createResume }: ResumeSelectionStageProps) => {
	const [resumes, setResumes] = useState<Resume[]>([])
	const { searchIndex, addToIndex } = useSearchIndex()
	const { toast } = useToast()

	useEffect(() => {
		try {
			const searchResults = searchIndex(formData.jobDescription, 4)

			//if a resume is already selected we want to make sure it is displayed even if it doesn't get a high fuse score
			//however, if it is part of the search results we don't want to duplicate it
			if (formData.resume && !searchResults.includes(formData.resume)) searchResults.push(formData.resume)

			setResumes(searchResults)
		} catch (error) {
			console.error(error)
			toast({ title: 'Error', description: 'Failed to search index' })
		}
	}, [formData.jobDescription, formData.resume, searchIndex, toast])

	/**
	 * Retrieves a presigned url for the resume and opens it in a new tab
	 * @param resume - The resume to preview
	 */
	const handlePreview = async (resume: Resume) => {
		try {
			const presignedUrl = await apiClient.getPresignedUrl(resume)

			window.open(presignedUrl, '_blank')
		} catch (error) {
			console.error(error)
			toast({ title: 'Error', description: 'Failed to retrieve presigned url' })
		}
	}

	/**
	 * Callback function to update the form data after the resume is uploaded
	 * @param resume - The uploaded resume
	 */
	const uploadCallback = (resume: Resume) => {
		handleResumeSelect(resume)

		setResumes((prev) => [...prev, resume])
		addToIndex(resume)
	}

	return (
		<div className="space-y-3">
			<div className="space-y-2">
				{resumes.map((resume) => (
					<div
						key={resume.id}
						className={`p-4 border rounded-lg transition-colors ${
							formData.resume?.id === resume.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
						}`}
					>
						<div className="flex justify-between items-start">
							<div className="cursor-pointer" onClick={() => handleResumeSelect(resume)}>
								<h3 className="flex text-sm font-semibold items-center">
									{resume.name}
									{formData.resume?.id === resume.id && (
										<CheckCircle className="h-4 text-primary w-4 ml-2" />
									)}
								</h3>
								<p className="text-muted-foreground text-xs line-clamp-2 mt-1">{resume.textContent}</p>
							</div>

							<div className="flex items-center ml-4 my-auto space-x-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => handlePreview(resume)}
											>
												<ExternalLink className="h-4 w-4" />
												<span className="sr-only">Preview resume</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Preview resume</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
					</div>
				))}
			</div>
			<ResumeUploadDialog handleResumeUpload={createResume} callBack={uploadCallback} />
		</div>
	)
}
