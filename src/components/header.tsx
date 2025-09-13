"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { images } from "~/public/images";
import { routers } from "~/constants/routers";
import Image from "next/image";
import { ConnectWallet } from "~/components/connect-wallet";
import { navbars } from "~/constants/navbars";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActiveNav = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href === "/documents") return pathname.startsWith("/documents");
        if (href === "/dashboard") return pathname.startsWith("/dashboard");
        if (href === "/tipper") return pathname.startsWith("/tipper");
        return false;
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <section className="flex items-center">
                        <Link href={routers.home} className="flex items-center gap-3">
                            <Image className="h-12 w-auto animate-pulse" loading="lazy" src={images.logo} alt="Cardano2vn" />
                            <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-300 font-stretch-50%">Tipjar Hydra</h3>
                        </Link>
                    </section>
                    <section className="hidden md:flex items-center space-x-8">
                        {navbars.map((navbar) => {
                            const isActive = isActiveNav(navbar.href);
                            return (
                                <Link
                                    target={navbar.target}
                                    href={navbar.href}
                                    key={navbar.id}
                                    className={`font-medium transition-colors duration-200 relative ${
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    {navbar.title}
                                    {isActive && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />}
                                </Link>
                            );
                        })}
                    </section>
                    <ConnectWallet />

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

                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-transparent backdrop-blur-sm min-w-screen min-h-screen">
                        <div className="px-6 py-4 space-y-4 flex flex-col items-center">
                            {navbars.map(function (navbar) {
                                const isActive = isActiveNav(navbar.href);
                                return (
                                    <Link
                                        target={navbar.target}
                                        href={navbar.href}
                                        key={navbar.id}
                                        className={` space-y-3 font-medium transition-colors duration-200 relative ${
                                            isActive
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                    >
                                        {navbar.title}
                                        {isActive && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
