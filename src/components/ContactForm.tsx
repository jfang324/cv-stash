'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required'),
})

export function ContactForm() {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            subject: '',
            message: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        toast({ title: 'Success', description: 'Your message has been sent' })
    }

    return (
        <div className="border p-6 rounded-lg max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="flex flex-row flex-wrap justify-between w-full gap-3">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[300px] space-y-0.5">
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
                                <FormItem className="flex-1 min-w-[300px] space-y-0.5">
                                    <FormLabel className="font-semibold">Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
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
