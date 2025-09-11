"use client";
import { memo, useState } from "react";
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

const Withdraw = function ({ walletAddress }: { walletAddress: string }) {
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data, isLoading, error } = useQuery({
        queryKey: ["withdraw", page],
        queryFn: () =>
            getWithdraws({
                walletAddress,
                limit,
                page,
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
        <div className="rounded-[24px] bg-card text-card-foreground border border-blue-200/50 dark:border-blue-900/30 col-span-2 shadow-sm">
            <div className="p-6 flex flex-row items-center gap-3 py-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-slate-800/90 dark:to-slate-700/90">
                <div className="rounded-full bg-[#D3E4FD] dark:bg-blue-900/30 p-2.5">
                    <ArrowRight />
                </div>
                <h3 className="font-semibold text-xl tracking-tight text-gray-800 dark:text-gray-100">Withdrawal History</h3>
            </div>
            <div className="p-6 pt-0">
                {isLoading ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-base">Loading withdrawals...</div>
                ) : error ? (
                    <div className="text-center text-red-500 dark:text-red-400 py-8 text-base">
                        Error: {error instanceof Error ? error.message : "Failed to load withdrawals"}
                    </div>
                ) : !data?.data || data.data.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-base">Withdrawals you make will appear here.</div>
                ) : (
                    <div className="mt-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                                <thead className="text-xs uppercase bg-gray-100 dark:bg-slate-800/80 text-gray-600 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Date</th>
                                        <th className="px-4 py-3">Transaction Hash</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Amount</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Type</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((withdraw) => (
                                        <tr
                                            key={withdraw.txHash}
                                            className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-medium">{formatDate(withdraw.datetime)}</td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={`https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=${withdraw.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-mono text-sm truncate max-w-[150px] sm:max-w-[200px] block"
                                                    title={withdraw.txHash}
                                                >
                                                    {withdraw.txHash.slice(0, 6)}...{withdraw.txHash.slice(-6)}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 font-medium">{formatAmount(withdraw.amount)}</td>
                                            <td className="px-4 py-3 font-medium">{withdraw.type}</td>
                                            <td className="px-4 py-3 font-medium">{withdraw.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {data.totalPages && data.totalPages > 1 && (
                            <div className="mt-2 flex justify-center">
                                <Pagination totalPages={data.totalPages} currentPage={page} setCurrentPage={setPage} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(Withdraw);
