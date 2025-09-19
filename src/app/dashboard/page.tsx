"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import Tipper from "~/components/tipper";
import { useWallet } from "~/hooks/use-wallet";
import { images } from "~/public/images";
import { createProposal, getProposal } from "~/services/tipjar.service";
import Info from "~/components/info";
import Recent from "~/components/recent";
import Status from "~/components/status";
import Withdraw from "~/components/withdraw";
import Loading from "~/components/loading";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Balance from "~/components/balance";
import { motion } from "framer-motion";
import { commit, getStatus } from "~/services/hydra.service";
import z from "zod";
import { CreatorSchema } from "~/lib/schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "~/components/ui/alert-dialog";

import { DECIMAL_PLACE, HeadStatus } from "~/constants/common";
import { toast } from "sonner";
import Link from "next/link";
import { routers } from "~/constants/routers";

type Form = z.infer<typeof CreatorSchema>;

export default function Dashboard() {
    const session = useSession();
    const queryClient = useQueryClient();
    const { address, signTx } = useWallet();
    const [loading, setLoading] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["creator", address],
        queryFn: () => getProposal({ walletAddress: address as string }),
    });

    const { data: dataStatus, isLoading: isLoadingStatus } = useQuery({
        queryKey: ["status", address],
        queryFn: () => getStatus({ walletAddress: address as string, isCreator: true }),
        enabled: !!address,
    });

    const { data: dataUTxOOnlyLovelace, isLoading: isLoadingUTxOOnlyLovelace } = useQuery({
        queryKey: ["utxos", address],
        queryFn: () => getUTxOOnlyLovelace({ walletAddress: address as string, quantity: DECIMAL_PLACE * 10 }),
        enabled: !!address,
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        control,
    } = useForm<Form>({
        resolver: zodResolver(CreatorSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "",
            image: "",
            startDate: "",
            endDate: "",
            participants: 2,
            adaCommit: undefined,
        },
    });

    const formValues = watch();

    const onSubmit = useCallback(
        async (data: Form) => {
            try {
                setLoading(true);
                const unsignedTx = await commit({
                    walletAddress: address as string,
                    input: {
                        txHash: data.adaCommit.txHash,
                        outputIndex: data.adaCommit.outputIndex,
                    },
                    isCreator: true,
                    status: dataStatus as string,
                });
                const signedTx = await signTx(unsignedTx as string);
                await submitTx({ signedTx: signedTx as string });

                await createProposal({
                    walletAddress: address as string,
                    assetName: data.author,
                    metadata: {
                        title: data.title,
                        description: data.description,
                        author: data.author,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        participants: data.participants,
                    },
                });
                toast.success("You created proposal successfully !");
                queryClient.invalidateQueries({ queryKey: ["status"] });
            } catch (error) {
                toast.error(String(error));
            } finally {
                setLoading(false);
            }
        },
        [address, signTx, queryClient, setLoading],
    );

    if (session.status === "loading" || isLoadingStatus || isLoading || isLoadingUTxOOnlyLovelace) {
        return <Loading />;
    }

    if (session.status === "unauthenticated") {
        redirect("/login");
    }

    if (dataStatus === HeadStatus.OPEN || dataStatus === HeadStatus.CLOSED || dataStatus === HeadStatus.FANOUT_POSSIBLE) {
        return (
            <main className="relative pt-20">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
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
                            Head Is Currently In Use.
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
                                href={routers.tipper}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 dark:bg-white px-8 py-2 text-lg font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100"
                            >
                                Go To Tipper
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        );
    }

    if (!data?.data && !isLoading && !isLoadingStatus) {
        return (
            <motion.aside
                className="container mx-auto py-8 px-4 pt-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                    <motion.section
                        className="w-full mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Status
                            title="There is now a head available for you to access and below is the current state of your head"
                            loading={isLoadingStatus}
                            data={dataStatus as string}
                        />
                    </motion.section>
                    <motion.section
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="space-y-6 flex flex-col">
                            <motion.div
                                className="w-full max-w-2xl mx-auto rounded-xl h-full bg-white dark:bg-slate-900/50 p-6 shadow-md shadow-blue-200/30 dark:shadow-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <form className="space-y-6">
                                    <motion.div
                                        className="relative"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                    >
                                        <label
                                            htmlFor="title"
                                            className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                                        >
                                            Title
                                        </label>
                                        <input
                                            {...register("title")}
                                            type="text"
                                            id="title"
                                            placeholder="Enter your title"
                                            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                        {errors.title && (
                                            <motion.p
                                                className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                            >
                                                {errors.title.message}
                                            </motion.p>
                                        )}
                                    </motion.div>
                                    <motion.div
                                        className="relative"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                    >
                                        <label
                                            htmlFor="description"
                                            className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            {...register("description")}
                                            id="description"
                                            rows={4}
                                            placeholder="Enter your description"
                                            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                        {errors.description && (
                                            <motion.p
                                                className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                            >
                                                {errors.description.message}
                                            </motion.p>
                                        )}
                                    </motion.div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <motion.div
                                            className="relative w-full sm:w-1/2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.4 }}
                                        >
                                            <label
                                                htmlFor="author"
                                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                                            >
                                                Author
                                            </label>
                                            <input
                                                {...register("author")}
                                                type="text"
                                                id="author"
                                                placeholder="Enter your author name"
                                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                                disabled={isSubmitting}
                                            />
                                            {errors.author && (
                                                <motion.p
                                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                                >
                                                    {errors.author.message}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                        <motion.div
                                            className="relative w-full sm:w-1/2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.5 }}
                                        >
                                            <label
                                                htmlFor="image"
                                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                                            >
                                                Image URL
                                            </label>
                                            <input
                                                {...register("image")}
                                                type="text"
                                                id="image"
                                                placeholder="Enter your image URL"
                                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                                disabled={isSubmitting}
                                            />
                                            {errors.image && (
                                                <motion.p
                                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                                >
                                                    {errors.image.message}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <motion.div
                                            className="relative w-full sm:w-1/2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.6 }}
                                        >
                                            <label
                                                htmlFor="startDate"
                                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                                            >
                                                Start Date
                                            </label>
                                            <input
                                                {...register("startDate")}
                                                type="date"
                                                id="startDate"
                                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                                disabled={isSubmitting}
                                            />
                                            {errors.startDate && (
                                                <motion.p
                                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                                >
                                                    {errors.startDate.message}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                        <motion.div
                                            className="relative w-full sm:w-1/2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.7 }}
                                        >
                                            <label
                                                htmlFor="endDate"
                                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                                            >
                                                End Date
                                            </label>
                                            <input
                                                {...register("endDate")}
                                                type="date"
                                                id="endDate"
                                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                                disabled={isSubmitting}
                                            />
                                            {errors.endDate && (
                                                <motion.p
                                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                                >
                                                    {errors.endDate.message}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <motion.div
                                            className="relative w-full sm:w-1/2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.8 }}
                                        >
                                            <label
                                                htmlFor="participants"
                                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                                            >
                                                Max Participants
                                            </label>
                                            <input
                                                {...register("participants", { valueAsNumber: true })}
                                                type="number"
                                                id="participants"
                                                placeholder="Enter max number of participants"
                                                min="1"
                                                max="1000"
                                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                                disabled={isSubmitting}
                                            />
                                            {errors.participants && (
                                                <motion.p
                                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                                >
                                                    {errors.participants.message}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        <motion.div
                                            className="relative w-full sm:w-1/2"
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

                                            <Controller
                                                name="adaCommit"
                                                control={control}
                                                rules={{ required: "Please select an ADA amount" }}
                                                render={({ field }) => (
                                                    <select
                                                        id="adaCommit"
                                                        className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                                        disabled={isSubmitting || !dataUTxOOnlyLovelace?.length}
                                                        value={field.value ? JSON.stringify(field.value) : ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value ? JSON.parse(e.target.value) : undefined;
                                                            field.onChange(value);
                                                        }}
                                                    >
                                                        <option value="">-- Select amount --</option>
                                                        {dataUTxOOnlyLovelace?.map((utxo) => (
                                                            <option key={`${utxo.txHash}-${utxo.outputIndex}`} value={JSON.stringify(utxo)}>
                                                                {Number(utxo.amount) / DECIMAL_PLACE} ADA
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            />

                                            {errors.adaCommit && (
                                                <motion.p
                                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                                >
                                                    {errors.adaCommit.message}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    </div>
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
                                                <button
                                                    disabled={isSubmitting}
                                                    className="w-full rounded-md bg-blue-500 dark:bg-blue-600 py-3 px-8 text-base font-semibold text-white dark:text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                >
                                                    {isSubmitting ? "Submitting..." : "Register"}
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure you want to apply for proposal ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        You need to commit more than 10 ADA to register as a proposal. This amount will be refunded
                                                        when the session ends.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleSubmit(onSubmit)}>
                                                        {isSubmitting ? "Commiting..." : "Commit"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </motion.div>
                                </form>
                            </motion.div>
                        </div>
                        <motion.div
                            className="space-y-6 flex flex-col"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <div className="h-full min-h-[calc(100%)]">
                                <Tipper
                                    title={formValues.title || "Open source dynamic assets (Token/NFT) generator (CIP68)"}
                                    image={formValues.image || images.logo}
                                    author={formValues.author || "Cardano2vn"}
                                    slug={""}
                                    datetime={new Date(Date.now()).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    participants={2}
                                />
                            </div>
                        </motion.div>
                    </motion.section>
                </div>
            </motion.aside>
        );
    }

    if (data?.data && !isLoadingStatus && !isLoading) {
        return (
            <motion.aside
                className="container mx-auto py-8 px-4 pt-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                    <motion.section
                        className="w-full mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Status
                            title="There is now a head available for you to access and below is the current state of your head"
                            loading={isLoadingStatus}
                            data={dataStatus as string}
                        />
                    </motion.section>
                    <motion.section
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="space-y-6 flex flex-col">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <Balance
                                    status={dataStatus as string}
                                    proposal={data?.data}
                                    walletAddress={address as string}
                                    assetName={data.data?.author as string}
                                />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                                <Info link={`https://tipjar.cardano2vn.io/tipper/${address}`} />
                            </motion.div>
                        </div>
                        <motion.div
                            className="space-y-6 flex flex-col"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Recent walletAddress={address as string} />
                        </motion.div>
                    </motion.section>
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <Withdraw walletAddress={address as string} />
                    </motion.div>
                </div>
            </motion.aside>
        );
    }

    return <Loading />;
}
