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

export default function TipperPage() {
    const [currentPage, setCurrentPage] = useState(1);

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

                        {[1].length === 0 ? (
                            <div>
                                <NotFound onClearFilters={() => {}} />
                            </div>
                        ) : (
                            <section className="grid gap-8 lg:grid-cols-2">
                                {[].length === 0
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                          <div key={i}>
                                              <TipperSkeleton />
                                          </div>
                                      ))
                                    : [].map((post: any, index) => {
                                          let imageUrl = "/images/common/loading.png";
                                          return (
                                              <div key={post.id}>
                                                  <Tipper
                                                      image={imageUrl}
                                                      title={post.title}
                                                      author={post.author || "Admin"}
                                                      slug={post.slug || post.id}
                                                      datetime={new Date(post.createdAt).toLocaleString("en-GB", {
                                                          day: "2-digit",
                                                          month: "2-digit",
                                                          year: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })}
                                                      tags={post.tags || []}
                                                  />
                                              </div>
                                          );
                                      })}
                            </section>
                        )}

                        <div>
                            <Pagination currentPage={currentPage} totalPages={10} setCurrentPage={setCurrentPage} />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
