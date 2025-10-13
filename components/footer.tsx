// app/components/Footer.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo and Description */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-yellow-400">Unique Novels</h3>
                    <p className="text-sm text-gray-400">
                        Dive into a world of stories with Unique Novels. Unlock premium content
                        and enhance your reading journey with our exclusive coin system.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li>
                            <a href="/profile" className="text-gray-400 hover:text-yellow-400 transition-colors">
                                Profile
                            </a>
                        </li>
                        <li>
                            <a href="/coins" className="text-gray-400 hover:text-yellow-400 transition-colors">
                                Buy Coins
                            </a>
                        </li>
                        <li>
                            <a href="/browse" className="text-gray-400 hover:text-yellow-400 transition-colors">
                                Browse Novels
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-4">Support Links</h4>
                    <ul className="space-y-2">
                        <li>
                            <a href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors">
                                T&C
                            </a>
                        </li>
                        <li>
                            <a href="/privacy-&-policies" className="text-gray-400 hover:text-yellow-400 transition-colors">
                                privacy policies
                            </a>
                        </li>
                        <li>
                            <a href="/DMCA" className="text-gray-400 hover:text-yellow-400 transition-colors">
                                DMCA
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Signup */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-4">Stay Updated</h4>
                    <p className="text-sm text-gray-400 mb-2">Subscribe to our newsletter for the latest updates.</p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full sm:flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-700 rounded-lg py-2 px-4"
                        >
                            Subscribe
                        </Button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                <p>
                    &copy; {new Date().getFullYear()} Unique Novels. All rights reserved. |{" "}
                    <a href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors">
                        Terms of Service
                    </a>{" "}
                    |{" "}
                    <a href="/privacy-&-policies" className="text-gray-400 hover:text-yellow-400 transition-colors">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;