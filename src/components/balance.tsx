"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DECIMAL_PLACE } from "~/constants/common";
import { images } from "~/public/images*";
import { getBalance, getBalanceOther, withdraw } from "~/services/hydra.service";
import { Button } from "./ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useWallet } from "~/hooks/use-wallet";
import { isNil } from "lodash";
import { redirect } from "next/navigation";
import { routers } from "~/constants/routers";
import { submitTx } from "~/services/mesh.service";
import CountUp from "react-countup";
import { DrawerContent, DrawerTrigger, Drawer } from "./ui/drawer";
import Tipper from "./tipper";

const Balance = function ({
    walletAddress,
    assetName,
    proposal,
}: {
    walletAddress: string;
    assetName: string;
    proposal: Record<string, string | number>;
}) {
    const { wallet, signTx } = useWallet();
    const [loading, setLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["status", walletAddress],
        queryFn: () => getBalance({ walletAddress }),
        enabled: !!walletAddress,
    });

    const { data: balanceOther, isLoading: isLoadingBalanceOther } = useQuery({
        queryKey: ["status", walletAddress],
        queryFn: () => getBalanceOther({ walletAddress }),
        enabled: !!walletAddress,
    });

    const handleWithdraw = useCallback(async () => {
        try {
            setLoading(true);
            const unsignedTx = await withdraw({ walletAddress, assetName, isCreator: true });
            const signedTx = await signTx(unsignedTx as string);
            await submitTx({ signedTx });
            await queryClient.invalidateQueries({ queryKey: ["creator", walletAddress] });
        } catch (error) {
            console.error("Withdraw failed:", error);
        } finally {
            setLoading(false);
        }
    }, [walletAddress, assetName, signTx, queryClient]);

    return (
        <motion.div
            className="mx-auto rounded-2xl border border-blue-200/50 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-slate-900"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <div className="rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900/50 dark:to-purple-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="rounded-full bg-white/90 p-2 dark:bg-slate-800/90"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
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
                                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                                aria-hidden="true"
                            >
                                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                            </svg>
                        </motion.div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance Tipped</p>
                            <motion.p
                                className="text-xl font-semibold text-blue-600 dark:text-blue-400"
                                key={data}
                                variants={{
                                    initial: { opacity: 0, x: -10 },
                                    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                                }}
                                initial="initial"
                                animate="animate"
                            >
                                {isLoading || loading ? (
                                    "0.00"
                                ) : (
                                    <CountUp start={0} end={(data as number) || 0} duration={2.75} separator=" " decimals={4} decimal="," />
                                )}{" "}
                                ADA
                            </motion.p>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <motion.div
                                variants={{
                                    rest: { scale: 1 },
                                    hover: { scale: 1.05 },
                                    tap: { scale: 0.95 },
                                }}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Button
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    disabled={loading || isLoading}
                                    aria-label="Withdraw balance"
                                >
                                    {loading || isLoading ? (
                                        <motion.div
                                            className="h-5 w-5 border-2 border-t-transparent border-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        />
                                    ) : (
                                        "Withdraw"
                                    )}
                                </Button>
                            </motion.div>
                        </AlertDialogTrigger>
                        <AnimatePresence>
                            <AlertDialogContent
                                asChild
                                className="sm:max-w-md rounded-2xl bg-gradient-to-br from-blue-50/90 to-purple-50/90 dark:from-slate-900/90 dark:to-slate-800/90 border border-blue-200/50 dark:border-blue-900/50 shadow-lg p-6"
                            >
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.95 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
                                        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                            {isNil(wallet) ? "Connect Wallet Required" : "Withdraw Balance"}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                            {isNil(wallet)
                                                ? "Please connect your wallet to withdraw funds."
                                                : "This action will withdraw your total balance. It cannot be undone."}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel asChild>
                                            <Button
                                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                                aria-label="Cancel withdraw"
                                            >
                                                Cancel
                                            </Button>
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <motion.div
                                                variants={{
                                                    rest: { scale: 1 },
                                                    hover: { scale: 1.05 },
                                                    tap: { scale: 0.95 },
                                                }}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                <Button
                                                    onClick={isNil(wallet) ? () => redirect(routers.login) : handleWithdraw}
                                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                    disabled={loading}
                                                    aria-label={isNil(wallet) ? "Connect wallet" : "Confirm withdraw"}
                                                >
                                                    {loading ? (
                                                        <motion.div
                                                            className="h-5 w-5 border-2 border-t-transparent border-white rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        />
                                                    ) : isNil(wallet) ? (
                                                        "Connect Wallet"
                                                    ) : (
                                                        "Withdraw"
                                                    )}
                                                </Button>
                                            </motion.div>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </motion.div>
                            </AlertDialogContent>
                        </AnimatePresence>
                    </AlertDialog>
                </div>
            </div>

            {/* Balance Token Section */}
            <div className="mt-4 rounded-lg bg-blue-50/80 p-4 dark:bg-slate-800/80">
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Balance for Tipping Others</span>
                    <Drawer direction="bottom" >
                        <DrawerTrigger asChild>
                            <Button
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                aria-label="View all tokens"
                            >
                                Proposal Infomation
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="w-full mx-auto max-w-md">
                                <Tipper
                                    image={(proposal?.image as string) || "/images/common/loading.png"}
                                    title={proposal?.title as string}
                                    author={proposal?.author as string}
                                    slug={proposal?.walletAddress as string}
                                    datetime={new Date(Number(proposal?.datetime)).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    participants={2}
                                />
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <motion.span
                            className="font-semibold text-blue-600 dark:text-blue-400"
                            key={balanceOther}
                            variants={{
                                initial: { opacity: 0, x: -10 },
                                animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                            }}
                            initial="initial"
                            animate="animate"
                        >
                            {isLoadingBalanceOther ? (
                                "0.00"
                            ) : (
                                <CountUp start={0} end={(balanceOther as number) || 0} duration={2.75} separator=" " decimals={4} decimal="," />
                            )}{" "}
                            ADA
                        </motion.span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            ≈ $
                            {isLoadingBalanceOther ? (
                                "0.00"
                            ) : (
                                <CountUp
                                    start={0}
                                    end={(balanceOther as number) * 0.92 || 0}
                                    duration={2.75}
                                    separator=" "
                                    decimals={4}
                                    decimal=","
                                />
                            )}{" "}
                            USD
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image src={images.cardano} alt="ADA" className="h-5 w-5" />
                        <span className="font-medium text-gray-800 dark:text-gray-300">ADA</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Balance;
