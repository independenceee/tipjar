"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isNil } from "lodash";
import CountUp from "react-countup";
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
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import Tipper from "./tipper";
import { useWallet } from "~/hooks/use-wallet";
import { images } from "~/public/images";
import { routers } from "~/constants/routers";
import { DECIMAL_PLACE } from "~/constants/common";
import { getBalanceTip, getBalanceCommit, withdraw } from "~/services/hydra.service";
import { deleteCreator } from "~/services/tipjar.service";
import { toast } from "sonner";

interface Proposal {
    image?: string;
    title?: string;
    author?: string;
    walletAddress?: string;
    datetime?: string | number;
}

interface BalanceProps {
    walletAddress: string;
    assetName: string;
    status: string;
    proposal: Proposal;
}

const Balance: React.FC<BalanceProps> = ({ walletAddress, assetName, status, proposal }) => {
    const { wallet, signTx } = useWallet();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { data: balanceTip, isLoading: isLoadingTip } = useQuery({
        queryKey: ["balance", walletAddress],
        queryFn: () => getBalanceTip({ walletAddress }),
        enabled: !!walletAddress,
    });

    const { data: balanceCommit, isLoading: isLoadingCommit } = useQuery({
        queryKey: ["balance-other", walletAddress],
        queryFn: () => getBalanceCommit({ walletAddress }),
        enabled: !!walletAddress,
    });

    const handleWithdraw = useCallback(async () => {
        try {
            setLoading(true);
            await withdraw({ status, isCreator: true });
            await deleteCreator();
            queryClient.invalidateQueries({ queryKey: ["status"] });
            toast.success("Withdrawal successful!");
            router.push(routers.dashboard);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to withdraw");
        } finally {
            setLoading(false);
        }
    }, [status, queryClient, router]);

    const adaConversionRate = 0.92; // Memoized conversion rate for USD
    const balanceTipADA = useMemo(() => (balanceTip ? balanceTip / DECIMAL_PLACE : 0), [balanceTip]);
    const balanceCommitADA = useMemo(() => (balanceCommit ? balanceCommit / DECIMAL_PLACE : 0), [balanceCommit]);

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
                                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                            </svg>
                        </motion.div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance Tipped</p>
                            <motion.p
                                className="text-xl font-semibold text-blue-600 dark:text-blue-400"
                                key={balanceTip}
                                variants={{
                                    initial: { opacity: 0, x: -10 },
                                    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                                }}
                                initial="initial"
                                animate="animate"
                            >
                                {isLoadingTip || loading ? (
                                    "0.00"
                                ) : (
                                    <CountUp start={0} end={balanceTipADA} duration={2.75} decimals={4} decimal="," separator=" " />
                                )}{" "}
                                ADA
                            </motion.p>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    disabled={loading || isLoadingTip}
                                    aria-label="Withdraw balance"
                                >
                                    {loading || isLoadingTip ? (
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
                            <AlertDialogContent className="sm:max-w-md rounded-2xl bg-gradient-to-br from-blue-50/90 to-purple-50/90 p-6 dark:from-slate-900/90 dark:to-slate-800/90">
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
                                        <AlertDialogAction
                                            asChild
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                        >
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={isNil(wallet) ? () => router.push(routers.login) : handleWithdraw}
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
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                aria-label="View proposal information"
                            >
                                Proposal Information
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-md">
                                <Tipper
                                    image={proposal.image || images.logo}
                                    title={proposal.title || "Untitled Proposal"}
                                    author={proposal.author || "Unknown Author"}
                                    slug={proposal.walletAddress || ""}
                                    datetime={new Date(Number(proposal.datetime || Date.now())).toLocaleString("en-GB", {
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
                            key={balanceCommit}
                            variants={{
                                initial: { opacity: 0, x: -10 },
                                animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                            }}
                            initial="initial"
                            animate="animate"
                        >
                            {isLoadingCommit ? (
                                "0.00"
                            ) : (
                                <CountUp start={0} end={balanceCommitADA} duration={2.75} decimals={4} decimal="," separator=" " />
                            )}{" "}
                            ADA
                        </motion.span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            ≈ $
                            {isLoadingCommit ? (
                                "0.00"
                            ) : (
                                <CountUp
                                    start={0}
                                    end={balanceCommitADA * adaConversionRate}
                                    duration={2.75}
                                    decimals={4}
                                    decimal=","
                                    separator=" "
                                />
                            )}{" "}
                            USD
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image src={images.cardano} alt="Cardano ADA" className="h-5 w-5" />
                        <span className="font-medium text-gray-800 dark:text-gray-300">ADA</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Balance;
