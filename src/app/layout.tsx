import { AppSidebar } from '@/components/layout/AppSidebar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { GeneralProvider } from '@/components/providers/GeneralProvider'
import { SidebarInset } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import React from 'react'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'CV Stash - Manage Your Resumes & Job Applications in One Place',
	description: 'Save hours per week tailoring resumes with CV Stash',
	robots: 'index, follow'
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1.0
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<Script async src="https://www.googletagmanager.com/gtag/js?id=G-RNG18ZMR27"></Script>
				<Script id="google-analytics">
					{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-RNG18ZMR27');
                    `}
				</Script>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<GeneralProvider>
					<AppSidebar />
					<SidebarInset>
						<div className="flex flex-col w-full min-h-screen">
							<Header />
							<main className="flex-1">
								{children}
								<Toaster />
							</main>
							<Footer />
						</div>
					</SidebarInset>
				</GeneralProvider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	)
}
