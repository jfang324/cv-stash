'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useSearchIndex } from '@/hooks/useSearchIndex'
import { Resume } from '@/interfaces/Resume'
import { parsePdf } from '@/lib/utils'
import { ApiClient } from '@/services/ApiClient'
import { Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

interface ResumeUploadDialogProps {
    callBack: (resume: Resume) => void
}

export const ResumeUploadDialog = ({ callBack }: ResumeUploadDialogProps) => {
    const [file, setFile] = useState<File | undefined>()
    const [resumeName, setResumeName] = useState<string>()
    const apiClient = useMemo(() => new ApiClient(), [])
    const { toast } = useToast()
    const { addToIndex } = useSearchIndex()

    const secretInputRef = useRef<HTMLInputElement>(null)

    /**
     * Updates the file if the user selects a different file
     * @param event - the onChange event of a file input
     * @returns
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]

        if (!selectedFile) {
            toast({ title: 'Error', description: 'No File Selected' })
            return
        }

        if (selectedFile.type !== 'application/pdf') {
            toast({ title: 'Error', description: 'Only PDF files can be uploaded' })
            return
        }

        if (selectedFile.size > 1024 * 1024 * 10) {
            toast({ title: 'Error', description: 'File size must be less than 10 MB' })
            return
        }

        setFile(selectedFile)
    }

    /**
     * Uploads the current file to the server and creates a new resume
     * @returns
     */
    const handleFileUpload = async () => {
        if (!file) {
            toast({ title: 'Error', description: 'No resume selected' })
            return
        }

        if (!resumeName) {
            toast({ title: 'Error', description: 'No resume name provided' })
            return
        }

        try {
            const textContent = await parsePdf(file)
            const response = await apiClient.uploadResume(file, resumeName, textContent)

            if (response) {
                addToIndex(response)
                toast({ title: 'Success', description: 'Resume uploaded successfully' })
                callBack(response)
            }
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to upload resume' })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline'} className="w-full">
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    Upload new resume
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col justify-center items-center gap-2 sm:px-10">
                <DialogHeader>
                    <DialogTitle>Upload a New Resume</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-xs">
                        Upload a PDF file of your resume. The file will be indexed and available for searching.
                    </DialogDescription>
                </DialogHeader>

                {!file ? (
                    <Button
                        className="w-full text-muted-foreground"
                        variant={'outline'}
                        onClick={() => {
                            secretInputRef.current?.click()
                        }}
                    >
                        Select a File
                    </Button>
                ) : (
                    <Document
                        file={file}
                        noData={'Select a File'}
                        className={`text-center ${file ? 'border border-black' : ''}`}
                    >
                        <Page pageNumber={1} scale={0.7} />
                    </Document>
                )}

                <DialogFooter className={`w-full ${!file ? 'hidden' : ''}`}>
                    <div className="flex flex-col gap-1.5 w-full">
                        <Input
                            className="border border-black"
                            placeholder="Enter a resume name"
                            onChange={(e) => setResumeName(e.target.value)}
                            defaultValue={resumeName}
                        />
                        <Button onClick={handleFileUpload}>Upload</Button>
                    </div>
                    <input type="file" className="hidden" ref={secretInputRef} onChange={handleFileChange} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
