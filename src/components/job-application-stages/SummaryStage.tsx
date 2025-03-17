import { Separator } from '@/components/ui/separator'
import { JobApplicationFormFields } from '@/interfaces/JobApplicationFormFields'
import { Resume } from '@/interfaces/Resume'
import { Briefcase, FileText } from 'lucide-react'

interface SummaryStageProps {
    formData: JobApplicationFormFields
    selectedResume: Resume | null
}

export const SummaryStage = ({ formData, selectedResume }: SummaryStageProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Job Details
                </h3>
                <Separator className="my-1" />
                <dl className="space-y-2 mt-2 text-sm">
                    <div>
                        <dt className="text-muted-foreground">Job Title</dt>
                        <dd>{formData.jobTitle}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Company</dt>
                        <dd>{formData.companyName}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Job Description</dt>
                        <dd className="line-clamp-2">{formData.jobDescription}</dd>
                    </div>
                </dl>
            </div>

            <div>
                <h3 className="font-semibold flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Selected Resume
                </h3>
                <Separator className="my-1" />
                {selectedResume && (
                    <dl className="space-y-2 mt-2 text-sm">
                        <div>
                            <dt className="text-muted-foreground">Resume Name</dt>
                            <dd>{selectedResume.name}</dd>
                        </div>
                    </dl>
                )}
            </div>
        </div>
    )
}
