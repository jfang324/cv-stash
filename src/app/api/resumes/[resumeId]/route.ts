import { getResumeService, handleError, validateSessionAndGetUser } from '@/lib/apiUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
	try {
		const user = await validateSessionAndGetUser(['sub'])
		const resumeService = await getResumeService()
		const { resumeId } = await params

		const presignedUrl = await resumeService.getPresignedUrl(resumeId, user.sub)

		return NextResponse.json({ url: presignedUrl }, { status: 200 })
	} catch (error) {
		return handleError(error, 'Error getting presigned URL')
	}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
	try {
		const user = await validateSessionAndGetUser(['sub'])
		const resumeService = await getResumeService()
		const { resumeId } = await params

		const deletedResume = await resumeService.deleteResumeById(resumeId, user.sub)

		return NextResponse.json(deletedResume, { status: 200 })
	} catch (error) {
		return handleError(error, 'Error deleting resume')
	}
}
