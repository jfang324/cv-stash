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
                <h3 className="flex font-semibold items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Job Details
                </h3>
                <Separator className="my-1" />
                <dl className="text-sm mt-2 space-y-2">
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
                <h3 className="flex font-semibold items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Selected Resume
                </h3>
                <Separator className="my-1" />
                {selectedResume && (
                    <dl className="text-sm mt-2 space-y-2">
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
