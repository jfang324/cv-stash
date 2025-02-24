import { auth0 } from '@/lib/auth0'
import connectToDb from '@/lib/mongoConnection'
import getS3Client from '@/lib/s3'
import { MongoResumeRepository } from '@/repositories/MongoResumeRepository'
import { ResumeService } from '@/services/ResumeService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const session = await auth0.getSession()
        if (!session) {
            return NextResponse.json({ error: 'not authenticated', status: 401 })
        }

        const user = session.user
        if (!user || !user.sub || !user.name || !user.email) {
            return NextResponse.json({ error: 'Invalid user details' }, { status: 422 })
        }

        const formData = await request.formData()
        const resumeFile = formData.get('file')
        const textContent = formData.get('text')

        if (!resumeFile || !(resumeFile instanceof File)) {
            return NextResponse.json({ error: 'No PDF provided' }, { status: 400 })
        }

        if (!textContent) {
            return NextResponse.json({ error: 'Text content may be parsed incorrectly' }, { status: 400 })
        }

        const connection = await connectToDb()
        const resumeRepository = new MongoResumeRepository(connection)
        const s3Client = getS3Client()
        const resumeService = new ResumeService(resumeRepository, s3Client)

        const newResume = await resumeService.createResume(
            { name: 'McDonalds Resume', textContent: textContent as string },
            user.sub,
            resumeFile
        )

        return NextResponse.json(newResume, { status: 200 })
    } catch (error: any) {
        console.error('Error creating resume::', error.message || error)
        return NextResponse.json({ error: error.message || 'Error creating resume' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth0.getSession()
        if (!session) {
            return NextResponse.json({ error: 'not authenticated', status: 401 })
        }

        const user = session.user
        if (!user || !user.sub || !user.name || !user.email) {
            return NextResponse.json({ error: 'Invalid user details' }, { status: 422 })
        }

        const connection = await connectToDb()
        const resumeRepository = new MongoResumeRepository(connection)
        const s3Client = getS3Client()
        const resumeService = new ResumeService(resumeRepository, s3Client)

        const resumes = await resumeService.getResumesByOwnerId(user.sub)

        return NextResponse.json(resumes, { status: 200 })
    } catch (error: any) {
        console.error('Error retrieving resumes::', error.message || error)
        return NextResponse.json({ error: error.message || 'Error retrieving resumes' }, { status: 500 })
    }
}
