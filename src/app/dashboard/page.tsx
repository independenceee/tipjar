"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Footer from "~/components/footer";
import Header from "~/components/header";
import Tipper from "~/components/tipper";
import { useWallet } from "~/hooks/use-wallet";
import { images } from "~/public/images";
import { getCreator } from "~/services/tipjar.service";
import CreatorForm from "~/components/creator-form";
import Info from "~/components/info";
import Recent from "~/components/recent";
import Status from "~/components/status";
import Withdraw from "~/components/withdraw";
import Loading from "~/components/loading";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Balance from "~/components/balance";
import { motion } from "framer-motion";

export default function Dashboard() {
    const session = useSession();
    const { address } = useWallet();
    const [loading, setLoading] = useState(false);
    const { data, isLoading } = useQuery({
        queryKey: ["creator", address],
        queryFn: () => getCreator({ walletAddress: address as string }),
    });

    const { formValues, form } = CreatorForm({ setLoading });

    if (session.status === "loading") {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Loading />
            </motion.div>
        );
    }

    if (session.status === "unauthenticated") {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <Header />
            {isLoading ? (
                <motion.div
                    className="container mx-auto py-8 px-4 pt-24"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Loading />
                </motion.div>
            ) : !data?.data ? (
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
                            <Status isCreator={true} />
                        </motion.section>
                        <motion.section
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="space-y-6 flex flex-col">{form}</div>
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
            ) : (
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
                            <Status isCreator={true} />
                        </motion.section>
                        <motion.section
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="space-y-6 flex flex-col">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                    <Balance walletAddress={address as string} assetName={data.data?.author as string} />
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
            )}
            <Footer />
        </main>
    );
}
