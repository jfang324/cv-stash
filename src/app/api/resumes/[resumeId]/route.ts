import { auth0 } from '@/lib/auth0'
import connectToDb from '@/lib/mongoConnection'
import getS3Client from '@/lib/s3'
import { MongoResumeRepository } from '@/repositories/MongoResumeRepository'
import { ResumeService } from '@/services/ResumeService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
    try {
        const session = await auth0.getSession()
        if (!session) {
            return NextResponse.json({ error: 'not authenticated', status: 401 })
        }

        const user = session.user
        if (!user || !user.sub || !user.name || !user.email) {
            return NextResponse.json({ error: 'Invalid user details' }, { status: 422 })
        }

        const { resumeId } = await params

        const connection = await connectToDb()
        const resumeRepository = new MongoResumeRepository(connection)
        const s3Client = getS3Client()
        const resumeService = new ResumeService(resumeRepository, s3Client)

        const presignedUrl = await resumeService.getPresignedUrl(resumeId, user.sub)

        return NextResponse.json({ url: presignedUrl }, { status: 200 })
    } catch (error: any) {
        console.error('Error retrieving presigned url::', error.message || error)
        return NextResponse.json({ error: error.message || 'Error retrieving resume' }, { status: 500 })
    }
}
