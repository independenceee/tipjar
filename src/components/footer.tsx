"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "~/public/images";
import { ThemeToggle } from "./ui/theme-toggle";
import { usePathname } from "next/navigation";
import { routers } from "~/constants/routers";

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith(routers.documentation) || pathname.startsWith(routers.login)) {
        return null;
    }
    return (
        <div className="relative z-30 border-t dark:border-white/20 bg-white/80 dark:bg-black/20  text-gray-900 dark:text-white">
            <footer className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="flex flex-col">
                    <div className="grid w-full grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
                        <div className="relative">
                            <div className="absolute -top-2 left-0 h-1 w-8 bg-gradient-to-r from-blue-500 to-transparent opacity-60"></div>
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                Stay Connected with Cardano2VN
                            </h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="mailto:cardano2vn@gmail.com"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>Support
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="mailto:hello@cardano2vn.com"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>Contact
                                        Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="https://docs.cardano2vn.com"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>Docs
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-2 left-0 h-1 w-8 bg-gradient-to-r from-blue-500 to-transparent opacity-60"></div>
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">Follow Us</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="https://www.linkedin.com/company/cardano2vn"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>
                                        LinkedIn
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="https://twitter.com/cardano2vn"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>Twitter
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-2 left-0 h-1 w-8 bg-gradient-to-r from-blue-500 to-transparent opacity-60"></div>
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">Company</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="/about"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="/roadmap"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>Roadmap
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-2 left-0 h-1 w-8 bg-gradient-to-r from-blue-500 to-transparent opacity-60"></div>
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">Legal</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="/privacy-policy"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>Privacy
                                        Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-900 dark:text-white transition-colors duration-200 hover:text-white"
                                        href="/terms"
                                    >
                                        <span className="mr-3 h-px w-2 bg-gray-600 transition-colors duration-200 group-hover:bg-white"></span>Terms
                                        of Use
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-16 border-t border-white/10 pt-8">
                        <div className="flex flex-col items-center justify-between md:flex-row">
                            <div className="mb-4 flex items-center gap-4 md:mb-0">
                                <Image className="h-8 w-auto opacity-80" src={images.logo} alt="cardano2vn" />
                                <div className="text-sm text-gray-400">Trust Protocol for Distributed Work</div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <ThemeToggle />

                                <span>|</span>
                                <span>© 2025 Cardano2VN. All rights reserved.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
