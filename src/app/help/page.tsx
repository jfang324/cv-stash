import { ContactForm } from '@/components/ContactForm'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FAQ } from '@/constants'
import { BookOpen, Contact, HelpCircle, Mail, Video } from 'lucide-react'

export default function HelpPage() {
    return (
        <div className="flex flex-col h-full p-6 gap-3">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
                <p className="text-muted-foreground">Get help with using CV Stash</p>
            </div>

            <Tabs defaultValue="faq">
                <TabsList className="grid grid-cols-2 w-full md:grid-cols-4 md:w-auto">
                    <TabsTrigger value="faq" className="flex gap-2 items-center">
                        <HelpCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">FAQ</span>
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex gap-2 items-center">
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Contact Us</span>
                    </TabsTrigger>
                    <TabsTrigger value="guides" className="flex gap-2 items-center">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Guides</span>
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="flex gap-2 items-center">
                        <Video className="h-4 w-4" />
                        <span className="hidden sm:inline">Video Tutorials</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="faq">
                    <Card>
                        <CardHeader>
                            <CardTitle>FAQ</CardTitle>
                            <CardDescription>Frequently asked questions about CV Stash</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion className="w-full" type="single" collapsible>
                                {FAQ.map((item, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left font-semibold">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground">{item.answer}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card>
                        <CardHeader className="flex flex-col gap-1">
                            <CardTitle>Contact Us</CardTitle>
                            <CardDescription>Fill out the form below to get in touch with us</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="guides">
                    <Card>
                        <CardHeader>
                            <CardTitle>Guides</CardTitle>
                            <CardDescription>Learn how to use CV Stash effectively</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="videos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Video Tutorials</CardTitle>
                            <CardDescription>Watch video tutorials to learn how to use CV Stash</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
