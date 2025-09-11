"use client";

import { shortenString } from "~/lib/utils";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdOutlineFeedback } from "react-icons/md";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useWallet } from "~/hooks/use-wallet";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { APP_NETWORK } from "~/constants/enviroments";
import Copy from "~/components/copy";
import { Separator } from "~/components/ui/separator";
import { DECIMAL_PLACE } from "~/constants/common";
import { Button } from "~/components/ui/button";

export default function Account() {
    const { wallet, address, browserWallet, stakeAddress } = useWallet();
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        (async () => {
            if (browserWallet) {
                const balance = await browserWallet.getLovelace();
                setBalance(Number(balance));
            }
        })();
    }, [browserWallet]);

    return (
        <Popover>
            <PopoverTrigger
                className={
                    "items-center gap-2 rounded-3xl border border-gray-300 bg-white pr-4 pl-1 py-1 text-sm font-medium text-gray-800 shadow-lg transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 dark:border-white/30 dark:bg-gray-800/50 dark:text-white dark:hover:border-white/50 dark:hover:bg-gray-700/50 hidden xl:inline-flex"
                }
            >
                <div className={"h-8 w-8"}>
                    <Image
                        className={"h-full w-full rounded-full bg-gray-600 object-cover p-1 dark:bg-slate-700"}
                        src={wallet?.icon || ""}
                        width={32}
                        height={32}
                        alt={`${wallet?.icon} icon`}
                    />
                </div>
                <div className="">
                    <h2 className="text-[13px] leading-4 text-gray-800 dark:text-white">
                        {address?.slice(0, 12)}...{address?.slice(-4)}
                    </h2>
                    <p className={"text-left text-[14px] leading-4 text-gray-700 dark:text-gray-300"}>
                        <CountUp start={0} end={Number((balance / DECIMAL_PLACE).toFixed(6))} decimals={6} /> ₳
                    </p>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className={"mt-2 flex min-w-[315px] flex-col gap-4 rounded-xl p-5 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"}
                align="end"
            >
                <div className="flex items-center gap-3">
                    <div className={"h-10 w-10"}>
                        <Image
                            className={"h-full w-full object-cover"}
                            src={wallet?.icon || ""}
                            alt={`${wallet?.name} icon`}
                            width={32}
                            height={32}
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">{wallet?.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize"> {APP_NETWORK}</p>
                    </div>
                </div>
                <Separator className="my-1 bg-gray-300 dark:bg-slate-500" />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Stake:</p>
                            <span className="text-sm text-gray-900 dark:text-gray-100">{shortenString(stakeAddress || "", 11)}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <Copy className="h-4 w-4" content={stakeAddress || ""} />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Change:</p>
                            <span className="text-sm text-gray-900 dark:text-gray-100">{shortenString(address || "", 10)}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <Copy className="h-4 w-4" content={stakeAddress || ""} />
                        </Button>
                    </div>
                </div>
                <div className={"leading-0 h-[1px] overflow-hidden bg-gray-300 dark:bg-slate-500"} />
                <div className={"relative flex items-center"}>
                    <Link className="flex cursor-pointer items-center gap-1 text-gray-500 dark:text-gray-300" href={"/"}>
                        <MdOutlineFeedback />
                        <span className="text-[14px]">Feedback</span>
                    </Link>
                </div>
                <div className={"relative flex items-center"}>
                    <Link className="flex cursor-pointer items-center gap-1 text-gray-500 dark:text-gray-300" href={"/"}>
                        <IoIosHelpCircleOutline />
                        <span className="text-[14px]">Help</span>
                    </Link>
                </div>

                <div className={"leading-0 h-[1px] overflow-hidden bg-gray-300 dark:bg-slate-500"} />
                <div className={"flex flex-col items-center gap-3"}>
                    <Button
                        onClick={() => signOut()}
                        className={
                            "w-[180px] cursor-pointer rounded-[35px] bg-gray-300 dark:bg-slate-500 text-center text-[14px] leading-[25px] text-gray-700 dark:text-gray-400"
                        }
                    >
                        Log out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
