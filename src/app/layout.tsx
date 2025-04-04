import { AppSidebar } from '@/components/AppSidebar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { UserMetadataProvider } from '@/components/providers/UserMetadataProvider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
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
				<Auth0Provider>
					<SidebarProvider defaultOpen={false}>
						<UserMetadataProvider>
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
						</UserMetadataProvider>
					</SidebarProvider>
				</Auth0Provider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	)
}
