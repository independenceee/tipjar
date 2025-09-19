"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "./icons";
import { useWallet } from "~/hooks/use-wallet";
import { commit, getBalance, getBalanceCommit, send, submitHydraTx } from "~/services/hydra.service";
import { Button } from "./ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DECIMAL_PLACE } from "~/constants/common";
import toast from "react-hot-toast";
import { getUTxOOnlyLovelace, submitTx } from "~/services/mesh.service";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommitSchema, TipSchema } from "~/lib/schema";
import z from "zod";
import Image from "next/image";
import { images } from "~/public/images*";
import CountUp from "react-countup";

type Commit = z.infer<typeof CommitSchema>;
type TipForm = z.infer<typeof TipSchema>;

const FormTip = function ({ tipAddress }: { tipAddress: string }) {
    const { address, signTx } = useWallet();
    const [amount, setAmount] = useState<string>("");
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<Commit>({
        resolver: zodResolver(CommitSchema),
        defaultValues: {
            txHash: "",
            outputIndex: 0,
            amount: 0,
        },
    });

    const { data: balance, isLoading: isLoadingBalance } = useQuery({
        queryKey: ["balance", tipAddress],
        queryFn: () => getBalance({ walletAddress: tipAddress }),
        enabled: !!tipAddress,
    });

    const { data: balanceCommit, isLoading: isLoadingBalanceCommit } = useQuery({
        queryKey: ["balance", address],
        queryFn: () => getBalanceCommit({ walletAddress: address as string }),
        enabled: !!address,
    });

    console.log(balanceCommit);

    const { data: dataUTxOOnlyLovelace, isLoading: isLoadingUTxOOnlyLovelace } = useQuery({
        queryKey: ["utxos", address],
        queryFn: () => getUTxOOnlyLovelace({ walletAddress: address as string, quantity: DECIMAL_PLACE * 10 }),
        enabled: !!address,
    });

    const { data: adaPrice } = useQuery({
        queryKey: ["adaPrice"],
        queryFn: async () => {
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd");
            const data = await response.json();
            return data.cardano.usd;
        },
        enabled: true,
    });

    const onSubmitCommit = useCallback(
        async function (data: Commit) {
            try {
                if (!address) {
                    toast.error("Please connect your wallet");
                    return;
                }
                const unsignedTx = await commit({
                    walletAddress: address,
                    input: {
                        txHash: data.txHash,
                        outputIndex: data.outputIndex,
                    },
                    isCreator: false,
                });
                if (typeof unsignedTx !== "string") {
                    throw new Error("Invalid transaction format");
                }
                const signedTx = await signTx(unsignedTx);
                if (typeof signedTx !== "string") {
                    throw new Error("Invalid signed transaction format");
                }
                await submitTx({ signedTx });
                toast.success("Commitment successful!");
                queryClient.invalidateQueries({ queryKey: ["status", tipAddress] });
            } catch (error) {
                console.error("Commitment failed:", error);
                toast.error("Failed to commit. Please try again.");
            }
        },
        [address, signTx, queryClient, tipAddress],
    );

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d*\.?\d{0,6}$/.test(value) && Number(value) >= 0) {
            setAmount(value);
        }
    }, []);

    const handleTip = useCallback(async () => {
        if (!address) {
            toast.error("Please connect your wallet");
            return;
        }
        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        try {
            const unsignedTx = await send({
                walletAddress: address,
                amount: Number(amount),
                tipAddress: tipAddress,
                isCreator: false,
            });
            if (typeof unsignedTx !== "string") {
                throw new Error("Invalid transaction format");
            }
            const signedTx = await signTx(unsignedTx);
            if (typeof signedTx !== "string") {
                throw new Error("Invalid signed transaction format");
            }
            await submitHydraTx({
                signedTx,
                isCreator: false,
            });
            toast.success("Tip sent successfully!");
            setAmount("");
            queryClient.invalidateQueries({ queryKey: ["status", tipAddress] });
        } catch (error) {
            console.error("Tipping failed:", error);
            toast.error("Failed to send tip. Please try again.");
        }
    }, [address, amount, signTx, tipAddress, queryClient]);

    const handleSelectChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const value = event.target.value;
            if (value) {
                const { txHash, outputIndex, amount } = JSON.parse(value);
                setValue("txHash", txHash, { shouldValidate: true });
                setValue("outputIndex", outputIndex, { shouldValidate: true });
                setValue("amount", Number(amount), { shouldValidate: true }); // Amount in lovelace
            } else {
                setValue("txHash", "", { shouldValidate: true });
                setValue("outputIndex", 0, { shouldValidate: true });
                setValue("amount", 0, { shouldValidate: true });
            }
        },
        [setValue],
    );

    // Show toast error when no UTXOs are available
    useEffect(() => {
        if (!isLoadingUTxOOnlyLovelace && !dataUTxOOnlyLovelace?.length && balance === 0) {
            toast.error("No UTXOs available for committing. Please ensure your wallet has at least 10 ADA.", {
                id: "no-utxos", // Prevent duplicate toasts
            });
        }
    }, [isLoadingUTxOOnlyLovelace, dataUTxOOnlyLovelace, balance]);

    return (
        <motion.div
            className="rounded-2xl border border-blue-200/50 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-slate-900"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
            aria-label="Tip form card"
        >
            <div className="rounded-lg flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900/50 dark:to-purple-900/50">
                <div className="flex items-center gap-3">
                    <motion.div
                        className="rounded-full bg-white/90 p-2 dark:bg-slate-800/90"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </motion.div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance On Hydra</p>
                        <motion.p
                            className="text-xl font-semibold text-blue-600 dark:text-blue-400"
                            key={balanceCommit}
                            variants={{
                                initial: { opacity: 0, x: -10 },
                                animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                            }}
                            initial="initial"
                            animate="animate"
                        >
                            {isLoadingBalance ? (
                                "0.00"
                            ) : (
                                <CountUp
                                    start={0}
                                    end={(((balanceCommit as number) / DECIMAL_PLACE) as number) || 0}
                                    duration={2.75}
                                    separator=" "
                                    decimals={4}
                                    decimal=","
                                />
                            )}{" "}
                            ADA
                        </motion.p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <motion.div
                        className="rounded-full bg-white/90 p-2 dark:bg-slate-800/90"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </motion.div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total ADA Tipped</p>
                        <motion.p
                            className="text-xl font-semibold text-blue-600 dark:text-blue-400"
                            key={balance}
                            variants={{
                                initial: { opacity: 0, x: -10 },
                                animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                            }}
                            initial="initial"
                            animate="animate"
                        >
                            {isLoadingBalance ? (
                                "0.00"
                            ) : (
                                <CountUp
                                    start={0}
                                    end={(((balance as number) / DECIMAL_PLACE) as number) || 0}
                                    duration={2.75}
                                    separator=" "
                                    decimals={4}
                                    decimal=","
                                />
                            )}{" "}
                            ADA
                        </motion.p>
                    </div>
                </div>
            </div>

            {isLoadingBalanceCommit ? (
                <div className="mt-4 text-center">
                    <motion.div
                        className="h-5 w-5 border-2 border-t-transparent border-blue-600 rounded-full mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </div>
            ) : balanceCommit === 0 ? (
                <form onSubmit={handleSubmit(onSubmitCommit)} className="flex flex-col mt-4">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                    >
                        <label
                            htmlFor="adaCommit"
                            className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                        >
                            Select ADA Commit
                        </label>
                        {isLoadingUTxOOnlyLovelace ? (
                            <div className="text-center py-2">
                                <motion.div
                                    className="h-5 w-5 border-2 border-t-transparent border-blue-600 rounded-full mx-auto"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                />
                            </div>
                        ) : dataUTxOOnlyLovelace?.length ? (
                            <select
                                id="adaCommit"
                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                                onChange={handleSelectChange}
                                aria-label="Select ADA amount to commit"
                            >
                                <option value="">-- Select amount --</option>
                                {dataUTxOOnlyLovelace
                                    .filter((utxo) => Number(utxo.amount) >= 10000000) // Ensure at least 10 ADA
                                    .map((utxo) => (
                                        <option key={`${utxo.txHash}-${utxo.outputIndex}`} value={JSON.stringify(utxo)}>
                                            {(Number(utxo.amount) / DECIMAL_PLACE).toFixed(2)} ADA
                                        </option>
                                    ))}
                            </select>
                        ) : (
                            <p className="text-sm text-red-500 dark:text-red-400 py-2">
                                No UTXOs with at least 10 ADA available for committing. Please add funds to your wallet.
                            </p>
                        )}

                        {errors.amount && (
                            <motion.p
                                className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                            >
                                {errors.amount.message}
                            </motion.p>
                        )}
                    </motion.div>
                    {dataUTxOOnlyLovelace?.length && dataUTxOOnlyLovelace.some((utxo) => Number(utxo.amount) >= 10000000) ? (
                        <motion.div
                            className="bg-white dark:bg-slate-900/50 pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        disabled={isSubmitting}
                                        className="w-full rounded-md bg-blue-500 dark:bg-blue-600 py-3 px-8 text-base font-semibold text-white dark:text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isSubmitting ? "Submitting..." : "Commit"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to apply for proposal?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You need to commit at least 10 ADA to register as a proposal. This amount will be refunded when the
                                            session ends.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSubmit(onSubmitCommit)} disabled={isSubmitting}>
                                            {isSubmitting ? "Committing..." : "Commit"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </motion.div>
                    ) : null}
                </form>
            ) : (
                <div className="mt-4 rounded-lg bg-blue-50/80 p-4 dark:bg-slate-800/80">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Token</span>
                        <div className="flex items-center gap-2">
                            <Image src={images.cardano} alt="ADA" className="h-5 w-5" />
                            <span className="font-medium text-gray-800 dark:text-gray-300">ADA</span>
                        </div>
                    </div>
                    <div className="flex flex-col ">
                        <div className="flex-1">
                            <motion.input
                                onChange={handleChange}
                                value={amount}
                                name="ADA"
                                type="text"
                                placeholder="Enter tip amount"
                                className="w-full rounded-lg border border-blue-200/50 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:focus:border-blue-500"
                                variants={{
                                    rest: { scale: 1, borderColor: "rgba(59, 130, 246, 0.5)" },
                                    hover: { scale: 1.02, borderColor: "rgba(59, 130, 246, 1)" },
                                    focus: { scale: 1.02, borderColor: "rgba(59, 130, 246, 1)" },
                                }}
                                initial="rest"
                                whileHover="hover"
                                whileFocus="focus"
                                transition={{ type: "spring", stiffness: 200 }}
                                aria-label="Enter ADA tip amount"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                ≈ ${(Number(amount) * (adaPrice || 0.35)).toFixed(2) || "0.00"} USD
                            </p>
                        </div>
                        <motion.div
                            className=" pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        disabled={isSubmitting}
                                        className="w-full rounded-md bg-blue-500 dark:bg-blue-600 py-3 px-8 text-base font-semibold text-white dark:text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isSubmitting ? "Submitting..." : "Commit"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to apply for proposal?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You need to commit at least 10 ADA to register as a proposal. This amount will be refunded when the
                                            session ends.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSubmit(onSubmitCommit)} disabled={isSubmitting}>
                                            {isSubmitting ? "Committing..." : "Commit"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </motion.div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default memo(FormTip);
