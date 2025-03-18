'use client'
import { ResumeUploadDialog } from '@/components/ResumeUploadDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useSearchIndex } from '@/hooks/useSearchIndex'
import { Resume } from '@/interfaces/Resume'
import { apiClient } from '@/services/ApiClient'
import { Eye, FileText, Search, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ResumesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [resumes, setResumes] = useState<Resume[]>([])
    const { addToIndex, removeFromIndex } = useSearchIndex()
    const { toast } = useToast()

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const resumes = await apiClient.retrieveResumes()

                setResumes(resumes)
            } catch (error) {
                console.error(error)
                toast({ title: 'Error', description: 'Failed to retrieve resumes' })
            }
        }

        fetchResumes()
    }, [toast])

    //filter the resumes based on the search input
    const filteredResumes = resumes.filter((resume) => {
        const matchesSearch = new RegExp(searchQuery.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(
            resume.name.toLowerCase()
        )

        return matchesSearch
    })

    /**
     * A callback function to sync up the index and the resumes state after uploading a resume
     * @param resume
     */
    const handleAddResume = async (resume: Resume) => {
        setResumes([...resumes, resume])
        addToIndex(resume)
    }

    /**
     * Retrieves the preSignedUrl for a resume and opens it in a new tab
     * @param resumeId - The id of the resume to preview
     */
    const handlePreviewResume = async (resumeId: string) => {
        try {
            const url = await apiClient.retrievePresignedUrl(resumeId)

            window.open(url, '_blank')
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to retrieve resume' })
        }
    }

    /**
     * Deletes a resume from the resumes state and the search index
     * @param resumeId - The id of the resume to delete
     * @returns The deleted resume object
     */
    const handleDeleteResume = async (resumeId: string) => {
        try {
            const resume = await apiClient.deleteResume(resumeId)

            setResumes(resumes.filter((r) => r.id !== resume.id))
            removeFromIndex(resume)
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to delete resume' })
        }
    }

    return (
        <div className="flex flex-col gap-3 h-full p-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">My Resumes</h2>
                <p className="text-muted-foreground">Manage your resumes</p>
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
                    <div className="flex">
                        <ResumeUploadDialog callBack={handleAddResume} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{resumes.length}</span> of{' '}
                        <span className="font-medium">{resumes.length}</span> resumes
                    </p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    {filteredResumes.map((resume) => (
                        <Card key={resume.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between flex-wrap gap-2">
                                    <div className="space-y-2">
                                        <CardTitle className="flex flex-row">
                                            <FileText className="mr-2 h-4 w-4 my-auto" />
                                            <span className="font-bold my-auto">{resume.name}</span>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 text-xs">
                                            {`last modified: ${new Date(resume.lastModified).toLocaleDateString()}`}
                                        </CardDescription>
                                    </div>

                                    <div className="flex flex-row gap-2 py-0.5 sm:py-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground"
                                            onClick={() => handlePreviewResume(resume.id)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Preview
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteResume(resume.id)}
                                        >
                                            <Trash className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="line-clamp-2 text-muted-foreground text-xs">{resume.textContent}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
