import { auth0 } from '@/lib/auth0'
import connectToDb from '@/lib/mongoConnection'
import { MongoUserRepository } from '@/repositories/MongoUserRepository'
import { UserService } from '@/services/UserService'
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

        const connection = await connectToDb()
        const userRepository = new MongoUserRepository(connection)
        const userService = new UserService(userRepository)

        const accountDetails = await userService.createIfNewUser({ id: user.sub, name: user.name, email: user.email })

        return NextResponse.json(accountDetails, { status: 200 })
    } catch (error: any) {
        console.error('Error creating user::', error.message || error)
        return NextResponse.json({ error: error.message || 'Error creating user' }, { status: 500 })
    }
}
