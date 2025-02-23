import { auth0 } from '@/lib/auth0'
import connectToDb from '@/lib/mongoConnection'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const session = await auth0.getSession()
    if (!session) {
        return NextResponse.json({ error: 'not authenticated', status: 401 })
    }

    const user = session.user
    if (!user || !user.sub || !user.name || !user.email) {
        return NextResponse.json({ error: 'Invalid user details' }, { status: 422 })
    }

    const formData = await request.formData()
    const resume = formData.get('file')

    if (!resume || !(resume instanceof File)) {
        return NextResponse.json({ error: 'No PDF provided' }, { status: 400 })
    }

    return NextResponse.json('Hello World', { status: 200 })
}
