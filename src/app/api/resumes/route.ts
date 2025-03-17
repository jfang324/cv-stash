import { Resume } from '@/interfaces/Resume'
import { getResumeService, handleError, validateResumeFormData, validateSessionAndGetUser } from '@/lib/apiUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const user = await validateSessionAndGetUser(['sub'])
        const resumeService = await getResumeService()

        const formData = await request.formData()
        const { resumeFile, resumeName, textContent } = validateResumeFormData(formData)

        const newResume = await resumeService.createResume(
            {
                name: resumeName,
                textContent: textContent,
            } as Omit<Resume, 'id | lastModified'>,
            user.sub,
            resumeFile
        )

        return NextResponse.json(newResume, { status: 200 })
    } catch (error: any) {
        return handleError(error)
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await validateSessionAndGetUser(['sub'])
        const resumeService = await getResumeService()

        const userResumes = await resumeService.getResumesByOwnerId(user.sub)

        return NextResponse.json(userResumes, { status: 200 })
    } catch (error: any) {
        return handleError(error)
    }
}
