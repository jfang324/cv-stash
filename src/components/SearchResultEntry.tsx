import { Label } from '@/components/ui/label'
import { Resume } from '@/interfaces/Resume'

interface SearchResultEntryProps {
    resume: Resume
    handleDownload: (resume: Resume) => void
}

export const SearchResultEntry = ({ resume, handleDownload }: SearchResultEntryProps) => {
    return (
        <div className="flex flex-col">
            <Label
                className="hover:cursor-pointer hover:underline font-semibold text-sm"
                onClick={() => handleDownload(resume)}
            >
                {resume.name}
            </Label>
            <div className="text-xs">{`last modified: ${new Date(resume.lastModified).toLocaleDateString()}`}</div>
            <p className="text-xs text-gray-600 line-clamp-3">{resume.textContent}</p>
        </div>
    )
}
