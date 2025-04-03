'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/services/ApiClient'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Valid email is required').min(1, 'Email is required'),
	subject: z.string().min(1, 'Subject is required'),
	message: z.string().min(1, 'Message is required')
})

export function ContactForm() {
	const { toast } = useToast()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			subject: '',
			message: ''
		}
	})

	/**
	 * Sends a support email to the configured email address
	 * @param data - The form data
	 */
	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			await apiClient.sendSupportEmail(data.name, data.email, data.subject, data.message)
			toast({ title: 'Success', description: 'Your message has been sent' })
			form.reset()
		} catch (error) {
			console.error(error)
			toast({ title: 'Error', description: 'An error occurred while sending your message' })
		}
	}

	return (
		<div className="border p-6 rounded-lg max-w-3xl mx-auto">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
					<div className="flex flex-row flex-wrap justify-between w-full gap-3">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="flex-1 min-w-[300px] space-y-0.5">
									<FormLabel className="font-semibold">Name</FormLabel>
									<FormControl>
										<Input placeholder="John Doe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex-1 min-w-[300px] space-y-0.5">
									<FormLabel className="font-semibold">Email</FormLabel>
									<FormControl>
										<Input placeholder="John.Doe@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="subject"
						render={({ field }) => (
							<FormItem className="space-y-0.5">
								<FormLabel className="font-semibold">Subject</FormLabel>
								<FormControl>
									<Input placeholder="Subject" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem className="space-y-0.5">
								<FormLabel className="font-semibold">Message</FormLabel>
								<FormControl>
									<Textarea placeholder="Message" {...field} className="min-h-[150px]" />
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
		</div>
	)
}
