'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { JobApplicationFormFields } from '@/interfaces/JobApplicationFormFields'

interface JobDetailsStageProps {
    formData: JobApplicationFormFields
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const JobDetailsStage = ({ formData, handleInputChange }: JobDetailsStageProps) => {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="jobTitle" className="font-semibold">
                    Job Title
                </Label>
                <Input
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="e.g. Full Stack Developer"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor="companyName" className="font-semibold">
                    Company
                </Label>
                <Input
                    id="companyName"
                    name="companyName"
                    placeholder="e.g. Google"
                    value={formData.companyName}
                    onChange={handleInputChange}
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor="jobDescription" className="font-semibold">
                    Job Description
                </Label>
                <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    placeholder="Paste the job description here..."
                    className="min-h-[150px]"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    )
}
