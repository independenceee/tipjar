"use client";

import Footer from "~/components/footer";
import Header from "~/components/header";
import Info from "~/components/info";
import Recent from "~/components/recent";
import FormTip from "~/components/form-tip";
import { useParams } from "next/navigation";
import Status from "~/components/status";
import Withdraw from "~/components/withdraw";

export default function Page() {
    const params = useParams();

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <Header />
            <aside className="container mx-auto py-8 px-4 pt-24">
                <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
                    <section className="w-full mb-6">
                        <Status walletAddress={params.address as string} isCreator={false} />
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6 flex flex-col">
                            <FormTip tipAddress={params.address as string} />
                            <Info link={`https://tipjar.cardano2vn.io/tipper/${params.address}`} />
                        </div>
                        <div className="space-y-6 flex flex-col">
                            <Recent walletAddress={params.address as string} />
                        </div>
                    </section>

                    <div className="w-full">
                        <Withdraw walletAddress={params.address as string} />
                    </div>
                </div>
            </aside>
            <Footer />
        </main>
    );
}
