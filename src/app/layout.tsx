import { AppSidebar } from '@/components/AppSidebar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'CV Stash - Manage Your Resumes & Job Applications in One Place',
    description: 'Save hours per week tailoring resumes with CV Stash',
    robots: 'index, follow',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1.0,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Auth0Provider>
                    <SidebarProvider defaultOpen={false}>
                        <AppSidebar />
                        <SidebarInset>
                            <div className="flex flex-col min-h-screen w-full">
                                <Header />
                                <main className="flex-1">
                                    {children}
                                    <Toaster />
                                </main>
                                <Footer />
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </Auth0Provider>
                <Analytics />
            </body>
        </html>
    )
}
