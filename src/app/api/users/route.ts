import { getUserService, handleError, validateSessionAndGetUser } from '@/lib/apiUtils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const user = await validateSessionAndGetUser(['sub', 'picture', 'email'])
        const userService = await getUserService()

        const accountDetails = await userService.createIfNewUser({
            id: user.sub,
            profilePicture: user.picture!,
            firstName: 'John',
            lastName: 'Doe',
            email: user.email!,
            notifications: false,
        })

        return NextResponse.json(accountDetails, { status: 200 })
    } catch (error: any) {
        return handleError(error)
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await validateSessionAndGetUser(['sub'])
        const userService = await getUserService()
        const body = await request.json()

        const accountDetails = await userService.updateUser(user.sub, { ...body })

        return NextResponse.json(accountDetails, { status: 200 })
    } catch (error: any) {
        return handleError(error)
    }
}
