import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BookOpen, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
    title: "Terms and Conditions | Unique Novels",
    description: "Terms and conditions for using the Unique Novels platform",
}

export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-4xl py-3 md:py-6 2xl:py-12">
            <div className="mb-3 md:mb-8 flex items-center gap-2">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-xl 2xl:text-3xl font-bold">Terms and Conditions</h1>
            </div>

            <Card className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-primary">
                    <BookOpen className="h-5 w-5" />
                    <p className="text-sm">Last updated: April 8, 2024</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4 md:space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">1. Introduction</h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Welcome to Unique Novels. These Terms and Conditions outline the rules and guidelines for using our website, and related services. By registering, browsing, or interacting with Unique Novels, you agree to follow the terms outlined below. If you do not agree with them, please do not use our platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">2. Definitions</h2>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 text-sm md:text-base">
                            <li>
                                <strong>Service</strong> refers to the Unique Novels website operated by Unique Novels.
                            </li>
                            <li>
                                <strong>User</strong> refers to the individual accessing or using the Service, or the company, or other
                                legal entity on behalf of which such individual is accessing or using the Service.
                            </li>
                            <li>
                                <strong>Content</strong> refers to novels, chapters, reviews, comments, and other material available
                                through the Service.
                            </li>
                            <li>
                                <strong>Coins</strong> refers to the virtual currency used within the Service.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">3. Account Registration</h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            To access certain features of Unique Novels, such as saving your reading progress, purchasing content, or posting reviews, you must create an account. We require a valid email address and password. Passwords are stored securely in hashed form.
                        </p>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Users are responsible for all activities that occur under their account. Please keep your login credentials confidential and notify us immediately of any unauthorized use.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">4. Content</h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Some chapters on our platform are free, while others can be unlocked using Coins – our virtual currency.
                        </p>
                        <p className="text-muted-foreground">
                            <ul className="text-sm md:text-base text-muted-foreground pl-4 space-y-1">
                                <li>Coins can be purchased through PayPal with real money.</li>
                                <li>They are non-refundable and hold no cash value outside Unique Novels.</li>
                                <li>Coins cannot be exchanged, gifted, or transferred.</li>
                            </ul>
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">5. Coins and Purchases</h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Coins are a virtual currency that can be used to purchase chapters and other content on the Service. Coins
                            have no real-world value and cannot be exchanged for cash or other items of monetary value from us or any
                            other party except as explicitly provided in these Terms.
                        </p>
                        <p className="text-muted-foreground text-sm md:text-base">
                            All purchases of Coins are final and non-refundable, except as required by applicable law. We reserve the
                            right to modify, manage, control and/or eliminate Coins at our sole discretion. Prices and availability of
                            Coins are subject to change without notice.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">6. Intellectual Property</h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            All content, including translated works, design elements, and platform features, are either owned by Unique Novels or used with proper licensing. You may not copy, reuse, or distribute content without written permission.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">7. Termination</h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            We may terminate or suspend your account and bar access to the Service immediately, without prior notice
                            or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
                            not limited to a breach of the Terms.
                        </p>
                        <p className="text-muted-foreground text-sm md:text-base">
                            If you wish to terminate your account, you may simply discontinue using the Service, or notify us that you
                            wish to delete your account.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">8. Limitation of Liability</h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            While we work hard to ensure a smooth and secure experience, Unique Novels cannot guarantee that the platform will always be error-free or uninterrupted. We are not liable for any damages arising from:
                        </p>
                        <p className="text-muted-foreground">
                            <ul className="text-muted-foreground pl-4 space-y-1 text-sm md:text-base">
                                <li>Temporary outages or technical glitches.</li>
                                <li>Unauthorized use of your account.</li>
                                <li>Content inaccuracies or third-party content.</li>
                                <li>Loss of data, access, or virtual currency.</li>
                            </ul>
                            By using our platform, you acknowledge these risks and agree to use the Service at your own discretion.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">9. Changes to Terms</h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
                            is material we will provide at least 30 day&apos;s notice prior to any new terms taking effect. What
                            constitutes a material change will be determined at our sole discretion.
                        </p>
                        <p className="text-muted-foreground text-sm md:text-base">
                            By continuing to access or use our Service after any revisions become effective, you agree to be bound by
                            the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-base 2xl:text-2xl font-semibold">10. Contact Us</h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            If you have any questions about these Terms, please contact us at support@uniquenovels.com.
                        </p>
                    </section>
                </div>
            </Card>
        </div>
    )
}