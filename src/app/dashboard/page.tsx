"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Footer from "~/components/footer";
import Header from "~/components/header";
import Tipper from "~/components/tipper";
import { useWallet } from "~/hooks/use-wallet";
import { images } from "~/public/images";
import { getCreator } from "~/services/tipjar.service";
import { signup, submitTx } from "~/services/mesh.service";
import { CreatorSchema } from "~/lib/schema";
import { z } from "zod";
import Info from "~/components/info";
import Recent from "~/components/recent";
import Status from "~/components/status";
import Withdraw from "~/components/withdraw";
import Loading from "~/components/loading";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Balance from "~/components/balance";

type Form = z.infer<typeof CreatorSchema>;

export default function Dashboard() {
    const session = useSession();
    const { address, signTx } = useWallet();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["creator", address],
        queryFn: () => getCreator({ walletAddress: address as string }),
    });
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<Form>({
        resolver: zodResolver(CreatorSchema),
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
                await queryClient.invalidateQueries({ queryKey: ["creator", address] });
            } catch (error) {
                console.error("TxSignError:", error);
            } finally {
                setLoading(false);
            }
        },
        [address, signTx, queryClient],
    );

    if (session.status === "loading") {
        return <Loading />;
    }

    if (session.status === "unauthenticated") {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <Header />

            {isLoading ? (
                <div className="container mx-auto py-8 px-4 pt-24">
                    <Loading />
                </div>
            ) : !data?.data ? (
                <aside className="container mx-auto py-8 px-4 pt-24">
                    <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                        <div>
                            <section className="w-full mb-6">
                                <Status isCreator={true} />
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
                            <Status isCreator={true} />
                        </section>
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6 flex flex-col">
                                <Balance walletAddress={address as string} />
                                <Info link={`https://tipjar.cardano2vn.io/tipper/${address}`} />
                            </div>
                            <div className="space-y-6 flex flex-col">
                                <Recent walletAddress={address as string} />
                            </div>
                        </section>

                        <div className="w-full">
                            <Withdraw walletAddress={address as string} />
                        </div>
                    </div>
                </aside>
            )}

            <Footer />
        </main>
    );
}
