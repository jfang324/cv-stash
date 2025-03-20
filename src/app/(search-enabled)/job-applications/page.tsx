'use client'
import { JobApplicationCard } from '@/components/JobApplicationCard'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useJobApplications } from '@/hooks/useJobApplications'
import { JobApplication } from '@/interfaces/JobApplication'
import { apiClient } from '@/services/ApiClient'
import { Briefcase, FileText, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function JobApplicationsPage() {
    const { jobApplications, updateJobApplication, deleteJobApplication, error } = useJobApplications()
    const [selectedStatus, setSelectedStatus] = useState<JobApplication['status'] | 'All'>('All')
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        if (error) {
            toast({ title: 'Error', description: error })
        }
    }, [error, toast])

    const allStatuses: (JobApplication['status'] | 'All')[] = [
        'All',
        ...new Set(jobApplications.map((app) => app.status)),
    ]

    const filteredJobApplications = jobApplications.filter((application) => {
        const searchRegex = new RegExp(searchQuery.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

        const jobTitleMatchesSearch = searchRegex.test(application.jobTitle.toLowerCase())
        const companyNameMatchesSearch = searchRegex.test(application.companyName.toLowerCase())

        const matchesSearch = jobTitleMatchesSearch || companyNameMatchesSearch
        const matchesStatus = selectedStatus === 'All' || application.status === selectedStatus

        return matchesSearch && matchesStatus
    })

    /**
     * Handles the preview of a job application
     * @param application - The job application to preview
     */
    const handlePreview = (application: JobApplication) => {
        setSelectedApplication(application)
        setShowDetailsDialog(true)
    }

    /**
     * Handles the preview of the resume associated with the selected job application
     */
    const handlePreviewResume = async () => {
        if (!selectedApplication?.resume) return

        try {
            const presignedUrl = await apiClient.getPresignedUrl(selectedApplication.resume)

            window.open(presignedUrl, '_blank')
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to retrieve presigned url' })
        }
    }

    return (
        <div className="flex flex-col h-full p-6 gap-3">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
                <p className="text-muted-foreground">Manage your job applications</p>
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
                    <div>
                        <Select
                            defaultValue={selectedStatus}
                            onValueChange={(value) => setSelectedStatus(value as JobApplication['status'])}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={selectedStatus} />
                            </SelectTrigger>
                            <SelectContent>
                                {allStatuses.map((status) => (
                                    <SelectItem value={status} key={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-muted-foreground text-sm">
                        Showing <span className="font-medium">{jobApplications.length}</span> of{' '}
                        <span className="font-medium">{jobApplications.length}</span> job applications
                    </p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    {filteredJobApplications.map((application) => (
                        <JobApplicationCard
                            key={application.id}
                            jobApplication={application}
                            handlePreview={handlePreview}
                            handleDelete={deleteJobApplication}
                            handleUpdate={updateJobApplication}
                        />
                    ))}
                </div>

                {selectedApplication && (
                    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle className="flex gap-2 items-center">
                                    <Briefcase className="h-5 w-5" />
                                    {selectedApplication.jobTitle}
                                </DialogTitle>
                                <DialogDescription>{selectedApplication.companyName}</DialogDescription>
                            </DialogHeader>

                            <Separator />

                            <div className="grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <div className="space-y-0.5">
                                        <h3 className="text-muted-foreground text-sm font-medium">Company</h3>
                                        <p>{selectedApplication.companyName}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-muted-foreground text-sm font-medium">Status</h3>
                                        <p>{selectedApplication.status}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-muted-foreground text-sm font-medium">Resume Used</h3>
                                        <div className="flex items-center">
                                            <FileText className="h-4 text-primary w-4 mr-1" />
                                            <p
                                                className="hover:cursor-pointer hover:underline"
                                                onClick={handlePreviewResume}
                                            >
                                                {selectedApplication.resume.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="space-y-0.5">
                                        <h3 className="text-muted-foreground text-sm font-medium">Applied Date</h3>
                                        <p>{new Date(selectedApplication.dateApplied).toDateString()}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-muted-foreground text-sm font-medium">Last Modified</h3>
                                        <p>{new Date(selectedApplication.lastModified).toDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    )
}
