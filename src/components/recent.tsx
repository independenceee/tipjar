"use client";

import { Recent as RecentType } from "~/types";
import { USD } from "./icons";
import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getRecents } from "~/services/hydra.service";
import Pagination from "./pagination";
import Image from "next/image";
import { images } from "~/public/images*";
import { shortenString } from "~/lib/utils";

const Recent = function ({ walletAddress }: { walletAddress: string }) {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useQuery({
        queryKey: ["hydra", walletAddress, page],
        queryFn: () =>
            getRecents({
                walletAddress: walletAddress!,
                limit: 4,
                page: page,
            }),
    });

    return (
        <motion.div
            className=" rounded-2xl h-full border border-blue-200/50 bg-white shadow-lg dark:border-blue-900/30 dark:bg-slate-900"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
        >
            <div className="p-6">
                <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900/50 dark:to-purple-900/50">
                    <motion.div
                        className="rounded-full bg-white/90 p-2 dark:bg-slate-800/90"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <USD className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Tips</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your latest received tips</p>
                    </div>
                </div>

                <div className="mt-4 flex-1 overflow-auto">
                    <AnimatePresence mode="wait">
                        {error || !data?.data || data.totalItem === 0 ? (
                            <NotFound key="not-found" />
                        ) : isLoading ? (
                            <Loading key="loading" />
                        ) : (
                            <Result
                                key="result"
                                data={data.data.filter((item) => item !== undefined) as RecentType[]}
                                page={page}
                                setPage={setPage}
                                totalPages={data.totalPages}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

const NotFound = function () {
    return (
        <motion.div
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
                <USD className="h-12 w-12 text-blue-500 dark:text-blue-400" />
            </motion.div>
            <div className="mt-4 text-center">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">No Tips Yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Share your Tip Jar link to receive tips</p>
            </div>
        </motion.div>
    );
};

const Loading = function () {
    return (
        <motion.div
            className="flex flex-col items-center justify-center py-20 gap-4"
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Image className="h-16 w-16" width={64} height={64} src={images.logo} alt="Loading" />
            </motion.div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Loading...</p>
        </motion.div>
    );
};

const Result = function ({
    data,
    page,
    setPage,
    totalPages,
}: {
    data: RecentType[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages?: number;
}) {
    return (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                Hash
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                Address
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                Amount (ADA)
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-gray-700">
                        {data.map((item, index) => (
                            <motion.tr
                                key={item.txHash}
                                className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200"
                                variants={{
                                    hidden: { opacity: 0, x: -10 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                                }}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                            >
                                <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-300">{shortenString(item.txHash)}</td>
                                <td className="px-4 py-3 text-sm font-mono text-gray-500 dark:text-gray-400">{shortenString(item.walletAddress)}</td>
                                <td className="px-4 py-3 text-center text-sm font-semibold text-green-600 dark:text-green-400">{item.amount}</td>
                                <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(Number(item.datetime)).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {(totalPages as number) > 1 && (
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Pagination currentPage={page} totalPages={totalPages ?? 0} setCurrentPage={setPage} />
                </motion.div>
            )}
        </motion.div>
    );
};

export default memo(Recent);
