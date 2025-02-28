'use client'
import { ResumeUploadDialog } from '@/components/ResumeUploadDialog'
import { SearchResultEntry } from '@/components/SearchResultEntry'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useSearchIndex } from '@/hooks/useSearchIndex'
import { Resume } from '@/interfaces/Resume'
import { ApiClient } from '@/services/ApiClient'
import { useUser } from '@auth0/nextjs-auth0'
import { useEffect, useMemo, useState } from 'react'

export const MainApp = () => {
    const { user, isLoading } = useUser()
    const apiClient = useMemo(() => new ApiClient(), [])
    const { toast } = useToast()
    const { searchIndex } = useSearchIndex()
    const [query, setQuery] = useState<string>('')
    const [results, setResults] = useState<Resume[]>([])

    useEffect(() => {
        const initializeUser = async () => {
            if (!isLoading && user) {
                try {
                    await apiClient.initializeUser()
                } catch (error) {
                    console.error(error)
                    toast({ title: 'Error', description: 'Failed to initialize the user' })
                }
            }
        }
        initializeUser()
    }, [user, isLoading, toast, apiClient])

    /**
     * Searches the index for the query and sets the results
     */
    const handleSearch = () => {
        try {
            const searchResults = searchIndex(query)
            setResults(searchResults)
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to search index' })
        }
    }

    /**
     * Retrieves the preSignedUrl for the resume and opens it in a new tab
     * @param resume - the Resume object to download
     */
    const handleDownload = async (resume: Resume) => {
        try {
            const presignedUrl = await apiClient.retrievePresignedUrl(resume.id)
            window.open(presignedUrl, '_blank')
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to retrieve presigned url' })
        }
    }

    return (
        <div className="w-full h-full">
            <div className="flex p-2 flex-col gap-2 sm:flex-row sm:gap-3">
                <div className="flex flex-col gap-2 sm:w-1/3">
                    <div className="grid w-full gap-1">
                        <Label className="font-semibold text-md">Search Query</Label>
                        <Textarea
                            className="border border-black"
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Paste the job description here, try to leave out unnecessary words"
                        />
                    </div>
                    <Button className="border border-black" onClick={handleSearch}>
                        Search
                    </Button>
                    <ResumeUploadDialog />
                    <Button asChild>
                        <a href="/auth/logout" className="border border-black rounded text-center">
                            Logout
                        </a>
                    </Button>
                </div>
                <div className="h-screen sm:w-2/3 flex flex-col gap-1">
                    <Label className="font-semibold text-md">{`${results.length} Search Results`}</Label>
                    <div className="flex flex-col gap-2">
                        {results.map((result) => (
                            <SearchResultEntry key={result.id} resume={result} handleDownload={handleDownload} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
