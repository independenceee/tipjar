"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { images } from "~/public/images";
import { routers } from "~/constants/routers";
import Image from "next/image";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-10 p-4 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <section className="flex items-center">
                        <Link href={routers.home} className="flex items-center gap-3">
                            <Image className="h-12 w-auto animate-pulse" loading="lazy" src={images.logo} alt="Cardano2vn" />
                            <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-300 font-stretch-50%">Tipjar Hydra</h3>
                        </Link>
                    </section>

                    {/* Desktop: Connect Wallet */}
                    <section className="hidden md:block">
                        <Link
                            rel="noopener noreferrer"
                            href={routers.login}
                            className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-gray-800/50 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:border-white/50 hover:bg-gray-700/50"
                        >
                            <span>Connect Wallet</span>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </Link>
                    </section>

                    {/* Mobile: Hamburger menu */}
                    <section className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </section>
                </div>

                {/* Mobile menu content */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-sm">
                        <div className="px-6 py-4 space-y-4">
                            {/* Links */}
                            <div className="space-y-3"></div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
