'use client'
import { FrequencyChart } from '@/components/FrequencyChart'
import { JobApplicationForm } from '@/components/JobApplicationForm'
import { RecentActivity } from '@/components/RecentActivity'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { JobApplication } from '@/interfaces/JobApplication'
import { Resume } from '@/interfaces/Resume'
import { calculateApplicationFrequency, calculateRecentActivity, calculateResumeUploadFrequency } from '@/lib/utils'
import { apiClient } from '@/services/ApiClient'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
    const [resumes, setResumes] = useState<Resume[]>([])
    const [applications, setApplications] = useState<JobApplication[]>([])
    const { toast } = useToast()

    //TODO: make it so that if a new resume or application is added by the new application form, it will be added to the dashboard
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedResumes = await apiClient.retrieveResumes()
                const fetchedApplications = await apiClient.retrieveJobApplications()

                setResumes(fetchedResumes)
                setApplications(fetchedApplications)
            } catch (error) {
                console.error(error)
                toast({ title: 'Error', description: 'Failed to retrieve data' })
            }
        }

        fetchData()
    }, [toast])

    return (
        <div className="flex flex-col gap-3 h-full p-6">
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
                        <FrequencyChart data={calculateApplicationFrequency(applications)} dataType="applications" />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your recent resume uploads and job applications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {calculateRecentActivity(applications, resumes).map((item) => (
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
                            <JobApplicationForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
