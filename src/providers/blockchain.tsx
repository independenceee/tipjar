"use client";

import { isNil } from "lodash";
import { useSession } from "next-auth/react";
import { PropsWithChildren, useEffect } from "react";
import { useWallet, WalletStoreType, useWalletSync } from "~/hooks/use-wallet";

export default function BlockchainProvider({ children }: PropsWithChildren) {
    const { disconnect }: WalletStoreType = useWallet();
    const { data: session, status } = useSession();

    useWalletSync();

    useEffect(() => {
        if (isNil(session) || status === "unauthenticated") {
            disconnect();
        }
    }, [session, status, disconnect]);

    return <main>{children}</main>;
}
