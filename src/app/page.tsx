'use client'
import { MainApp } from '@/components/MainApp'
import { Button } from '@/components/ui/button'
import { useUser } from '@auth0/nextjs-auth0'
import { useEffect } from 'react'
import { pdfjs } from 'react-pdf'

export default function Home() {
    const { user, isLoading } = useUser()

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
    }, [])

    //if the user credentials are loading display that
    if (isLoading) return <div>Loading...</div>

    //if the user is not authenticated display a login page
    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Welcome to CV Stash</h1>
                    <p className="text-lg">Please log in to continue</p>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <Button
                            onClick={() => {
                                window.location.href = '/auth/login'
                            }}
                        >
                            Log In
                        </Button>
                        <Button onClick={() => (window.location.href = 'https://github.com/jfang324/cv-stash')}>
                            GitHub
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return <MainApp />
}
