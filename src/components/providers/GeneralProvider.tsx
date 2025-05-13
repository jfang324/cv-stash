'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export const GeneralProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<Auth0Provider>
			<QueryClientProvider client={queryClient}>
				<SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</Auth0Provider>
	)
}
