import { SidebarTrigger } from '@/components/ui/sidebar'

export const Header = () => {
    return (
        <header className="flex bg-background border-b h-14 gap-4 items-center px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1">
                <h1 className="text-lg font-semibold">CV Stash</h1>
            </div>
        </header>
    )
}
