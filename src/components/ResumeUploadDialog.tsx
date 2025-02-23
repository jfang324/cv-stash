'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { parsePdf } from '@/lib/utils'
import { ApiClient } from '@/services/ApiClient'
import { useMemo, useState } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

export const ResumeUploadDialog = () => {
    const [file, setFile] = useState<File | undefined>()
    const apiClient = useMemo(() => new ApiClient(), [])
    const { toast } = useToast()

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
     * Sends a POST request with the file attached
     */
    const handleFileUpload = async () => {
        if (!file) {
            toast({ title: 'Error', description: 'No resume selected' })
            return
        }

        try {
            const textContent = await parsePdf(file)
            console.log(textContent)
            const response = await apiClient.uploadResume(file)
            console.log(response)
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'Failed to upload resume' })
        }
        apiClient.uploadResume(file)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="m-1">Upload a New Resume</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col justify-center items-center px-10 gap-3">
                <DialogTitle>Upload a New Resume</DialogTitle>
                <div
                    onClick={() => {
                        const secretInput = document.getElementById('secretInput')
                        secretInput?.click()
                    }}
                    className="hover:cursor-pointer hover:bg-gray-200 w-full"
                >
                    <Document file={file} noData={'Select a File'} className="text-center border border-black">
                        <Page pageNumber={1} scale={0.7} />
                    </Document>
                </div>
                {file && (
                    <Button className="w-full" onClick={handleFileUpload}>
                        Upload
                    </Button>
                )}
                <input type="file" id="secretInput" className="hidden" onChange={handleFileChange} />
            </DialogContent>
        </Dialog>
    )
}
