import { getJobApplicationService, handleError, validateSessionAndGetUser } from '@/lib/apiUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ jobApplicationId: string }> }) {
    try {
        const user = await validateSessionAndGetUser(['sub'])
        const jobApplicationService = await getJobApplicationService()
        const { jobApplicationId } = await params
        const body = await request.json()

        const updatedJobApplication = await jobApplicationService.updateJobApplicationById(
            jobApplicationId,
            { ...body },
            user.sub
        )

        return NextResponse.json(updatedJobApplication, { status: 200 })
    } catch (error: any) {
        return handleError(error)
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ jobApplicationId: string }> }) {
    try {
        const user = await validateSessionAndGetUser(['sub'])
        const jobApplicationService = await getJobApplicationService()
        const { jobApplicationId } = await params

        const deletedJobApplication = await jobApplicationService.deleteJobApplicationById(jobApplicationId, user.sub)

        return NextResponse.json(deletedJobApplication, { status: 200 })
    } catch (error: any) {
        return handleError(error)
    }
}
