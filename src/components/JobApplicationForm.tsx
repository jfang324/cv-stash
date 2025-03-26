'use client'
import { JobDetailsStage } from '@/components/job-application-stages/JobDetailsStage'
import { ResumeSelectionStage } from '@/components/job-application-stages/ResumeSelectionStage'
import { SummaryStage } from '@/components/job-application-stages/SummaryStage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import type { JobApplication } from '@/types/JobApplication'
import type { JobApplicationFormFields } from '@/types/JobApplicationFormFields'
import type { Resume } from '@/types/Resume'
import { Briefcase, CheckCircle, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { useState } from 'react'

interface JobApplicationFormProps {
	createJobApplication: (formData: JobApplicationFormFields) => Promise<JobApplication | null>
	createResume: (file: File, name: string) => Promise<Resume | null>
}

export const JobApplicationForm = ({ createJobApplication, createResume }: JobApplicationFormProps) => {
	const [formData, setFormData] = useState<JobApplicationFormFields>({
		jobTitle: '',
		companyName: '',
		jobDescription: '',
		resume: null
	})
	const [stage, setStage] = useState<number>(1)
	const { toast } = useToast()

	/**
	 * Generic function for updating form data
	 * @param e - The event object
	 */
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	/**
	 * Checks if the current stage is complete
	 */
	const isStageValid = () => {
		if (stage === 1) {
			return (
				formData.jobTitle.trim() !== '' &&
				formData.companyName.trim() !== '' &&
				formData.jobDescription.trim() !== ''
			)
		}

		if (stage === 2) {
			return formData.resume !== null
		}

		return true
	}

	/**
	 * Navigates to the next stage
	 */
	const handleNext = () => {
		setStage((prev) => prev + 1)
	}

	/**
	 * Navigates to the previous stage
	 */
	const handlePrev = () => {
		if (stage === 1) return

		setStage((prev) => prev - 1)
	}

	/**
	 * Updates the form data with the selected resume
	 * @param selectedResume - the selected resume
	 */
	const handleResumeSelect = (selectedResume: Resume) => {
		setFormData((prev) => ({ ...prev, resume: selectedResume }))
	}

	/**
	 * Handles form submission
	 */
	const handleSubmit = async () => {
		if (!formData || !formData.jobTitle || !formData.companyName || !formData.jobDescription || !formData.resume) {
			toast({ title: 'Error', description: 'Please fill out all fields' })
			return
		}

		const createdJobApplication = await createJobApplication(
			formData as Omit<JobApplication, 'id' | 'dateApplied' | 'lastModified'>
		)

		if (createdJobApplication) {
			setStage(1)
			setFormData({
				jobTitle: '',
				companyName: '',
				jobDescription: '',
				resume: null
			})
			toast({
				title: 'Success',
				description: 'Your application has been submitted'
			})
		}
	}

	// Additional information about each stage
	const stages = {
		1: {
			id: 1,
			title: 'Job Details',
			description: "Enter the details of the job you're applying for",
			icon: Briefcase,
			content: <JobDetailsStage formData={formData} handleInputChange={handleInputChange} />
		},
		2: {
			id: 2,
			title: 'Select Resume',
			description: 'Select a resume that best matches this job',
			icon: FileText,
			content: (
				<ResumeSelectionStage
					formData={formData}
					handleResumeSelect={handleResumeSelect}
					createResume={createResume}
				/>
			)
		},
		3: {
			id: 3,
			title: 'Application Summary',
			description: 'Review your application before submitting',
			icon: CheckCircle,
			content: <SummaryStage formData={formData} selectedResume={formData.resume} />
		}
	}

	return (
		<div className="container max-w-3xl mx-auto">
			<Card>
				<CardHeader>
					<div className="flex justify-between items-center mb-2">
						<CardTitle className="text-2xl">{stages[stage as keyof typeof stages].title}</CardTitle>

						<div className="flex items-center">
							{Object.values(stages).map((currentStage) => (
								<div key={currentStage.id} className="flex items-center">
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-full ${
											currentStage.id < stage
												? 'bg-primary text-primary-foreground'
												: currentStage.id === stage
													? 'border-2 border-primary bg-background text-primary'
													: 'border-2 border-muted bg-background text-muted-foreground'
										}`}
									>
										{currentStage.id < stage ? (
											<CheckCircle className="h-4 w-4" />
										) : (
											<currentStage.icon className="h-4 w-4" />
										)}
									</div>

									{currentStage.id < Object.keys(stages).length && (
										<div
											className={`h-0.5 w-4 ${
												currentStage.id < stage ? 'bg-primary' : 'bg-muted'
											}`}
										/>
									)}
								</div>
							))}
						</div>
					</div>

					<CardDescription>{stages[stage as keyof typeof stages].description}</CardDescription>
				</CardHeader>

				<CardContent>{stages[stage as keyof typeof stages].content}</CardContent>

				<CardFooter className="flex justify-between">
					{stage > 1 ? (
						<Button variant="outline" onClick={handlePrev}>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
					) : (
						<div></div> // Empty div to maintain layout with justify-between
					)}

					{stage < 3 ? (
						<Button onClick={handleNext} disabled={!isStageValid()}>
							Next
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					) : (
						<Button onClick={handleSubmit}>Submit Application</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
