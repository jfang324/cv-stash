import { calculateDateDiff } from '@/lib/utils'
import type { JobApplication } from '@/types/JobApplication'
import type { Resume } from '@/types/Resume'
import { Briefcase, FileText } from 'lucide-react'

interface RecentActivityProps {
	item: JobApplication | Resume
}

export const RecentActivity = ({ item }: RecentActivityProps) => {
	let dateDiff
	let itemType

	if ('name' in item) {
		dateDiff = calculateDateDiff(new Date(item.lastModified), new Date())
		itemType = 'resume'
	} else {
		dateDiff = calculateDateDiff(new Date(item.dateApplied), new Date())
		itemType = 'application'
	}

	return (
		<div className="flex border p-3 rounded-lg items-center">
			{itemType === 'resume' ? (
				<div className="flex flex-row w-full gap-1">
					<FileText className="h-6 w-6 mr-2 my-auto" />
					<div className="flex flex-col">
						<h1 className="text-sm font-semibold">{`Uploaded resume: ${(item as Resume).name}`}</h1>
						<p className="text-muted-foreground text-xs">
							{`${dateDiff === 0 ? 'Today' : dateDiff === 1 ? 'Yesterday' : `${dateDiff} days ago`}`}
						</p>
					</div>
				</div>
			) : (
				<div className="flex flex-row w-full gap-1">
					<Briefcase className="h-6 w-6 mr-2 my-auto" />
					<div className="flex flex-col">
						<h1 className="text-sm font-semibold">{`Applied to: ${(item as JobApplication).companyName} • ${
							(item as JobApplication).jobTitle
						}`}</h1>
						<p className="text-muted-foreground text-xs">
							{`${dateDiff === 0 ? 'today' : dateDiff === 1 ? 'yesterday' : `${dateDiff} days ago`}`}
						</p>
					</div>
				</div>
			)}
		</div>
	)
}
