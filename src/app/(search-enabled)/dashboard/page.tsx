'use client'
import { FrequencyChart } from '@/components/FrequencyChart'
import { JobApplicationForm } from '@/components/JobApplicationForm'
import { RecentActivity } from '@/components/RecentActivity'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useJobApplications } from '@/hooks/useJobApplications'
import { useResumes } from '@/hooks/useResumes'
import { calculateApplicationFrequency, calculateRecentActivity, calculateResumeUploadFrequency } from '@/lib/utils'
import { useEffect } from 'react'

export default function DashboardPage() {
    const { resumes, createResume, error: resumeError } = useResumes()
    const { jobApplications, createJobApplication, error: jobApplicationError } = useJobApplications()
    const { toast } = useToast()

    useEffect(() => {
        if (resumeError || jobApplicationError) {
            toast({ title: 'Error', description: resumeError || jobApplicationError })
        }
    }, [resumeError, jobApplicationError, toast])

    return (
        <div className="flex flex-col h-full p-6 gap-3">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Track your resume uploads and job applications</p>
            </div>

            <Tabs defaultValue="overview">
                <TabsList className="mb-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="apply">New Application</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <FrequencyChart data={calculateResumeUploadFrequency(resumes)} dataType="resumes" />
                        <FrequencyChart data={calculateApplicationFrequency(jobApplications)} dataType="applications" />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your recent resume uploads and job applications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {calculateRecentActivity(jobApplications, resumes).map((item) => (
                                <RecentActivity item={item} key={item.id} />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="apply">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Job Application</CardTitle>
                            <CardDescription>Create a new job application using your existing resumes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <JobApplicationForm
                                createJobApplication={createJobApplication}
                                createResume={createResume}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
