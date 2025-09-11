"use client";

import Tipper from "~/components/tipper";
import Title from "~/components/title";
import { useState } from "react";
import TipperSkeleton from "~/components/tipper-skeleton";
import Pagination from "~/components/pagination";
import { useQuery } from "@tanstack/react-query";
import NotFound from "~/components/not-found";
import Header from "~/components/header";
import Footer from "~/components/footer";
import { getCreaters } from "~/services/creator.service";

export default function TipperPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useQuery({ queryKey: ["getCreater", page], queryFn: () => getCreaters({ limit: 12, page }) });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <main className="relative pt-20">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <Title
                        title="Tippers"
                        description="Insights, updates, and stories from the Andamio ecosystem. Explore our journey building trust protocols for distributed work."
                    />

                    {error ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <NotFound />
                        </div>
                    ) : isLoading ? (
                        <section className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <TipperSkeleton />
                                </div>
                            ))}
                        </section>
                    ) : data?.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <NotFound />
                        </div>
                    ) : (
                        <section className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 transition-all duration-300">
                            {data?.data.map((result, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl shadow-lg bg-white dark:bg-slate-900/80 border border-blue-100 dark:border-blue-900/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                                >
                                    <Tipper
                                        image={result?.image || "/images/common/loading.png"}
                                        title={result?.title as string}
                                        author={result?.author as string}
                                        slug={result?.walletAddress as string}
                                        datetime={new Date(Number(result?.datetime)).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        tag={result?.tag as string}
                                    />
                                </div>
                            ))}
                        </section>
                    )}

                    <div className="mt-12 flex justify-center">
                        {(data?.totalPages ?? 0) > 1 && <Pagination currentPage={page} totalPages={data?.totalPages ?? 0} setCurrentPage={setPage} />}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
