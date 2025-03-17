'use client'
import { SearchIndexProvider } from '@/components/SearchIndexProvider'
import { useEffect } from 'react'
import { pdfjs } from 'react-pdf'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
    }, [])

    return <SearchIndexProvider>{children}</SearchIndexProvider>
}
