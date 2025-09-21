"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Action from "~/components/action";
import Contact from "~/components/contact";
import { routers } from "~/constants/routers";
import { images } from "~/public/images*";

export default function Home() {
    return (
        <main>
            <motion.section
                id="Landing"
                className="relative flex min-h-screen items-center overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                        },
                    },
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <div className="text-center">
                        <div className="text-9xl font-bold text-gray-300 dark:text-white/10">HYDRA</div>
                        <div className="text-6xl font-bold text-gray-300 dark:text-white/10">TIPJAR</div>
                        <div className="text-4xl font-bold text-gray-300 dark:text-white/10">MICROPAYMENTS FOR CARDANO</div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <div className="relative">
                        <div className="grid items-center gap-8 lg:grid-cols-2">
                            <motion.section
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.8,
                                            ease: "easeOut",
                                        },
                                    },
                                }}
                                className="relative"
                            >
                                <h1 className="mb-10 text-5xl font-bold lg:text-8xl">
                                    <span className="block tracking-tight text-gray-900 dark:text-white">Decentralized</span>
                                    <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text tracking-tight text-gray-900 dark:text-transparent drop-shadow-lg">
                                        Tipping
                                    </span>
                                    <span className="mt-4 block text-2xl font-normal text-gray-600 dark:text-gray-300 lg:text-4xl">
                                        Powered by Cardano Hydra
                                    </span>
                                </h1>
                                <div className="relative mb-12 border-l-2 border-gray-300 dark:border-white/20 pl-6">
                                    <motion.p
                                        variants={{
                                            hidden: { opacity: 0, y: 50 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    duration: 0.8,
                                                    ease: "easeOut",
                                                },
                                            },
                                        }}
                                        className="mb-6 text-xl leading-relaxed text-gray-600 dark:text-gray-300"
                                    >
                                        <strong className="text-gray-900 dark:text-white">Send and receive tips instantly</strong> with negligible
                                        fees using Cardano Layer 2 Hydra protocol. Empower creators and communities with fast, secure, and open-source
                                        micropayments.
                                    </motion.p>
                                    <motion.p
                                        variants={{
                                            hidden: { opacity: 0, y: 50 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    duration: 0.8,
                                                    ease: "easeOut",
                                                },
                                            },
                                        }}
                                        className="text-lg text-gray-500 dark:text-gray-400"
                                    >
                                        Open participation. Global opportunity.
                                    </motion.p>
                                </div>
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 50 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.8,
                                                ease: "easeOut",
                                            },
                                        },
                                    }}
                                    className="flex flex-col gap-6 sm:flex-row"
                                >
                                    <Link
                                        href={routers.home}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-xl bg-blue-600 dark:bg-white px-8 py-4 font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100"
                                    >
                                        Go to Dashboard
                                    </Link>
                                    <Link
                                        href={routers.login}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-white/50 px-8 py-4 text-lg font-semibold text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Learn More
                                    </Link>
                                </motion.div>
                            </motion.section>
                            <motion.section
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.8,
                                            ease: "easeOut",
                                        },
                                    },
                                }}
                                className="relative hidden lg:block"
                            >
                                <div className="relative">
                                    <div className="relative h-[55vh] w-full">
                                        <motion.div
                                            className="absolute left-12 top-0 z-10 h-48 w-56 -rotate-2 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                        >
                                            <div
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                                style={{ backgroundImage: `url(${images.home1.src})` }}
                                            ></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent"></div>
                                            <div className="relative flex h-full flex-col justify-end p-4">
                                                <div className="mb-3 h-8 w-full bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                                                <div className="space-y-1">
                                                    <div className="h-1.5 w-2/3 bg-gray-300 dark:bg-white/20"></div>
                                                    <div className="h-1.5 w-1/2 bg-gray-200 dark:bg-white/10"></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="absolute right-8 top-8 z-20 h-64 w-64 rotate-1 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                        >
                                            <div
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                                style={{ backgroundImage: `url(${images.home2.src})` }}
                                            ></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 via-cyan-800/40 to-transparent"></div>
                                            <div className="relative flex h-full flex-col justify-end p-4">
                                                <div className="mb-3 h-12 w-full bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
                                                <div className="space-y-2">
                                                    <div className="h-1.5 w-2/3 bg-gray-300 dark:bg-white/20"></div>
                                                    <div className="h-1.5 w-3/4 bg-gray-200 dark:bg-white/10"></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="absolute bottom-24 left-4 z-30 h-60 w-72 -rotate-1 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.8, delay: 0.6 }}
                                        >
                                            <div
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                                style={{ backgroundImage: `url(${images.home3.src})` }}
                                            ></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-800/40 to-transparent"></div>
                                            <div className="relative flex h-full flex-col justify-end p-4">
                                                <div className="mb-3 h-12 w-full bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                                                <div className="space-y-2">
                                                    <div className="h-1.5 w-1/2 bg-gray-300 dark:bg-white/20"></div>
                                                    <div className="h-1.5 w-2/3 bg-gray-200 dark:bg-white/10"></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="absolute bottom-12 right-12 z-40 h-52 w-52 rotate-3 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.8, delay: 0.8 }}
                                        >
                                            <div
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                                style={{ backgroundImage: `url(${images.home4.src})` }}
                                            ></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/40 to-transparent"></div>
                                            <div className="relative flex h-full flex-col justify-end p-4">
                                                <div className="mb-3 h-10 w-full bg-gradient-to-r from-green-500/20 to-transparent"></div>
                                                <div className="space-y-1">
                                                    <div className="h-1.5 w-3/5 bg-gray-300 dark:bg-white/20"></div>
                                                    <div className="h-1.5 w-4/5 bg-gray-200 dark:bg-white/10"></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.section>
                        </div>
                    </div>
                </div>
                <Action title="Next" href="#trust" />
            </motion.section>

            <motion.section
                id="trust"
                className="relative flex min-h-screen items-center overflow-hidden border-t border-gray-200 dark:border-white/10 py-20 bg-white dark:bg-gray-900"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                        },
                    },
                }}
            >
                <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
                    <div className="relative">
                        <motion.header
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.8,
                                        ease: "easeOut",
                                    },
                                },
                            }}
                            className="mb-8"
                        >
                            <div className="mb-4 flex items-center gap-4">
                                <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-transparent"></div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">Three Pillars of Hydra TipJar</h2>
                            </div>
                            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300">
                                Hydra TipJar empowers decentralized tipping on Cardano, fostering trust through transparency, community engagement,
                                and verifiable contributions.
                            </p>
                        </motion.header>

                        <div className="relative">
                            <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 transform bg-gradient-to-b from-purple-500 via-blue-500 to-green-500"></div>
                            <div className="space-y-8 lg:space-y-12">
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, x: -50 },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                duration: 0.8,
                                                ease: "easeOut",
                                            },
                                        },
                                    }}
                                    className="relative"
                                >
                                    <div className="flex flex-col items-center justify-between lg:flex-row">
                                        <div className="w-full pr-0 lg:w-5/12 lg:pr-8">
                                            <div className="group relative">
                                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-400/20 dark:from-purple-500/30 to-purple-500/20 dark:to-purple-600/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75"></div>
                                                <div className="relative rounded-2xl border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/60 p-6 shadow-2xl backdrop-blur-sm">
                                                    <div className="mb-4 flex items-center gap-4">
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br from-purple-400 dark:from-purple-500 to-purple-500 dark:to-purple-600 text-2xl font-bold text-white shadow-xl shadow-purple-400/25 dark:shadow-purple-500/25">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="lucide lucide-gift h-8 w-8"
                                                            >
                                                                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                                                                <rect x="2" y="7" width="20" height="5"></rect>
                                                                <line x1="12" y1="22" x2="12" y2="7"></line>
                                                                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                                                                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Transparency</h3>
                                                            <div className="h-0.5 w-16 bg-purple-400 dark:bg-purple-500"></div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-3 text-base font-semibold text-purple-500 dark:text-purple-400">
                                                        Can we trust the tipping process?
                                                    </p>
                                                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                                                        Hydra TipJar leverages Cardano’s blockchain to ensure{" "}
                                                        <strong className="text-gray-900 dark:text-white">transparent and auditable tipping</strong>,
                                                        so every contribution is trackable and secure.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative z-10 hidden lg:block">
                                            <div className="h-8 w-8 rounded-full border-4 border-gray-100 dark:border-gray-950 bg-purple-400 dark:bg-purple-500 shadow-lg shadow-purple-400/50 dark:shadow-purple-500/50"></div>
                                            <div className="absolute -inset-2 animate-pulse rounded-full bg-purple-400/20 dark:bg-purple-500/20"></div>
                                        </div>
                                        <div className="hidden w-5/12 pl-8 lg:block">
                                            <div className="text-right opacity-40">
                                                <div className="text-6xl font-bold text-purple-400/30 dark:text-purple-500/30">01</div>
                                                <div className="mt-2 text-purple-300/50">Clarity</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, x: -50 },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                duration: 0.8,
                                                ease: "easeOut",
                                            },
                                        },
                                    }}
                                    className="relative"
                                >
                                    <div className="flex flex-col items-center justify-between lg:flex-row">
                                        <div className="hidden w-5/12 pr-8 lg:block">
                                            <div className="text-left opacity-40">
                                                <div className="text-6xl font-bold text-blue-400/30 dark:text-blue-500/30">02</div>
                                                <div className="mt-2 text-blue-300/50">Engagement</div>
                                            </div>
                                        </div>
                                        <div className="relative z-10 hidden lg:block">
                                            <div className="h-8 w-8 rounded-full border-4 border-gray-100 dark:border-gray-950 bg-blue-400 dark:bg-blue-500 shadow-lg shadow-blue-400/50 dark:shadow-blue-500/50"></div>
                                            <div className="absolute -inset-2 animate-pulse rounded-full bg-blue-400/20 dark:bg-blue-500/20"></div>
                                        </div>
                                        <div className="w-full pl-0 lg:w-5/12 lg:pl-8">
                                            <div className="group relative">
                                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400/20 dark:from-blue-500/30 to-blue-500/20 dark:to-blue-600/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75"></div>
                                                <div className="relative rounded-2xl border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/60 p-6 shadow-2xl backdrop-blur-sm">
                                                    <div className="mb-4 flex items-center gap-4">
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br from-blue-400 dark:from-blue-500 to-blue-500 dark:to-blue-600 text-2xl font-bold text-white shadow-xl shadow-blue-400/25 dark:shadow-blue-500/25">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="lucide lucide-users h-8 w-8"
                                                            >
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="9" cy="7" r="4"></circle>
                                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Community</h3>
                                                            <div className="h-0.5 w-16 bg-blue-400 dark:bg-blue-500"></div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-3 text-base font-semibold text-blue-500 dark:text-blue-400">
                                                        Do we trust the contributors we support?
                                                    </p>
                                                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                                                        Hydra TipJar enables seamless onboarding and{" "}
                                                        <strong className="text-gray-900 dark:text-white">community-driven tipping</strong>, rewarding
                                                        creators and fostering collaborative ecosystems.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, x: -50 },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                duration: 0.8,
                                                ease: "easeOut",
                                            },
                                        },
                                    }}
                                    className="relative"
                                >
                                    <div className="flex flex-col items-center justify-between lg:flex-row">
                                        <div className="w-full pr-0 lg:w-5/12 lg:pr-8">
                                            <div className="group relative">
                                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-400/20 dark:from-green-500/30 to-green-500/20 dark:to-green-600/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75"></div>
                                                <div className="relative rounded-2xl border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/60 p-6 shadow-2xl backdrop-blur-sm">
                                                    <div className="mb-4 flex items-center gap-4">
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br from-green-400 dark:from-green-500 to-green-500 dark:to-green-600 text-2xl font-bold text-white shadow-xl shadow-green-400/25 dark:shadow-green-500/25">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="lucide lucide-shield-check h-8 w-8"
                                                            >
                                                                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-.5 7-2.3C14.5 4.5 17 5 19 5a1 1 0 0 1 1 1z"></path>
                                                                <path d="m9 11 2 2 4-4"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Verification</h3>
                                                            <div className="h-0.5 w-16 bg-green-400 dark:bg-green-500"></div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-3 text-base font-semibold text-green-500 dark:text-green-400">
                                                        Can we trust the integrity of contributions?
                                                    </p>
                                                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                                                        Blockchain-based verification ensures tips are{" "}
                                                        <strong className="text-gray-900 dark:text-white">secure and authentic</strong>, enabling
                                                        creators to build trust through verified contributions.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative z-10 hidden lg:block">
                                            <div className="h-8 w-8 rounded-full border-4 border-gray-100 dark:border-gray-950 bg-green-400 dark:bg-green-500 shadow-lg shadow-green-400/50 dark:shadow-green-500/50"></div>
                                            <div className="absolute -inset-2 animate-pulse rounded-full bg-green-400/20 dark:bg-green-500/20"></div>
                                        </div>
                                        <div className="hidden w-5/12 pl-8 lg:block">
                                            <div className="text-right opacity-40">
                                                <div className="text-6xl font-bold text-green-400/30 dark:text-green-500/30">03</div>
                                                <div className="mt-2 text-green-300/50">Security</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
                <Action title="Scroll" href="#contact" />
            </motion.section>

            <Contact />
        </main>
    );
}
