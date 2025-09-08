"use client";

import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { Warn } from "~/components/icons";
import Tipper from "~/components/tipper";
import { useWallet } from "~/hooks/use-wallet";
import { images } from "~/public/images";
import { getCreator } from "~/services/creator.service";
import { signup, submitTx } from "~/services/mesh.service";
import { commit, getHeadStatus, withdraw } from "~/services/hydra.service";
import { creatorFormSchema } from "~/lib/schema";
import { z } from "zod";

type Form = z.infer<typeof creatorFormSchema>;

export default function Dashboard() {
    const { address, signTx } = useWallet();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<Form>({
        resolver: zodResolver(creatorFormSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "",
            image: "",
        },
    });

    const formValues = watch();

    const onSubmit = useCallback(
        async (data: Form) => {
            try {
                setLoading(!loading);
                const unsignedTx = await signup({
                    walletAddress: address as string,
                    assetName: data.author,
                    metadata: { ...data },
                });

                const signedTx = await signTx(unsignedTx as string);
                await submitTx({ signedTx });

                // Kiểm tra lại trạng thái creator bằng cách invalidate query
                await queryClient.invalidateQueries({ queryKey: ["creator", address] });
            } catch (error) {
                console.error("TxSignError:", error);
            } finally {
                setLoading(false);
            }
        },
        [address, signTx, queryClient],
    );

    const commitFund = useCallback(async () => {
        try {
            const unsignedTx = await commit({ walletAddress: address as string, isCreator: true });
            const signedTx = await signTx(unsignedTx as string);
            await submitTx({ signedTx });
            await queryClient.invalidateQueries({ queryKey: ["creator", address] });
        } catch (error) {
            console.error(error);
        }
    }, [address, signTx, queryClient]);

    const handleWithdraw = useCallback(
        async function () {
            try {
                await withdraw({ walletAddress: address as string, isCreator: true });
                await queryClient.invalidateQueries({ queryKey: ["creator", address] });
            } catch (error) {
                console.log(error);
            }
        },
        [address, signTx, queryClient],
    );

    const { data } = useQuery({
        queryKey: ["creator", address],
        queryFn: () => getCreator({ walletAddress: address as string }),
    });

    const { data: headStatus } = useQuery({
        queryKey: ["status"],
        queryFn: () => getHeadStatus(),
    });

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <Header />
            {!data?.data ? (
                <aside className="container mx-auto py-8 px-4 pt-24">
                    <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                        <div>
                            <section className="w-full mb-6">
                                <div className="relative w-full rounded-lg border [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 text-destructive [&>svg]:text-destructive flex flex-col md:flex-row items-start md:items-center gap-4 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-4">
                                    <Warn />
                                    <div className="flex-1">
                                        <h5 className="mb-1 font-medium leading-none tracking-tight text-blue-700 dark:text-blue-200">
                                            You must verify your identity to withdraw funds.
                                        </h5>
                                        <div className="text-sm [&_p]:leading-relaxed text-blue-600 dark:text-blue-300">
                                            Status: {headStatus?.data || "Idle"}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6 flex flex-col">
                                    <div className="flex items-center justify-center">
                                        <div className="mx-auto w-full">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="mb-5">
                                                    <label
                                                        htmlFor="title"
                                                        className="mb-3 block text-base font-medium text-[#07074D] dark:text-gray-200"
                                                    >
                                                        Title
                                                    </label>
                                                    <input
                                                        {...register("title")}
                                                        type="text"
                                                        id="title"
                                                        placeholder="Enter your title"
                                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:border-[#6A64F1]"
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                                </div>
                                                <div className="mb-5">
                                                    <label
                                                        htmlFor="description"
                                                        className="mb-3 block text-base font-medium text-[#07074D] dark:text-gray-200"
                                                    >
                                                        Description
                                                    </label>
                                                    <textarea
                                                        {...register("description")}
                                                        id="description"
                                                        rows={6.5}
                                                        placeholder="Enter your description"
                                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:border-[#6A64F1]"
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                                </div>
                                                <div className="-mx-3 flex flex-wrap">
                                                    <div className="w-full px-3 sm:w-1/2">
                                                        <div className="mb-5">
                                                            <label
                                                                htmlFor="author"
                                                                className="mb-3 block text-base font-medium text-[#07074D] dark:text-gray-200"
                                                            >
                                                                Author
                                                            </label>
                                                            <input
                                                                {...register("author")}
                                                                type="text"
                                                                id="author"
                                                                placeholder="Enter your author"
                                                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:border-[#6A64F1]"
                                                                disabled={isSubmitting}
                                                            />
                                                            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="w-full px-3 sm:w-1/2">
                                                        <div className="mb-5">
                                                            <label
                                                                htmlFor="image"
                                                                className="mb-3 block text-base font-medium text-[#07074D] dark:text-gray-200"
                                                            >
                                                                Image
                                                            </label>
                                                            <input
                                                                {...register("image")}
                                                                type="text"
                                                                id="image"
                                                                placeholder="Enter your image URL"
                                                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:focus:border-[#6A64F1]"
                                                                disabled={isSubmitting}
                                                            />
                                                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none dark:bg-[#6A64F1] dark:hover:bg-[#5a54d1] disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? "Submitting..." : "Register"}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 flex flex-col">
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
                                            tag={"Creator"}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </aside>
            ) : (
                <aside className="container mx-auto py-8 px-4 pt-24">
                    <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                        <section className="w-full mb-6">
                            <div className="relative w-full rounded-lg border [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 text-destructive [&>svg]:text-destructive flex flex-col md:flex-row items-start md:items-center gap-4 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-4">
                                <Warn />
                                <div className="flex-1">
                                    <h5 className="mb-1 font-medium leading-none tracking-tight text-blue-700 dark:text-blue-200">
                                        You need to commit some ada to register as a creator.
                                    </h5>
                                    <div className="text-sm [&_p]:leading-relaxed text-blue-600 dark:text-blue-300">
                                        Status: {headStatus?.data || "Idle"}
                                    </div>
                                </div>
                                <button
                                    onClick={commitFund}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0 self-center"
                                >
                                    {isSubmitting ? "Submitting..." : "Register"}
                                </button>
                            </div>
                        </section>
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6 flex flex-col">
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
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Balance</p>
                                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0.00 ADA</div>
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
                                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Top Token</span>
                                                <button
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-gray-500 border border-gray-200 dark:border-gray-700 dark:text-gray-300 dark:bg-slate-700/60"
                                                    type="button"
                                                    id="radix-:r3:"
                                                    aria-haspopup="menu"
                                                    aria-expanded="false"
                                                    data-state="closed"
                                                >
                                                    View all{" "}
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
                                                        className="lucide lucide-chevron-down h-4 w-4 ml-1"
                                                    >
                                                        <path d="m6 9 6 6 6-6"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-left">
                                                    <span className="font-bold text-blue-600 dark:text-blue-400">0 ADA</span>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">$0.00 USD</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Image src={images.cardano} alt="ADA" className="h-5 w-5" />
                                                    <span className="font-medium dark:text-gray-300">ADA</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-[24px] bg-card text-card-foreground border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-r from-green-50/80 to-blue-50/80 dark:from-slate-900/80 dark:to-slate-800/80 dark:shadow-[0_0_15px_rgba(16,185,129,0.1)] overflow-hidden">
                                    <div className="flex flex-col space-y-1.5 bg-gradient-to-r from-green-100/80 to-blue-100/80 dark:from-slate-800/90 dark:to-slate-700/90 p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-3 flex items-center justify-center shadow-inner">
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
                                                    className="lucide lucide-coins h-5 w-5 text-blue-600 dark:text-blue-400"
                                                    aria-hidden="true"
                                                >
                                                    <circle cx="8" cy="8" r="6"></circle>
                                                    <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                                                    <path d="M7 6h1v4"></path>
                                                    <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">Your Tip Jar</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Share your tip jar with your fans</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="space-y-4 md:space-y-0">
                                            <div>
                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 dark:text-gray-300">
                                                    Your Tip Jar Link
                                                </label>
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <input
                                                        className="flex h-10 w-full rounded-md border px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono text-sm bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 shadow-sm"
                                                        value="https://tipjar.cardano2vn.io/accounts/nguyen-duy-khanh-undefined-n4jt"
                                                    />
                                                    <div className="flex gap-2 md:gap-3">
                                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border bg-background hover:text-accent-foreground h-10 px-4 py-2 border-blue-400 text-blue-500 dark:border-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
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
                                                                className="lucide lucide-qr-code h-4 w-4 mr-2"
                                                                aria-hidden="true"
                                                            >
                                                                <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                                                                <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                                                                <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                                                                <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
                                                                <path d="M21 21v.01"></path>
                                                                <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
                                                                <path d="M3 12h.01"></path>
                                                                <path d="M12 3h.01"></path>
                                                                <path d="M12 16v.01"></path>
                                                                <path d="M16 12h1"></path>
                                                                <path d="M21 12v.01"></path>
                                                                <path d="M12 21v-1"></path>
                                                            </svg>
                                                            Share QR
                                                        </button>
                                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 dark:hover:opacity-80 transition-opacity md:w-auto">
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
                                                                className="lucide lucide-copy h-4 w-4 mr-2"
                                                                aria-hidden="true"
                                                            >
                                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                                            </svg>
                                                            Copy Link
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 flex flex-col">
                                <div className="h-full min-h-[calc(100%)]">
                                    <div className="rounded-[24px] bg-card text-card-foreground flex flex-col h-[470px] overflow-hidden border border-blue-200/50 dark:border-blue-900/30">
                                        <div className="p-6 pt-0 dark:bg-slate-800 h-full flex flex-col">
                                            <div className="p-6 -mt-2 -mx-2 mb-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between px-[8px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-3 flex items-center justify-center shadow-inner">
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
                                                            className="lucide lucide-dollar-sign h-5 w-5 text-blue-600 dark:text-blue-400"
                                                            aria-hidden="true"
                                                        >
                                                            <line x1="12" x2="12" y1="2" y2="22"></line>
                                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg dark:text-white">Recent Tips</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Your latest received tips</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-300 space-y-4 flex-1">
                                                <div className="rounded-full p-8 bg-sky-100">
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
                                                        className="lucide lucide-dollar-sign h-12 w-12 text-blue-500"
                                                        aria-hidden="true"
                                                    >
                                                        <line x1="12" x2="12" y1="2" y2="22"></line>
                                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                                    </svg>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-medium dark:text-gray-200">Tips you receive will appear here</p>
                                                    <p className="text-sm mt-2 dark:text-gray-400">Share your Tip Jar link with your audience</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="w-full">
                            <div className="rounded-[24px] bg-card text-card-foreground border border-blue-200/50 dark:border-blue-900/30 col-span-2">
                                <div className="space-y-1.5 p-6 flex flex-row items-center gap-2 py-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-slate-800/90 dark:to-slate-700/90">
                                    <div className="rounded-full bg-[#D3E4FD] dark:bg-blue-900/30 p-2">
                                        <ArrowRight />
                                    </div>
                                    <h3 className="font-semibold text-lg">Withdrawal History</h3>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">Withdrawals you make will appear here.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            )}
            <Footer />
        </main>
    );
}
