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
        <>
            <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 border-b border-gray-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <section className="flex items-center">
                            <Link href={routers.home} className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
                                <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-purple-500/20">
                                    <Image
                                        className="h-10 w-auto transition-transform duration-300 group-hover:rotate-3"
                                        loading="lazy"
                                        src={images.logo}
                                        alt="Tipjar Hydra"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-stretch-50%  sm:block">
                                    Tipjar Hydra
                                </h3>
                            </Link>
                        </section>

                        {/* Desktop Navigation */}
                        <section className="hidden md:flex items-center space-x-8">
                            {navbars.map((navbar) => {
                                const isActive = isActiveNav(navbar.href);
                                return (
                                    <Link
                                        target={navbar.target}
                                        href={navbar.href}
                                        key={navbar.id}
                                        className={`group relative font-medium transition-all duration-300 flex items-center gap-1 ${
                                            isActive
                                                ? "text-purple-600 dark:text-purple-400"
                                                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                        onClick={closeMenu}
                                    >
                                        <span>{navbar.title}</span>
                                        <div
                                            className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                                                isActive ? "scale-x-100" : ""
                                            }`}
                                        />
                                        {isActive && (
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/25 animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </section>

                        {/* Connect Wallet */}
                        <ConnectWallet />

                        {/* Mobile: Hamburger menu */}
                        <section className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 border border-gray-200/50 dark:border-slate-600/50 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-700 dark:hover:to-slate-600 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            >
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 transition-opacity duration-300 ${
                                        isMenuOpen ? "opacity-20" : ""
                                    }`}
                                />
                                {isMenuOpen ? <X className="w-6 h-6 relative z-10" /> : <Menu className="w-6 h-6 relative z-10" />}
                            </button>
                        </section>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 dark:bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
                        onClick={closeMenu}
                    />
                    <div className="fixed top-20 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 shadow-lg animate-slideDown">
                        <div className="px-6 py-6 space-y-6 flex flex-col items-center w-full h-screen">
                            {navbars.map((navbar) => {
                                const isActive = isActiveNav(navbar.href);
                                return (
                                    <Link
                                        target={navbar.target}
                                        href={navbar.href}
                                        key={navbar.id}
                                        onClick={closeMenu}
                                        className={`relative font-semibold text-xl transition-all duration-300 flex items-center gap-2 py-3 px-4 rounded ${
                                            isActive
                                                ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                                                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50"
                                        }`}
                                    >
                                        <span>{navbar.title}</span>
                                        {isActive && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                        <div
                                            className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 -z-10 transition-all duration-300 scale-0 origin-left ${
                                                isActive ? "scale-100" : "group-hover:scale-100"
                                            }`}
                                        />
                                    </Link>
                                );
                            })}
                            <div className="pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                                <ConnectWallet />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
