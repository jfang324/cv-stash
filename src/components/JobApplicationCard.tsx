import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { JobApplication } from '@/types/JobApplication'
import { Briefcase, Eye, Pencil, Trash } from 'lucide-react'

interface JobApplicationCardProps {
	jobApplication: JobApplication
	handlePreview: (application: JobApplication) => void
	handleDelete: (application: JobApplication) => void
	handleUpdate: (application: JobApplication) => void
}

export const JobApplicationCard = ({
	jobApplication,
	handlePreview,
	handleDelete,
	handleUpdate
}: JobApplicationCardProps) => {
	/**
	 * A simple function to get the status color based on the job application status
	 * @param status - The status of the job application
	 * @returns The corresponding status color
	 */
	const getStatusColor = (status: JobApplication['status']) => {
		switch (status) {
			case 'Applied':
				return 'bg-blue-100 text-blue-800 hover:text-blue-800 hover:bg-blue-200'
			case 'Interviewing':
				return 'bg-purple-100 text-purple-800 hover:text-purple-800 hover:bg-purple-200'
			case 'Offer':
				return 'bg-green-100 text-green-800 hover:text-green-800 hover:bg-green-200'
			case 'Rejected':
				return 'bg-red-100 text-red-800 hover:text-red-800 hover:bg-red-200'
			case 'Withdrawn':
				return 'bg-gray-100 text-gray-800 hover:text-gray-800 hover:bg-gray-200'
		}
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col gap-2">
					<div className="flex flex-1 flex-row justify-between gap-4">
						<div className="space-y-2">
							<CardTitle className="flex flex-row">
								<Briefcase className="h-4 w-4 mr-2" />
								<span className="font-bold">{jobApplication.jobTitle}</span>
							</CardTitle>
							<CardDescription className="flex text-xs gap-2 items-center">
								{jobApplication.companyName}
							</CardDescription>
						</div>
						<div>
							<Badge className={getStatusColor(jobApplication.status)}>{jobApplication.status}</Badge>
						</div>
					</div>

					<div className="flex flex-1 justify-between gap-4 items-center sm:gap-6">
						<div className="text-muted-foreground text-xs line-clamp-2">
							{jobApplication.jobDescription}
						</div>
						<TooltipProvider>
							<div className="flex flex-row gap-2">
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant={'outline'}
											size={'icon'}
											className="h-8 w-8"
											onClick={() => handlePreview(jobApplication)}
										>
											<Eye className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>View Job Application Details</p>
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Select
											defaultValue={jobApplication.status}
											onValueChange={(value) =>
												handleUpdate({
													...jobApplication,
													status: value as JobApplication['status']
												})
											}
										>
											{/* Hack to make the select trigger look like a pencil icon */}
											<Button variant={'outline'} size={'icon'} className="h-8 w-8" asChild>
												<div className="hover:cursor-pointer">
													<SelectTrigger className="h-8 text-background w-8 absolute focus:ring-0" />
													<Pencil className="h-4 w-4" />
												</div>
											</Button>

											<SelectContent>
												<SelectItem value="Applied" className="hover:cursor-pointer">
													Applied
												</SelectItem>
												<SelectItem value="Interviewing" className="hover:cursor-pointer">
													Interviewing
												</SelectItem>
												<SelectItem value="Rejected" className="hover:cursor-pointer">
													Rejected
												</SelectItem>
												<SelectItem value="Offer" className="hover:cursor-pointer">
													Offer
												</SelectItem>
												<SelectItem value="Withdrawn" className="hover:cursor-pointer">
													Withdrawn
												</SelectItem>
											</SelectContent>
										</Select>
									</TooltipTrigger>
									<TooltipContent>
										<p>Update Job Application Status</p>
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant={'outline'}
											size={'icon'}
											className="h-8 w-8 hover:text-destructive"
											onClick={() => handleDelete(jobApplication)}
										>
											<Trash className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Delete Job Application</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</TooltipProvider>
					</div>
				</div>
			</CardHeader>
		</Card>
	)
}
