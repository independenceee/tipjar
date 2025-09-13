"use client";

import { isEmpty, isNil } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useWallet, WalletStoreType } from "~/hooks/use-wallet";
import { BrowserWallet, Wallet } from "@meshsdk/core";

export default function BlockchainProvider({ children }: PropsWithChildren) {
    const { signIn, wallet, disconnect, browserWallet, address }: WalletStoreType = useWallet();
    const { data: session, status } = useSession();

    console.log(wallet);

    const [wallets, setWallets] = useState<Wallet[]>([]);
    useEffect(() => {
        (async function get() {
            setWallets(await BrowserWallet.getAvailableWallets());
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (isEmpty(wallets)) {
                return;
            }
            if (isNil(session) || status === "unauthenticated") {
                disconnect();
                return;
            }
            if (isNil(wallet)) {
                const walletConnect = session?.user
                    ? wallets.find((w) => w.name.toLocaleLowerCase() === session.user?.wallet?.toLocaleLowerCase())
                    : null;
                if (!walletConnect) {
                    await signOut();
                    return;
                }
                signIn(session, walletConnect);
            }
        })();
    }, [disconnect, session, signIn, status, wallet, wallets, browserWallet, address]);

    return <main>{children}</main>;
}
