"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import Tipper from "~/components/tipper";
import Status from "~/components/status";
import Balance from "~/components/balance";
import Info from "~/components/info";
import Recent from "~/components/recent";
import Withdraw from "~/components/withdraw";
import Loading from "~/components/loading";
import { useWallet } from "~/hooks/use-wallet";
import { images } from "~/public/images";
import { routers } from "~/constants/routers";
import { DECIMAL_PLACE, HeadStatus } from "~/constants/common";
import { createProposal, getProposal } from "~/services/tipjar.service";
import { commit, getStatus } from "~/services/hydra.service";
import { getUTxOOnlyLovelace, submitTx } from "~/services/mesh.service";
import { CreatorSchema } from "~/lib/schema";
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

type Form = z.infer<typeof CreatorSchema>;

export default function Dashboard() {
    const { status: sessionStatus } = useSession();
    const queryClient = useQueryClient();
    const { address, signTx } = useWallet();
    const [loading, setLoading] = useState(false);

    const { data: proposalData, isLoading: isProposalLoading } = useQuery({
        queryKey: ["proposal", address],
        queryFn: () => getProposal({ walletAddress: address as string }),
        enabled: !!address && sessionStatus === "authenticated",
    });

    const { data: statusData, isLoading: isStatusLoading } = useQuery({
        queryKey: ["status", address],
        queryFn: () => getStatus({ walletAddress: address as string, isCreator: true }),
        enabled: !!address && sessionStatus === "authenticated",
    });

    const { data: utxoData, isLoading: isUtxoLoading } = useQuery({
        queryKey: ["utxos", address],
        queryFn: () => getUTxOOnlyLovelace({ walletAddress: address as string, quantity: DECIMAL_PLACE * 10 }),
        enabled: !!address && sessionStatus === "authenticated",
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        watch,
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
            if (!address || !data.adaCommit) return;
            try {
                setLoading(true);
                const unsignedTx = await commit({
                    walletAddress: address,
                    input: {
                        txHash: data.adaCommit.txHash,
                        outputIndex: data.adaCommit.outputIndex,
                    },
                    isCreator: true,
                    status: statusData as string,
                });

                const signedTx = await signTx(unsignedTx as string);
                await submitTx({ signedTx });

                await createProposal({
                    walletAddress: address,
                    assetName: data.author,
                    metadata: {
                        title: data.title,
                        description: data.description,
                        author: data.author,
                        image: (data?.image as string) || "",
                        startDate: data.startDate,
                        endDate: data.endDate,
                        participants: data.participants,
                    },
                });

                toast.success("Proposal created successfully!");
                queryClient.invalidateQueries({ queryKey: ["status", "proposal"] });
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to create proposal");
            } finally {
                setLoading(false);
            }
        },
        [address, signTx, queryClient, statusData],
    );

    const formInputs = useMemo(
        () => [
            { id: "title", label: "Title", type: "text", placeholder: "Enter your title" },
            { id: "description", label: "Description", type: "textarea", placeholder: "Enter your description", rows: 4 },
            { id: "author", label: "Author", type: "text", placeholder: "Enter your author name" },
            { id: "image", label: "Image URL", type: "text", placeholder: "Enter your image URL" },
            { id: "startDate", label: "Start Date", type: "date" },
            { id: "endDate", label: "End Date", type: "date" },
            { id: "participants", label: "Max Participants", type: "number", placeholder: "Enter max number of participants", min: 1, max: 1000 },
        ],
        [],
    );

    if (sessionStatus === "loading" || isProposalLoading || isStatusLoading || isUtxoLoading || loading) {
        return <Loading />;
    }

    if (sessionStatus === "unauthenticated") {
        redirect("/login");
    }

    if (statusData === HeadStatus.OPEN || statusData === HeadStatus.CLOSED || statusData === HeadStatus.FANOUT_POSSIBLE) {
        return (
            <motion.main
                className="relative pt-20"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.2, ease: "easeOut" },
                    },
                }}
                initial="hidden"
                animate="visible"
            >
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <motion.div
                        className="flex flex-col items-center justify-center py-16 text-center"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                        }}
                    >
                        <motion.div
                            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Image src={images.logo} alt="Logo" />
                        </motion.div>
                        <motion.h3
                            className="text-2xl font-semibold text-gray-900 dark:text-white mb-2"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                        >
                            Head Is Currently In Use
                        </motion.h3>
                        <motion.p
                            className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-6"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                        >
                            No tippers to display at the moment. Check back later or try a different page!
                        </motion.p>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={routers.tipper}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm bg-blue-600 dark:bg-white px-8 py-2 text-lg font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100"
                            >
                                Go To Tipper
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.main>
        );
    }

    if ((!proposalData?.data && statusData === HeadStatus.IDLE) || (!proposalData?.data && statusData === HeadStatus.INITIALIZING)) {
        return (
            <motion.aside
                className="container mx-auto py-8 px-4 pt-24"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.2, ease: "easeOut" },
                    },
                }}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                    <motion.section
                        className="w-full mb-6"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                        }}
                    >
                        <Status
                            title="There is now a head available for you to access and below is the current state of your head"
                            loading={isStatusLoading}
                            data={statusData as string}
                        />
                    </motion.section>
                    <motion.section
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.2, ease: "easeOut" },
                            },
                        }}
                    >
                        <div className="space-y-6 flex flex-col">
                            <motion.div
                                className="w-full max-w-2xl mx-auto rounded-xl h-full bg-white dark:bg-slate-900/50 p-6 shadow-md shadow-blue-200/30 dark:shadow-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                                }}
                            >
                                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                    {formInputs.map(({ id, label, type, placeholder, rows, min, max }, index) => (
                                        <motion.div
                                            key={id}
                                            className="relative"
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                                            }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                        >
                                            <label
                                                htmlFor={id}
                                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                                            >
                                                {label}
                                            </label>
                                            {type === "textarea" ? (
                                                <textarea
                                                    {...register(id as keyof Form)}
                                                    id={id}
                                                    rows={rows}
                                                    placeholder={placeholder}
                                                    className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                                    disabled={isSubmitting}
                                                />
                                            ) : (
                                                <input
                                                    {...register(id as keyof Form, { valueAsNumber: type === "number" })}
                                                    id={id}
                                                    type={type}
                                                    placeholder={placeholder}
                                                    min={min}
                                                    max={max}
                                                    className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                            {errors[id as keyof Form] && (
                                                <motion.p
                                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                                >
                                                    {errors[id as keyof Form]?.message}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        className="relative"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                                        }}
                                        transition={{ delay: 0.8 }}
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
                                                    disabled={isSubmitting || !utxoData?.length}
                                                    value={field.value ? JSON.stringify(field.value) : ""}
                                                    onChange={(e) => field.onChange(e.target.value ? JSON.parse(e.target.value) : undefined)}
                                                >
                                                    <option value="">-- Select amount --</option>
                                                    {utxoData?.map((utxo) => (
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
                                    <motion.div
                                        className="bg-white dark:bg-slate-900/50 pt-4"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                                        }}
                                        transition={{ delay: 0.9 }}
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
                                                    <AlertDialogTitle>Confirm Proposal Registration</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        You need to commit more than 10 ADA to register as a proposal. This amount will be refunded
                                                        when the session ends.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleSubmit(onSubmit)}>
                                                        {isSubmitting ? "Committing..." : "Commit"}
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
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                        >
                            <div className="h-full min-h-[calc(100%)]">
                                <Tipper
                                    title={formValues.title || "Open source dynamic assets (Token/NFT) generator (CIP68)"}
                                    image={formValues.image || images.logo}
                                    author={formValues.author || "Cardano2vn"}
                                    slug=""
                                    datetime={new Date().toLocaleString("en-GB", {
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

    return (
        <motion.aside
            className="container mx-auto py-8 px-4 pt-24"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2, ease: "easeOut" },
                },
            }}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                <motion.section
                    className="w-full mb-6"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    <Status
                        title="There is now a head available for you to access and below is the current state of your head"
                        loading={isStatusLoading}
                        data={statusData as string}
                    />
                </motion.section>
                <motion.section
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2, ease: "easeOut" },
                        },
                    }}
                >
                    <div className="space-y-6 flex flex-col">
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                        >
                            <Balance
                                status={statusData as string}
                                proposal={proposalData?.data}
                                walletAddress={address as string}
                                assetName={proposalData?.data?.author as string}
                            />
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                        >
                            <Info link={`https://tipjar.cardano2vn.io/tipper/${address}`} />
                        </motion.div>
                    </div>
                    <motion.div
                        className="space-y-6 flex flex-col"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                        }}
                    >
                        <Recent walletAddress={address as string} />
                    </motion.div>
                </motion.section>
                <motion.div
                    className="w-full"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    <Withdraw walletAddress={address as string} />
                </motion.div>
            </div>
        </motion.aside>
    );
}
