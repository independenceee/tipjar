"use client";

import Image from "next/image";
import { memo, useCallback, useState } from "react";
import { images } from "~/public/images*";
import { Wallet } from "./icons";
import { useWallet } from "~/hooks/use-wallet";
import { getBalance, send, submitHydraTx } from "~/services/hydra.service";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { DECIMAL_PLACE } from "~/constants/common";

const FormTip = function ({ tipAddress }: { tipAddress: string }) {
    const { address, signTx } = useWallet();
    const [amount, setAmount] = useState(0);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        setAmount(Number(value));
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["status"],
        queryFn: () =>
            getBalance({
                walletAddress: tipAddress,
            }),

        enabled: !!tipAddress,
    });

    const handleTip = useCallback(async () => {
        try {
            const unsignedTx = await send({
                walletAddress: address as string,
                amount: amount,
                tipAddress: tipAddress as string,
                isCreator: false,
            });

            const signedTx = await signTx(unsignedTx as string);
            await submitHydraTx({
                signedTx: signedTx,
                isCreator: false,
            });
        } catch (error) {
            console.log(error);
        }
    }, [address, amount, signTx]);

    return (
        <div className="rounded-[24px] text-card-foreground overflow-hidden border border-blue-200/50 dark:border-blue-900/30 bg-white dark:bg-slate-900">
            <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 py-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:w-full md:gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/90 dark:bg-slate-800/90 rounded-full p-2.5">
                                    <Wallet />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Ada You Tiped</p>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {isLoading ? "0.00" : Number(data) / DECIMAL_PLACE} ADA
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4 overflow-auto">
                <div className="p-4 rounded-lg bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Top Token</span>
                        <div className="flex items-center gap-2">
                            <Image src={images.cardano} alt="ADA" className="h-5 w-5" />
                            <span className="font-medium dark:text-gray-300">ADA</span>
                        </div>
                    </div>
                    <div className="flex items-start  gap-4 justify-between">
                        <div className="text-left flex flex-col gap-2  w-full ">
                            <input
                                onChange={handleChange}
                                value={amount === 0 ? "" : amount}
                                name="ADA"
                                type="text"
                                placeholder="Enter amount tipper"
                                className="flex-1 rounded text-[16px] whitespace-nowrap font-medium transition-colors  h-20 py-2 px-3 w-full md:w-auto bg-white outline-none border-b border-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-700 dark:hover:bg-slate-700"
                            />
                            <div className="text-sm text-gray-500 dark:text-gray-400">$0.00 USD</div>
                        </div>
                        <Button
                            onClick={handleTip}
                            className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 rounded-md px-3 w-full md:w-auto bg-white hover:bg-gray-50 text-blue-600 border border-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-700 dark:hover:bg-slate-700"
                            aria-disabled="true"
                        >
                            Tip Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(FormTip);
