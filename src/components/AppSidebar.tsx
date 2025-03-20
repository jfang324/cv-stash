'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useUserMetadata } from '@/hooks/useUserMetadata'
import {
    Briefcase,
    ChevronDown,
    FileText,
    HelpCircle,
    LayoutDashboard,
    LogIn,
    LogOut,
    Settings,
    User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const AppSidebar = () => {
    const pathname = usePathname()
    const { user } = useUserMetadata()

    const navItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'My Resumes',
            href: '/resumes',
            icon: FileText,
        },
        {
            title: 'Job Applications',
            href: '/job-applications',
            icon: Briefcase,
        },
        {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
        },
        {
            title: 'Help & Support',
            href: '/help',
            icon: HelpCircle,
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex bg-primary justify-center rounded-lg text-primary-foreground aspect-square items-center size-8">
                                    <FileText className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">CV Stash</span>
                                    <span className="text-muted-foreground text-xs">Manage your resumes</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-3">
                <SidebarMenu>
                    {user ? (
                        <>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4 mr-2" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </>
                    ) : (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Button variant="outline" asChild>
                                    <a href="/auth/login?returnTo=/dashboard">
                                        Login
                                        <LogIn className="h-4 w-4 ml-2" />
                                    </a>
                                </Button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarContent>

            {user && (
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <Avatar className="border h-6 w-6 mr-2">
                                            <AvatarImage src={user.profilePicture} alt="User" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm">{`${user.firstName} ${user.lastName}`}</span>
                                            <span className="text-muted-foreground text-xs">{user.email}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                                        <Link href="/settings">
                                            <User className="h-4 w-4 mr-2" />
                                            <span>My Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                                        <Link href="/settings">
                                            <Settings className="h-4 w-4 mr-2" />
                                            <span>Account Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                                        <a href="/auth/logout">
                                            <LogOut className="h-4 w-4 mr-2" />
                                            <span>Log out</span>
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            )}
        </Sidebar>
    )
}
