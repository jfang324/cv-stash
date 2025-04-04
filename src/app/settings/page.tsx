import { SettingsForm } from '@/components/forms/SettingsForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
	return (
		<div className="flex flex-col h-full p-6 gap-3">
			<div className="flex flex-col gap-1">
				<h2 className="text-3xl font-bold tracking-tight">Settings</h2>
				<p className="text-muted-foreground">Manage your account settings</p>
			</div>

			<Tabs defaultValue="profile">
				<TabsList className="mb-2">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<SettingsForm />
				</TabsContent>

				<TabsContent value="notifications">
					<Card>
						<CardHeader>
							<CardTitle>Notifications</CardTitle>
							<CardDescription>Manage your notification settings</CardDescription>
						</CardHeader>
						<CardContent>Coming soon...</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
