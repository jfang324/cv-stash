'use client'
import { JobApplicationCard } from '@/components/JobApplicationCard'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { JobApplication } from '@/interfaces/JobApplication'
import { apiClient } from '@/services/ApiClient'
import { Briefcase, FileText, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ApplicationsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
    const { toast } = useToast()
    const [selectedStatus, setSelectedStatus] = useState<JobApplication['status'] | 'All'>('All')
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)

    useEffect(() => {
        const fetchJobApplications = async () => {
            try {
                const jobApplications = await apiClient.retrieveJobApplications()

                setJobApplications(jobApplications)
            } catch (error) {
                console.error(error)
                toast({ title: 'Error', description: 'Failed to retrieve job applications' })
            }
        }

        fetchJobApplications()
    }, [toast])

    const allStatuses: (JobApplication['status'] | 'All')[] = ['All']

    for (const application of jobApplications) {
        if (!allStatuses.includes(application.status)) {
            allStatuses.push(application.status)
        }
    }

    const filteredJobApplications = jobApplications.filter((application) => {
        const jobTitleMatchesSearch = new RegExp(searchQuery.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(
            application.jobTitle.toLowerCase()
        )

        const companyNameMatchesSearch = new RegExp(
            searchQuery.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        ).test(application.companyName.toLowerCase())

        const matchesSearch = jobTitleMatchesSearch || companyNameMatchesSearch
        const matchesStatus = selectedStatus === 'All' ? true : application.status === selectedStatus

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
     * Handles the deletion of a job application
     * @param application - The job application to delete
     */
    const handleDelete = async (application: JobApplication) => {
        try {
            const deletedApplication = await apiClient.deleteJobApplication(application.id)

            setJobApplications((prev) => prev.filter((app) => app.id !== deletedApplication.id))
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to delete job application' })
        }
    }

    /**
     * Handles the update of a job application
     * @param application - The job application to update
     */
    const handleUpdate = async (application: JobApplication) => {
        try {
            const updatedApplication = await apiClient.updateJobApplication(application.id, application)

            setJobApplications((prev) =>
                prev.map((app) => (app.id === updatedApplication.id ? updatedApplication : app))
            )
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to update job application' })
        }
    }

    const handlePreviewResume = async () => {
        if (!selectedApplication?.resume) return

        try {
            const presignedUrl = await apiClient.retrievePresignedUrl(selectedApplication.resume.id)

            window.open(presignedUrl, '_blank')
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to retrieve presigned url' })
        }
    }

    return (
        <div className="flex flex-col gap-3 h-full p-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
                <p className="text-muted-foreground">Manage your job applications</p>
            </div>
            <div className="space-y-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
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
                            handleDelete={handleDelete}
                            handleUpdate={handleUpdate}
                        />
                    ))}
                </div>

                {selectedApplication && (
                    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    {selectedApplication.jobTitle}
                                </DialogTitle>
                                <DialogDescription>{selectedApplication.companyName}</DialogDescription>
                            </DialogHeader>

                            <Separator />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                                        <p>{selectedApplication.companyName}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-medium text-muted-foreground">Resume Used</h3>
                                        <div className="flex items-center">
                                            <FileText className="h-4 w-4 mr-1 text-primary" />
                                            <p
                                                className="hover:underline hover:cursor-pointer"
                                                onClick={handlePreviewResume}
                                            >
                                                {selectedApplication.resume.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-medium text-muted-foreground">Applied Date</h3>
                                        <p>{new Date(selectedApplication.lastModified).toDateString()}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                        <p>{selectedApplication.status}</p>
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
