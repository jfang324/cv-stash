'use client'
import { JobApplicationForm } from '@/components/JobApplicationForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, FileText } from 'lucide-react'

export default function DashboardPage() {
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
                        <Card className="w-full sm:flex-1">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="font-bold">Resume Upload Frequency</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>Coming soon...</CardContent>
                        </Card>
                        <Card className="w-full sm:flex-1">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        <span className="font-bold">Job Application Frequency</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>Coming soon...</CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your recent resume uploads and job applications</CardDescription>
                        </CardHeader>
                        <CardContent>Coming soon...</CardContent>
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
