"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import Image from "next/image";
import { WalletType } from "~/types";
import { useEffect, useState } from "react";
import { useWallet } from "~/hooks/use-wallet";
import { cn } from "~/lib/utils";
import { Session } from "next-auth";

type Props = {
    wallet: WalletType;
    session: Session | null;
};
export default function Wallet({ wallet, session }: Props) {
    const { signIn } = useWallet();
    const [isEnable, setIsEnable] = useState<boolean>(false);
    const [isDownload, setIsDownload] = useState<boolean>(false);

    useEffect(() => {
        (async function () {
            try {
                if (wallet?.isDownload) {
                    setIsDownload(await wallet?.isDownload());
                } else {
                    setIsDownload(false);
                }
            } catch (_) {
                setIsDownload(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async function () {
            try {
                if (wallet?.isEnable) {
                    setIsEnable(await wallet?.isEnable());
                } else {
                    setIsEnable(false);
                }
            } catch (_) {
                setIsEnable(false);
            }
        })();
    }, [isEnable]);

    const handleDownload = async () => {
        if (wallet?.downloadApi) {
            if (
                typeof wallet?.downloadApi === "string" &&
                (wallet?.downloadApi.startsWith("http://") || wallet?.downloadApi.startsWith("https://"))
            ) {
                window.open(wallet?.downloadApi, "_blank");
            }
        }
    };

    const handleEnable = async function () {
        if (wallet?.enable && wallet.isEnable) {
            await wallet.enable();
            setIsEnable(true);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <main
                    className={cn(
                        "flex items-center justify-between w-[332px] py-2 px-[35px] rounded-md text-[18px] relative select-none cursor-pointer border transition-colors",
                        "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-slate-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800",
                        {
                            "opacity-50 cursor-not-allowed": !isDownload,
                        },
                    )}
                >
                    <span>{wallet?.name}</span>
                    <Image src={wallet?.image} className="w-[30px] h-[30px]" alt={""} />
                </main>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isDownload
                            ? isEnable
                                ? " Are you absolutely sure?"
                                : "Authorized " + wallet?.name + "?"
                            : "Download " + wallet?.name + "?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isDownload
                            ? isEnable
                                ? "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                                : "You authorize the wallet to interact with the interface."
                            : "Clicking 'Continue' will start the download process."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={
                            isDownload
                                ? isEnable
                                    ? async () => {
                                          await signIn(session, {
                                              icon: wallet.image,
                                              id: wallet.id,
                                              name: wallet.name,
                                              version: wallet.version || "",
                                          });
                                      }
                                    : handleEnable
                                : handleDownload
                        }
                    >
                        {isDownload ? (isEnable ? "Continue" : "Enable") : "Download"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
