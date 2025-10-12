"use client"

import { Mail, Shield, FileText, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function DMCAPolicy() {
    return (
        <div className="min-h-[70vh] ">

            {/* Hero Section */}
            <section className=" py-4 md:py-6 2xl:py-10">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="w-12 h-12" />
                        <h1 className="text-2xl 2xl:text-4xl md:text-5xl font-bold">DMCA Policy</h1>
                    </div>
                    <p className="text-sm md:text-xl max-w-2xl mx-auto">
                        Safeguarding intellectual property and empowering creators globally
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-4 md:py-6 2xl:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Accordion for Sections */}
                    <Accordion type="single" collapsible className="space-y-4">
                        {/* Commitment Section */}
                        <AccordionItem value="commitment" className="border-blue-200 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <AccordionTrigger className="px-4 md:px-6 text-base md:text-xl font-semibold text-blue-800 dark:text-blue-200">
                                <FileText className="w-6 h-6 mr-2" />
                                Our Dedication to Copyright Compliance
                            </AccordionTrigger>
                            <AccordionContent className="px-4 md:px-6 pb-4 space-y-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
                                <p className="leading-relaxed">
                                    At <strong>uniquenovels.com</strong>, the content on our platform features only previews or excerpts from original novels. These may include minor translation discrepancies, character name variations, or plot summaries. We urge readers to support creators by acquiring official copies in their preferred language and region where possible.
                                </p>
                                <p className="leading-relaxed">
                                    Unique Novels adheres strictly to the intellectual property rights of authors and complies fully with the <strong>Digital Millennium Copyright Act of 1998 (DMCA)</strong>. We condemn digital piracy and do not endorse it in any manner.
                                </p>
                                <p className="leading-relaxed">
                                    Our goal is to showcase global literature while upholding legal standards. All content is user-contributed and meant for personal, non-commercial use only.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* DMCA Notice Instructions */}
                        <AccordionItem value="takedown" className="border-blue-200 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <AccordionTrigger className="px-4 md:px-6 text-base md:text-xl font-semibold text-blue-800 dark:text-blue-200">
                                <AlertTriangle className="w-6 h-6 mr-2" />
                                Filing a DMCA Takedown Request
                            </AccordionTrigger>
                            <AccordionContent className="px-4 md:px-6 pb-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
                                <p className="mb-6 leading-relaxed">
                                    If you own copyright to material appearing on uniquenovels.com without permission, submit a DMCA notice for its removal.
                                </p>

                                <Separator className="my-4" />

                                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                                    Required Elements for a Valid DMCA Notice:
                                </h3>

                                <ol className="space-y-4 list-decimal pl-6">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-600">1.</span>
                                        <p>A physical or electronic signature of the authorized representative for the copyright owner.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-600">2.</span>
                                        <p>Details of the copyrighted work alleged to be infringed.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-600">3.</span>
                                        <p>Precise location of the infringing material (provide direct URLs to the content, not search pages).</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-600">4.</span>
                                        <p>Your contact details, including email, phone, and address.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-600">5.</span>
                                        <p>A declaration of good faith belief that the use is unauthorized.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-600">6.</span>
                                        <p>A statement under penalty of perjury confirming the accuracy of the information and your authorization to act.</p>
                                    </li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Contact Information */}
                        <AccordionItem value="submit" className="border-blue-200 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <AccordionTrigger className="px-4 md:px-6 text-base md:text-xl font-semibold text-blue-800 dark:text-blue-200">
                                <Mail className="w-6 h-6 mr-2" />
                                Submit a DMCA Notice
                            </AccordionTrigger>
                            <AccordionContent className="px-4 md:px-6 pb-4">
                                <div className="text-center space-y-6">
                                    <p className="text-gray-700 dark:text-gray-300 text-sm md:text-lg">Direct all DMCA notices to:</p>

                                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                                            <span className="text-2xl font-bold text-blue-800 dark:text-blue-200">Email Us</span>
                                        </div>
                                        <a
                                            href="mailto:dmca@uniquenovels.com"
                                            className="text-lg 2xl:text-2xl font-mono text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors block"
                                        >
                                            dmca@uniquenovels.com
                                        </a>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                                        onClick={() =>
                                            (window.location.href = "mailto:dmca@uniquenovels.com?subject=DMCA Takedown Notice")
                                        }
                                    >
                                        <Mail className="w-5 h-5 mr-2" />
                                        Compose Notice
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Closing Note */}
                        <AccordionItem value="note" className="border-blue-200 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <AccordionTrigger className="px-4 md:px-6 text-base md:text-xl font-semibold text-blue-800 dark:text-blue-200">
                                Important Reminder
                            </AccordionTrigger>
                            <AccordionContent className="px-4 md:px-6 pb-4 text-center text-sm md:text-base text-gray-700 dark:text-gray-300">
                                <p className="font-medium">
                                    We respond swiftly to legitimate copyright claims, investigating and removing violating content upon valid notification.
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </main>
        </div>
    )
}