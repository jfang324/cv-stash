import { Button } from '@/components/ui/button'
import { SOCIAL_LINKS } from '@/constants'
import { FileText, Github, LogIn } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const ImageCarousel = dynamic(() => import('@/components/ImageCarousel').then((mod) => mod.ImageCarousel))

export default function HomePage() {
    return (
        <div className="h-full w-full items-center justify-center">
            <section className="w-full py-16 sm:py-48">
                <div className="container mx-auto px-6 sm:px-48 xl:px-6 flex flex-col items-center">
                    <div className="flex gap-2 mb-4 w-full">
                        <FileText className="h-8 w-8" />
                        <span className="text-2xl font-bold">CV Stash</span>
                    </div>

                    <div className="flex justify-between w-full">
                        <div className="flex-1">
                            <div className="flex flex-col gap-6 sm:gap-12 ">
                                <div className="space-y-2 max-w-[600px]">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-6xl">
                                        Manage Your Resumes & Job Applications in One Place
                                    </h1>
                                    <p className="text-muted-foreground sm:text-xl">
                                        CV Stash helps you organize your resumes, track job applications, and land your
                                        dream job faster
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button size="lg" asChild>
                                        <Link href="/dashboard">
                                            Get Started
                                            <LogIn className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="border border-black" asChild>
                                        <Link href={SOCIAL_LINKS.github} target="_blank">
                                            GitHub
                                            <Github className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 hidden xl:block my-auto">
                            <ImageCarousel
                                images={[
                                    '/images/job-details-stage.webp',
                                    '/images/resume-selection-stage.webp',
                                    '/images/job-application-summary-stage.webp',
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
