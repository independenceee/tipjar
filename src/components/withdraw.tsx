"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "./icons";
import { useQuery } from "@tanstack/react-query";
import { getWithdraws } from "~/services/tipjar.service";
import Pagination from "./pagination";

// Define types for type safety
type Withdraw = {
    type: "Withdraw";
    status: "Complete";
    datetime: number;
    txHash: string;
    address: string;
    amount: string | null;
};

// Animation variants for table rows
const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// Animation variants for loading/error/empty states
const stateVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const Withdraw = function ({ walletAddress }: { walletAddress: string }) {
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ["withdraw", walletAddress, page],
        queryFn: () =>
            getWithdraws({
                walletAddress: walletAddress,
                page: page,
                limit: 6,
            }),
    });

    // Format lovelace to ADA (1 ADA = 1,000,000 lovelace)
    const formatAmount = (amount: string | null): string => {
        if (!amount) return "0.00 ADA";
        return `${(parseInt(amount) / 1_000_000).toFixed(2)} ADA`;
    };

    // Format timestamp to readable date (e.g., "12/09/2025 12:06")
    const formatDate = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <motion.div
            className="mx-auto rounded-2xl border border-blue-200/50 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-slate-900"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
            aria-label="Withdrawal history card"
        >
            <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900/50 dark:to-purple-900/50">
                <motion.div
                    className="rounded-full bg-white/90 p-2 dark:bg-slate-800/90"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <ArrowRight className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Withdrawal History</h3>
            </div>

            <div className="mt-4">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-300"
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.div
                                className="h-8 w-8 border-2 border-t-transparent border-blue-500 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                            <p className="mt-4 text-base font-medium text-gray-800 dark:text-gray-200">Loading withdrawals...</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            className="flex flex-col items-center justify-center py-12 text-red-500 dark:text-red-400"
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <p className="text-base font-medium">Error: {error instanceof Error ? error.message : "Failed to load withdrawals"}</p>
                        </motion.div>
                    ) : !data?.data || data.data.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-300"
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.div
                                className="rounded-full bg-blue-100/50 p-6 dark:bg-blue-900/50"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <ArrowRight className="h-12 w-12 text-blue-500 dark:text-blue-400" aria-hidden="true" />
                            </motion.div>
                            <div className="mt-4 text-center">
                                <p className="text-base font-medium text-gray-800 dark:text-gray-200">No Withdrawals Yet</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Your withdrawal history will appear here</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" aria-label="Withdrawal history table">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                                Transaction Hash
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-gray-700">
                                        {data.data.map((withdraw, index) => (
                                            <motion.tr
                                                key={withdraw.txHash}
                                                className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200"
                                                variants={{
                                                    hidden: { opacity: 0, x: -10 },
                                                    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                                                }}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    {formatDate(withdraw.datetime)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <motion.a
                                                        href={`https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=${withdraw.txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-mono text-sm truncate max-w-[120px] sm:max-w-[180px] block"
                                                        title={withdraw.txHash}
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ type: "spring", stiffness: 200 }}
                                                    >
                                                        {withdraw.txHash.slice(0, 6)}...{withdraw.txHash.slice(-6)}
                                                    </motion.a>
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm font-semibold text-green-600 dark:text-green-400">
                                                    {formatAmount(withdraw.amount)}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{withdraw.type}</td>
                                                <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{withdraw.status}</td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {data.totalPages && data.totalPages > 1 && (
                                <motion.div
                                    className="flex justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <Pagination totalPages={data.totalPages} currentPage={page} setCurrentPage={setPage} />
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default memo(Withdraw);
