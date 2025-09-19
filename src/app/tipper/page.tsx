"use client";

import Tipper from "~/components/tipper";
import Title from "~/components/title";
import { useState } from "react";
import TipperSkeleton from "~/components/tipper-skeleton";
import Pagination from "~/components/pagination";
import { useQuery } from "@tanstack/react-query";
import Header from "~/components/header";
import Footer from "~/components/footer";
import { getProposals } from "~/services/tipjar.service";
import { useWallet } from "~/hooks/use-wallet";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { routers } from "~/constants/routers";

export default function TipperPage() {
    const [page, setPage] = useState(1);
    const { address } = useWallet();
    const { data, isLoading, error } = useQuery({
        queryKey: ["proposals", page],
        queryFn: () => getProposals({ limit: 12, page: page, walletAddress: address as string }),
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <main className="relative pt-20">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                        <Title
                            title="Tippers"
                            description="Discover creators and communities thriving with Cardano Hydra-powered tipping. Join the decentralized revolution in rewarding talent."
                        />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {error ? (
                            <motion.div
                                className="flex flex-col items-center justify-center py-16 text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-blue-500 dark:text-blue-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a2 2 0 002 2h4a2 2 0 002-2v-6m-7-2v6"
                                        />
                                    </svg>
                                </motion.div>
                                <motion.h3
                                    className="text-2xl font-semibold text-gray-900 dark:text-white mb-2"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    No Items Available
                                </motion.h3>
                                <motion.p
                                    className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-6"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    It looks like there are no tippers to display at the moment. Check back later or try a different page!
                                </motion.p>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={routers.dashboard}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 dark:bg-white px-8 py-2 text-lg font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100"
                                    >
                                        Create Tipjar
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ) : isLoading ? (
                            <motion.section
                                key="loading"
                                className="grid gap-8 sm:grid-cols-1 md:grid-cols-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="animate-pulse"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.1 }}
                                    >
                                        <TipperSkeleton />
                                    </motion.div>
                                ))}
                            </motion.section>
                        ) : data?.data.length === 0 ? (
                            <motion.div
                                className="flex flex-col items-center justify-center py-16 text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-blue-500 dark:text-blue-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a2 2 0 002 2h4a2 2 0 002-2v-6m-7-2v6"
                                        />
                                    </svg>
                                </motion.div>
                                <motion.h3
                                    className="text-2xl font-semibold text-gray-900 dark:text-white mb-2"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    No Items Available
                                </motion.h3>
                                <motion.p
                                    className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-6"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    It looks like there are no tippers to display at the moment. Check back later or try a different page!
                                </motion.p>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={routers.dashboard}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 dark:bg-white px-8 py-4 text-lg font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100"
                                    >
                                        Create Tipjar
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.section
                                key="data"
                                className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 transition-all duration-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {data?.data.map((result, index) => (
                                    <motion.div
                                        key={index}
                                        className="rounded-xl shadow-lg bg-white dark:bg-slate-900/80 border border-blue-100 dark:border-blue-900/30"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}
                                    >
                                        <Tipper
                                            image={result?.image || "/images/common/loading.png"}
                                            title={result?.title as string}
                                            author={result?.author as string}
                                            slug={result?.walletAddress as string}
                                            datetime={new Date(Number(result?.datetime)).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            participants={2}
                                        />
                                    </motion.div>
                                ))}
                            </motion.section>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="mt-12 flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {(data?.totalPages ?? 0) > 1 && <Pagination currentPage={page} totalPages={data?.totalPages ?? 0} setCurrentPage={setPage} />}
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
