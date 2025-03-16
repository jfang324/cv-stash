import { SidebarTrigger } from '@/components/ui/sidebar'

export const Header = () => {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1">
                <h1 className="text-lg font-semibold">CV Stash</h1>
            </div>
        </header>
    )
}
