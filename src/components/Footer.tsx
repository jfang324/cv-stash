import { SOCIAL_LINKS } from '@/constants'
import { Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
    return (
        <footer className="flex bg-background border-t h-14 justify-center gap-4 items-center px-4 sm:justify-end sm:px-6">
            <nav className="flex gap-4 sm:gap-6">
                <Link className="h-5 w-5" href={SOCIAL_LINKS.github} target="_blank">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </Link>
                <Link className="h-5 w-5" href={SOCIAL_LINKS.linkedin} target="_blank">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                </Link>
                <Link className="h-5 w-5" href={`mailto:${SOCIAL_LINKS.email}`} target="_blank">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                </Link>
            </nav>
        </footer>
    )
}
