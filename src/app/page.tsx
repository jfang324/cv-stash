import { Button } from '@/components/ui/button'
import { SOCIAL_LINKS } from '@/constants'
import { FileText, Github, LogIn } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const ImageCarousel = dynamic(() => import('@/components/ImageCarousel').then((mod) => mod.ImageCarousel))

export default function HomePage() {
	return (
		<div className="h-full justify-center w-full items-center">
			<section className="w-full py-16 sm:py-48">
				<div className="container flex flex-col items-center mx-auto px-6 sm:px-48 xl:px-6">
					<div className="flex w-full gap-2 mb-4">
						<FileText className="h-8 w-8" />
						<span className="text-2xl font-bold">CV Stash</span>
					</div>

					<div className="flex justify-between w-full">
						<div className="flex-1">
							<div className="flex flex-col gap-6 sm:gap-12">
								<div className="max-w-[600px] space-y-2">
									<h1 className="text-3xl font-bold sm:text-6xl tracking-tighter">
										Manage Your Resumes & Job Applications in One Place
									</h1>
									<p className="text-muted-foreground sm:text-xl">
										CV Stash helps you organize your resumes, track job applications, and land your
										dream job faster
									</p>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row">
									<Button size="lg" asChild>
										<Link href="/dashboard">
											Get Started
											<LogIn className="h-4 w-4 ml-2" />
										</Link>
									</Button>
									<Button size="lg" variant="outline" className="border border-black" asChild>
										<Link href={SOCIAL_LINKS.github} target="_blank">
											GitHub
											<Github className="h-4 w-4 ml-2" />
										</Link>
									</Button>
								</div>
							</div>
						</div>

						<div className="flex-1 hidden my-auto xl:block">
							<ImageCarousel
								images={[
									'/images/dashboard-page.webp',
									'/images/resume-page.webp',
									'/images/new-application-page-job-details.webp',
									'/images/new-application-page-resume-select.webp',
									'/images/new-application-page-summary.webp',
									'/images/settings-page.webp'
								]}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
