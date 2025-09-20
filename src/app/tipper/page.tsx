"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Tipper from "~/components/tipper";
import Title from "~/components/title";
import TipperSkeleton from "~/components/tipper-skeleton";
import Pagination from "~/components/pagination";
import { useWallet } from "~/hooks/use-wallet";
import { getProposals } from "~/services/tipjar.service";
import { routers } from "~/constants/routers";
import { images } from "~/public/images";
import { toast } from "sonner";

const TipperPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const { address } = useWallet();

    const { data, isLoading, error } = useQuery({
        queryKey: ["proposals", page, address],
        queryFn: () => getProposals({ limit: 12, page, walletAddress: address || "" }),
    });

    const noItemsContent = useMemo(
        () => (
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
                    <Image src={images.logo} alt="Tipjar Logo" />
                </motion.div>
                <motion.h3
                    className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.2 }}
                >
                    No Tippers Available
                </motion.h3>
                <motion.p
                    className="mb-6 max-w-md text-lg text-gray-600 dark:text-gray-300"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.4 }}
                >
                    It looks like there are no tippers to display at the moment. Check back later or create your own Tipjar!
                </motion.p>
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        href={routers.dashboard}
                        className="inline-flex items-center justify-center rounded-sm bg-blue-600 px-8 py-2 text-lg font-semibold text-white shadow-xl hover:bg-blue-700 dark:bg-white dark:text-blue-900 dark:hover:bg-gray-100"
                    >
                        Create Tipjar
                    </Link>
                </motion.div>
            </motion.div>
        ),
        [],
    );

    if (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load tippers");
        return noItemsContent;
    }

    return (
        <motion.main className="relative pt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                >
                    <Title
                        title="Tippers"
                        description="Discover creators and communities thriving with Cardano Hydra-powered tipping. Join the decentralized revolution in rewarding talent."
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.section
                            key="loading"
                            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { duration: 0.4 } },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {Array.from({ length: 8 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                                    }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <TipperSkeleton />
                                </motion.div>
                            ))}
                        </motion.section>
                    ) : !data?.data.length ? (
                        noItemsContent
                    ) : (
                        <motion.section
                            key="data"
                            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { duration: 0.4 } },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {data.data.map((result, index) => (
                                <motion.div
                                    key={result.walletAddress || index}
                                    className="rounded-xl border border-blue-100 bg-white shadow-lg dark:border-blue-900/30 dark:bg-slate-900/80"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                                    }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}
                                >
                                    <Tipper
                                        image={result.image || images.logo}
                                        title={result.title || "Untitled Proposal"}
                                        author={result.author || "Unknown Author"}
                                        slug={result.walletAddress || ""}
                                        datetime={new Date(Number(result.datetime || Date.now())).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        participants={2}
                                    />
                                </motion.div>
                            ))}
                        </motion.section>
                    )}
                </AnimatePresence>

                {(data?.totalPages ?? 0) > 1 && (
                    <motion.div
                        className="mt-12 flex justify-center"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                        }}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                    >
                        <Pagination currentPage={page} totalPages={data?.totalPages ?? 0} setCurrentPage={setPage} />
                    </motion.div>
                )}
            </div>
        </motion.main>
    );
};

export default TipperPage;
