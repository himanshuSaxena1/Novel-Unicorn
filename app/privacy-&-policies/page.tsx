import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Lock, Shield, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

export const metadata: Metadata = {
    title: "Privacy Policy | Unique Novels",
    description: "Privacy policy for the Unique Novels platform",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto max-w-4xl py-3 md:py-6 2xl:py-12">
            <div className="mb-3 md:mb-8 flex items-center gap-2">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-xl 2xl:text-3xl font-bold">Privacy Policy</h1>
            </div>

            <Card className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-primary mb-4">
                    <Shield className="h-5 w-5" />
                    <p className="text-sm">Last updated: April 8, 2024</p>
                </div>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#introduction" className="text-muted-foreground hover:text-primary transition-colors">Introduction</a></li>
                            <li><a href="#data-controller" className="text-muted-foreground hover:text-primary transition-colors">Data Controller</a></li>
                            <li><a href="#changes" className="text-muted-foreground hover:text-primary transition-colors">Changes</a></li>
                            <li><a href="#third-party" className="text-muted-foreground hover:text-primary transition-colors">Third-Party Links</a></li>
                            <li><a href="#data-collect" className="text-muted-foreground hover:text-primary transition-colors">Data We Collect</a></li>
                            <li><a href="#data-use" className="text-muted-foreground hover:text-primary transition-colors">How We Use Data</a></li>
                            <li><a href="#retention" className="text-muted-foreground hover:text-primary transition-colors">Data Retention</a></li>
                            <li><a href="#transfer" className="text-muted-foreground hover:text-primary transition-colors">Data Transfer</a></li>
                            <li><a href="#rights" className="text-muted-foreground hover:text-primary transition-colors">Your Rights</a></li>
                            <li><a href="#children" className="text-muted-foreground hover:text-primary transition-colors">Children&apos;s Privacy</a></li>
                            <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <ScrollArea className="md:col-span-3 h-[80vh] pr-4">
                        <div className="space-y-8">
                            <section id="introduction" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-primary" />
                                    1. Introduction
                                </h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    At Unique Novels, we respect your privacy and are committed to protecting your personal data. This Privacy
                                    Policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                                </p>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    This Privacy Policy applies to all users of Unique Novels, including readers, authors, and administrators.
                                    Please read this Privacy Policy carefully to understand our policies and practices regarding your
                                    personal data.
                                </p>
                            </section>

                            <Separator />

                            <section id="data-controller" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">2. Data Controller</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Unique Novels is the controller and responsible for your personal data (collectively referred to as
                                    &quot;Unique Novels&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot; in this Privacy Policy).
                                </p>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    If you have any questions about this Privacy Policy, including any requests to exercise your legal
                                    rights, please contact us at privacy@uniquenovels.com.
                                </p>
                            </section>

                            <Separator />

                            <section id="changes" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">3. Changes to the Privacy Policy</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                                    new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this Privacy Policy.
                                </p>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                                    Policy are effective when they are posted on this page.
                                </p>
                            </section>

                            <Separator />

                            <section id="third-party" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">4. Third-Party Links</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Our Service may contain links to third-party websites, plug-ins, and applications. Clicking on those
                                    links or enabling those connections may allow third parties to collect or share data about you. We do
                                    not control these third-party websites and are not responsible for their privacy statements. When you
                                    leave our website, we encourage you to read the privacy policy of every website you visit.
                                </p>
                            </section>

                            <Separator />

                            <section id="data-collect" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">5. Data We Collect</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    We collect several types of information from and about users of our Service, including:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground text-sm md:text-base space-y-2">
                                    <li>
                                        <strong>Personal Data:</strong> Personal Data means data about a living individual who can be
                                        identified from those data. We collect personal information such as your name, email address, and
                                        profile picture when you register for an account.
                                    </li>
                                    <li>
                                        <strong>Usage Data:</strong> Browsing behavior, time spent on genres, interactions with novels.
                                    </li>
                                    <li>
                                        <strong>Purchase History:</strong> Coins bought via PayPal, transaction timestamps, and associated name
                                    </li>
                                    <li>
                                        <strong>User-Generated Content:</strong> Reviews and comments (reviews can be deleted by users, comments cannot).
                                    </li>
                                </ul>
                            </section>

                            <Separator />

                            <section id="data-use" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">6. How We Use Your Data</h2>
                                <p className="text-muted-foreground text-sm md:text-base">Unique Novels uses the collected data for various purposes:</p>
                                <ul className="list-disc pl-6 text-muted-foreground text-sm md:text-base space-y-2">
                                    <li>To provide and maintain our Service</li>
                                    <li>To notify you about changes to our Service</li>
                                    <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                                    <li>To provide customer support</li>
                                    <li>To gather analysis or valuable information so that we can improve our Service</li>
                                    <li>To monitor the usage of our Service</li>
                                    <li>To detect, prevent and address technical issues</li>
                                    <li>
                                        Prevent misuse, fraud, and violations of our Terms of Service.
                                    </li>
                                </ul>
                            </section>

                            <Separator />

                            <section id="retention" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">7. Data Retention</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Unique Novels will retain your Personal Data only for as long as is necessary for the purposes set out in
                                    this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with
                                    our legal obligations, resolve disputes, and enforce our legal agreements and policies.
                                </p>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a
                                    shorter period of time, except when this data is used to strengthen the security or to improve the
                                    functionality of our Service, or we are legally obligated to retain this data for longer time periods.
                                </p>
                            </section>

                            <Separator />

                            <section id="transfer" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">8. Data Transfer</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Your information, including Personal Data, may be transferred to — and maintained on — computers located
                                    outside of your state, province, country or other governmental jurisdiction where the data protection
                                    laws may differ from those of your jurisdiction.
                                </p>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    If you are located outside the United States and choose to provide information to us, please note that
                                    we transfer the data, including Personal Data, to the United States and process it there.
                                </p>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Your consent to this Privacy Policy followed by your submission of such information represents your
                                    agreement to that transfer.
                                </p>
                            </section>

                            <Separator />

                            <section id="rights" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">9. Your Data Protection Rights</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Depending on your location and applicable laws, you may have the following rights regarding your
                                    personal data:
                                </p>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>The right to access</AccordionTrigger>
                                        <AccordionContent>
                                            You have the right to request copies of your personal data.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>The right to rectification</AccordionTrigger>
                                        <AccordionContent>
                                            You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete information you believe is incomplete.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>The right to erasure</AccordionTrigger>
                                        <AccordionContent>
                                            You have the right to request that we erase your personal data, under certain conditions.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>The right to restrict processing</AccordionTrigger>
                                        <AccordionContent>
                                            You have the right to request that we restrict the processing of your personal data, under certain conditions.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>The right to object to processing</AccordionTrigger>
                                        <AccordionContent>
                                            You have the right to object to our processing of your personal data, under certain conditions.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-6">
                                        <AccordionTrigger>The right to data portability</AccordionTrigger>
                                        <AccordionContent>
                                            You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    If you make a request, we have one month to respond to you. If you would like to exercise any of these
                                    rights, please contact us at privacy@uniquenovels.com.
                                </p>
                            </section>

                            <Separator />

                            <section id="children" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">10. Children&apos;s Privacy</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Our Service does not address anyone under the age of 13. We do not knowingly collect personally
                                    identifiable information from anyone under the age of 13. If you are a parent or guardian and you are
                                    aware that your child has provided us with Personal Data, please contact us. If we become aware that we
                                    have collected Personal Data from children without verification of parental consent, we take steps to
                                    remove that information from our servers.
                                </p>
                            </section>

                            <Separator />

                            <section id="contact" className="space-y-4">
                                <h2 className="text-xl 2xl:text-2xl font-semibold">11. Contact Us</h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    If you have any questions about this Privacy Policy, please contact us:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground text-sm md:text-base space-y-2">
                                    <li>By email: privacy@uniquenovels.com</li>
                                    <li>By visiting this page on our website: www.uniquenovels.com/contact</li>
                                </ul>
                            </section>
                        </div>
                    </ScrollArea>
                </div>
            </Card>
        </div>
    )
}