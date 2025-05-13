'use client'
import { ResumeCard } from '@/components/ResumeCard'
import { ResumeUploadDialog } from '@/components/ResumeUploadDialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useResumes } from '@/hooks/useResumes'
import type { Resume } from '@/types/Resume'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ResumesPage() {
	const { resumes, error, pendingResume, createResume, previewResume, deleteResume } = useResumes()
	const [searchQuery, setSearchQuery] = useState('')
	const { toast } = useToast()

	useEffect(() => {
		if (error) {
			console.error(error)

			toast({ title: 'Error', description: 'Something went wrong, please try again' })
		}
	}, [error, toast])

	//filter the resumes based on the search input
	const filteredResumes = resumes?.filter((resume) => {
		const matchesSearch = new RegExp(searchQuery.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(
			resume.name.toLowerCase()
		)

		return matchesSearch
	})

	/**
	 * Callback function to update the form data after the resume is uploaded
	 * @param resume - The uploaded resume
	 */
	const uploadCallback = (resume: Resume) => {
		if (resume) {
			toast({ title: 'Success', description: 'Resume uploaded successfully' })
		}
	}

	/**
	 * Handles the deletion of a resume
	 * @param resume - The resume to delete
	 * @returns
	 */
	const handleResumeDelete = async (resume: Resume): Promise<void> => {
		const deletedResume = await deleteResume(resume)

		if (deletedResume) {
			toast({ title: 'Success', description: 'Resume deleted successfully' })
		}
	}

	return (
		<div className="flex flex-col h-full p-6 gap-3">
			<div className="flex flex-col gap-1">
				<h2 className="text-3xl font-bold tracking-tight">My Resumes</h2>
				<p className="text-muted-foreground">Manage your resumes</p>
			</div>

			<div className="space-y-3">
				<div className="flex gap-2">
					<div className="flex-1 relative">
						<Search className="h-4 text-muted-foreground w-4 -translate-y-1/2 absolute left-3 top-1/2" />
						<Input
							placeholder="Search resumes..."
							className="pl-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex">
						<ResumeUploadDialog handleResumeUpload={createResume} callBack={uploadCallback} />
					</div>
				</div>

				<div className="flex justify-between items-center">
					<p className="text-muted-foreground text-sm">
						Showing <span className="font-medium">{resumes?.length}</span> of{' '}
						<span className="font-medium">{resumes?.length}</span> resumes
					</p>
				</div>

				<div className="flex flex-col gap-3 mt-4">
					{filteredResumes?.map((resume) => (
						<ResumeCard
							key={resume.id}
							resume={resume}
							pending={pendingResume?.id === resume.id}
							handlePreview={previewResume}
							handleDelete={handleResumeDelete}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
