"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback } from "react";
import { DECIMAL_PLACE } from "~/constants/common";
import { images } from "~/public/images*";
import { getBalance, getBalanceOther } from "~/services/hydra.service";
import { withdraw } from "~/services/hydra.service";
import { Button } from "./ui/button";

const Balance = function ({ walletAddress }: { walletAddress: string }) {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["status"],
        queryFn: () =>
            getBalance({
                walletAddress: walletAddress,
            }),

        enabled: !!walletAddress,
    });

    const { data: balanceOther, isLoading: isLoadingBalanceOther } = useQuery({
        queryKey: ["status"],
        queryFn: () =>
            getBalanceOther({
                walletAddress: walletAddress,
            }),

        enabled: !!walletAddress,
    });

    const handleWithdraw = useCallback(
        async function () {
            try {
                await withdraw({ walletAddress: walletAddress as string, isCreator: true });
                await queryClient.invalidateQueries({ queryKey: ["creator", walletAddress] });
            } catch (error) {
                console.log(error);
            }
        },
        [queryClient],
    );

    return (
        <div className="rounded-[24px] text-card-foreground overflow-hidden border border-blue-200/50 dark:border-blue-900/30 bg-white dark:bg-slate-900">
            <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 py-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:w-full md:gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/90 dark:bg-slate-800/90 rounded-full p-2.5">
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
                                        className="lucide lucide-wallet h-6 w-6 text-blue-600 dark:text-blue-400"
                                        aria-hidden="true"
                                    >
                                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Balance Has Been Tipped</p>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {isLoading ? "0.00" : Number(data) / DECIMAL_PLACE} ADA
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleWithdraw}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 rounded-md px-3 w-full md:w-auto bg-white hover:bg-gray-50 text-blue-600 border border-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-700 dark:hover:bg-slate-700"
                                aria-disabled="true"
                            >
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4 overflow-auto">
                <div className="p-4 rounded-lg bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Balance Token To Tip Others</span>
                        <Button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-gray-500 border border-gray-200 dark:border-gray-700 dark:text-gray-300 dark:bg-slate-700/60"
                            type="button"
                            id="radix-:r3:"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            data-state="closed"
                        >
                            View all
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                {isLoadingBalanceOther ? "0.00" : Number(balanceOther) / DECIMAL_PLACE} ADA
                            </span>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                $ {isLoadingBalanceOther ? "0.00" : (Number(balanceOther) / DECIMAL_PLACE) * 0.92} USD
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src={images.cardano} alt="ADA" className="h-5 w-5" />
                            <span className="font-medium dark:text-gray-300">ADA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Balance;
