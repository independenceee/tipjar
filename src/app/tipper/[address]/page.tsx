"use client";

import { useParams } from "next/navigation";
import { ArrowRight, Wallet } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { Warn } from "~/components/icons";
import { useWallet } from "~/hooks/use-wallet";
import { images } from "~/public/images*";
import { commit, send, submitHydraTx } from "~/services/hydra.service";
import { submitTx } from "~/services/mesh.service";
import Info from "~/components/info";
import Recent from "~/components/recent";

export default function Page() {
    const params = useParams();
    const { address, signTx } = useWallet();
    const [amount, setAmount] = useState(0);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        setAmount(Number(value));
    }, []);

    const handleCommit = useCallback(async () => {
        const unsignedTx = await commit({ walletAddress: address as string, isCreator: false });
        const signedTx = await signTx(unsignedTx as string);
        await submitTx({ signedTx });
    }, [address, signTx]);

    const handleTip = useCallback(async () => {
        try {
            const unsignedTx = await send({
                walletAddress: address as string,
                amount: amount,
                tipAddress: params.address as string,
                isCreator: true,
            });

            const signedTx = await signTx(unsignedTx as string);
            await submitHydraTx({
                signedTx: signedTx,
                isCreator: true,
            });
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }, [address, amount, signTx]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <Header />
            <aside className="container mx-auto py-8 px-4 pt-24">
                <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                    <section className="w-full mb-6">
                        <div className="relative w-full rounded-lg border [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 text-destructive [&>svg]:text-destructive flex flex-col md:flex-row items-start md:items-center gap-4 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-4">
                            <Warn />
                            <div className="flex-1">
                                <h5 className="mb-1 font-medium leading-none tracking-tight text-blue-700 dark:text-blue-200">
                                    You must verify your identity to withdraw funds.
                                </h5>
                                <div className="text-sm [&amp;_p]:leading-relaxed text-blue-600 dark:text-blue-300">Status: created</div>
                            </div>
                            <button
                                onClick={handleCommit}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0 self-center"
                            >
                                Register
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
                                                        <Wallet />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Ada You Tiped</p>
                                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0.00 ADA</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4 overflow-auto">
                                    <div className="p-4 rounded-lg bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100/50 dark:border-slate-700/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Top Token</span>
                                            <div className="flex items-center gap-2">
                                                <Image src={images.cardano} alt="ADA" className="h-5 w-5" />
                                                <span className="font-medium dark:text-gray-300">ADA</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start  gap-4 justify-between">
                                            <div className="text-left flex flex-col gap-2  w-full ">
                                                <input
                                                    onChange={handleChange}
                                                    value={amount === 0 ? "" : amount}
                                                    name="ADA"
                                                    type="text"
                                                    placeholder="Enter amount tipper"
                                                    className="flex-1 rounded text-[16px] whitespace-nowrap font-medium transition-colors  h-20 py-2 px-3 w-full md:w-auto bg-white outline-none border-b border-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-700 dark:hover:bg-slate-700"
                                                />
                                                <div className="text-sm text-gray-500 dark:text-gray-400">$0.00 USD</div>
                                            </div>
                                            <button
                                                onClick={handleTip}
                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 rounded-md px-3 w-full md:w-auto bg-white hover:bg-gray-50 text-blue-600 border border-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-700 dark:hover:bg-slate-700"
                                                aria-disabled="true"
                                            >
                                                Tip Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Info />
                        </div>
                        <div className="space-y-6 flex flex-col">
                            <Recent walletAddress={params.address as string} />
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
            <Footer />
        </main>
    );
}
