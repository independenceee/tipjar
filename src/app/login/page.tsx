"use client";

import Link from "next/link";
import Image from "next/image";
import { images } from "~/public/images";
import { routers } from "~/constants/routers";
import { useSession } from "next-auth/react";
import { wallets } from "~/constants/wallets";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import { networks } from "~/constants/networks";
import Network from "~/components/network";
import Wallet from "~/components/wallet";
import { WalletType } from "~/types";
export const dynamic = "force-dynamic";

export default function SignInPage() {
    const [network, setNetwork] = useState<string>("preview");

    useEffect(() => {
        const networkConnection = localStorage.getItem("network");
        if (networkConnection) {
            setNetwork(JSON.parse(networkConnection));
        }
    }, []);

    useEffect(() => {
        if (network) {
            localStorage.setItem("network", JSON.stringify(network));
        }
    }, [network]);

    const router = useRouter();

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            redirect("/dashboard");
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="mx-auto my-0 flex h-full w-full  flex-col">
                <header className="z-10 p-4 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex h-14 items-center justify-between">
                            <section className="flex items-center">
                                <Link href={routers.home} className="flex items-center gap-3">
                                    <Image className="h-12 w-auto animate-pulse" loading="lazy" src={images.logo} alt="Cardano2vn" />
                                    <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-300 font-stretch-50%">Tipjar Hydra</h3>
                                </Link>
                            </section>
                            <ul className="flex items-center justify-center gap-7">
                                <Link href={"https://traceability.trustorstudio.com/"}>
                                    <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 36, height: 36 }} network="telegram" />
                                </Link>
                                <Link href={"https://traceability.trustorstudio.com/"}>
                                    <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 36, height: 36 }} network="discord" />
                                </Link>
                                <Link href={"https://traceability.trustorstudio.com/"}>
                                    <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 36, height: 36 }} network="github" />
                                </Link>
                                <Link href={"https://traceability.trustorstudio.com/"}>
                                    <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 36, height: 36 }} network="x" />
                                </Link>
                            </ul>
                        </div>
                    </div>
                </header>

                <main className="mt-[60px] mb-[20px] flex items-center justify-center flex-col h-full">
                    <section className="w-[540px] box-border py-[35px] px-[45px] bg-slate-900 shadow-lg rounded-md">
                        <div className="flex items-center justify-between">
                            <div className=" text-[20px]">
                                <strong>Connect Wallet</strong>
                            </div>
                            <div className="w-[120px] text-[16px] text-end">
                                <strong>{network.charAt(0).toUpperCase() + network.slice(1).toLowerCase()}</strong>
                            </div>
                        </div>

                        <div className="flex mt-5">
                            <section className="pr-[30px] border-r-[1px] flex flex-col gap-5 border-solid border-gray-500 mr-[30px] h-[230px] overflow-y-auto overflow-x-hidden">
                                {networks.map(({ image, name }, index: number) => {
                                    return (
                                        <Network
                                            image={image}
                                            name={name}
                                            key={index}
                                            isActive={name.toLowerCase() === network.toLowerCase()}
                                            setNetwork={setNetwork}
                                        />
                                    );
                                })}
                            </section>
                            <section className="overflow-x-hidden overflow-y-auto pr-[20px] mr-[-20px] h-[230px] flex flex-col gap-2 ">
                                {wallets.map((wallet: WalletType, index: number) => {
                                    return <Wallet key={index} wallet={wallet} session={session} />;
                                })}
                            </section>
                        </div>
                    </section>

                    <section className="mt-[20px] ">
                        <div className="flex items-center justify-center  text-center ">
                            <p>Web2 Login Powered by Particle Network</p>
                        </div>
                        <div className="flex items-center justify-center  text-center gap-6 my-[20px]">
                            <Link href={"https://traceability.trustorstudio.com/"}>
                                <SocialIcon href={"https://traceability.trustorstudio.com/"} style={{ width: 36, height: 36 }} network="x" />
                            </Link>
                            <Link href={"https://traceability.trustorstudio.com/"}>
                                <SocialIcon href={"https://traceability.trustorstudio.com/"} style={{ width: 36, height: 36 }} network="github" />
                            </Link>
                        </div>
                    </section>
                </main>

                <footer className="pb-[20px] text-center">
                    <Link className="underline-offset-2 underline" href={"https://traceability.trustorstudio.com/"} target="_blake">
                        Help Center
                    </Link>
                    <p className="mt-[16px] text-gray-400">Traceability Network Foundation Independence</p>
                </footer>
            </div>
        </div>
    );
}
