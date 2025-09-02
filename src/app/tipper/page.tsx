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
    const { data, isLoading, error } = useQuery({ queryKey: ["getCreater"], queryFn: () => getCreaters({ limit: 12, page: page }) });
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-white relative">
                <Header />
                <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                        <div>
                            <Title
                                title="Tippers"
                                description="Insights, updates, and stories from the Andamio ecosystem. Explore our journey building trust protocols for distributed work."
                            />
                        </div>

                        {error ? (
                            <div>
                                <NotFound onClearFilters={() => {}} />
                            </div>
                        ) : (
                            <section className="grid gap-8 lg:grid-cols-2">
                                {isLoading
                                    ? Array.from({ length: 6 }).map((_, i) => (
                                          <div key={i}>
                                              <TipperSkeleton />
                                          </div>
                                      ))
                                    : data?.data.map((result, index) => {
                                          return (
                                              <div key={index}>
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
                                          );
                                      })}
                            </section>
                        )}

                        <div>{data && <Pagination currentPage={page} totalPages={data?.totalPages as number} setCurrentPage={setPage} />}</div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
