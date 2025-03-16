import { SOCIAL_LINKS } from '@/constants'
import { Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
    return (
        <footer className="flex h-14 items-center gap-4 border-t bg-background px-4 sm:px-6 justify-center sm:justify-end">
            <nav className="flex gap-4 sm:gap-6">
                <Link className="w-5 h-5" href={SOCIAL_LINKS.github} target="_blank">
                    <Github className="w-5 h-5" />
                    <span className="sr-only">GitHub</span>
                </Link>
                <Link className="w-5 h-5" href={SOCIAL_LINKS.linkedin} target="_blank">
                    <Linkedin className="w-5 h-5" />
                    <span className="sr-only">LinkedIn</span>
                </Link>
                <Link className="w-5 h-5" href={`mailto:${SOCIAL_LINKS.email}`} target="_blank">
                    <Mail className="w-5 h-5" />
                    <span className="sr-only">Email</span>
                </Link>
            </nav>
        </footer>
    )
}
