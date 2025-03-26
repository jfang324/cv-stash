import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Resume } from '@/types/Resume'
import { Eye, FileText, Trash } from 'lucide-react'

interface ResumeCardProps {
	resume: Resume
	handlePreview: (resume: Resume) => void
	handleDelete: (resume: Resume) => void
}

export const ResumeCard = ({ resume, handlePreview, handleDelete }: ResumeCardProps) => {
	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex flex-wrap justify-between gap-2">
					<div className="space-y-2">
						<CardTitle className="flex flex-row">
							<FileText className="h-4 w-4 mr-2 my-auto" />
							<span className="font-bold my-auto">{resume.name}</span>
						</CardTitle>
						<CardDescription className="flex text-xs gap-2 items-center">
							{`last modified: ${new Date(resume.lastModified).toLocaleDateString()}`}
						</CardDescription>
					</div>

					<div className="flex flex-row gap-2 py-0.5 sm:py-0">
						<Button
							variant="outline"
							size="sm"
							className="text-muted-foreground hover:text-foreground"
							onClick={() => handlePreview(resume)}
						>
							<Eye className="h-4 w-4 mr-1" />
							Preview
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="text-muted-foreground hover:text-destructive"
							onClick={() => handleDelete(resume)}
						>
							<Trash className="h-4 w-4 mr-1" />
							Delete
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<p className="text-muted-foreground text-xs line-clamp-2">{resume.textContent}</p>
			</CardContent>
		</Card>
	)
}
