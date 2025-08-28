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
    const [isDownload, setIsDownload] = useState<boolean>(false);

    useEffect(() => {
        (async function () {
            try {
                if (wallet?.checkApi) {
                    setIsDownload(await wallet?.checkApi());
                } else {
                    setIsDownload(false);
                }
            } catch (_) {
                setIsDownload(false);
            }
        })();
    }, []);

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

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <main
                    className={cn(
                        "flex items-center justify-between w-[332px] py-2 px-[35px] rounded-md text-[18px] relative text-gray-300 border border-gray-600 select-none cursor-pointer",
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
                    <AlertDialogTitle>{isDownload ? "Are you absolutely sure?" : "Download " + wallet?.name + "?"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isDownload
                            ? "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                            : "Clicking 'Continue' will start the download process."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={
                            isDownload
                                ? async () => {
                                      await signIn(session, {
                                          icon: wallet.image,
                                          id: wallet.id,
                                          name: wallet.name,
                                          version: wallet.version || "",
                                      });
                                  }
                                : handleDownload
                        }
                    >
                        {isDownload ? "Continue" : "Download"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
