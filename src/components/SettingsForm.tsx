'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useUserMetadata } from '@/hooks/useUserMetadata'
import { ApiClient } from '@/services/ApiClient'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    profilePicture: z.string().min(1, 'Profile picture is required'),
})

export const SettingsForm = () => {
    const { user, refreshUserMetadata } = useUserMetadata()
    const { toast } = useToast()
    const apiClient = useMemo(() => new ApiClient(), [])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            profilePicture: user?.profilePicture || '',
        },
    })

    useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
            })
        }
    }, [form, user])

    /**
     * Handles form submission
     */
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await apiClient.updateUser(data)

            refreshUserMetadata()
            toast({ title: 'Success', description: 'Your account details have been updated' })
        } catch (error) {
            console.error(error)
            toast({ title: 'Error', description: 'There was an error updating your account details' })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="space-y-0.5">
                                    <FormLabel className="font-semibold">First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="space-y-0.5">
                                    <FormLabel className="font-semibold">Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="profilePicture"
                            render={({ field }) => (
                                <FormItem className="space-y-0.5">
                                    <FormLabel className="font-semibold">Profile Picture</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/profile-picture.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-2">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
