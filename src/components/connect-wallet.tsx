"use client";

import dynamic from "next/dynamic";
import { isNil } from "lodash";
import { useWallet } from "~/hooks/use-wallet";
import Account from "~/components/account";
import { ClipLoader } from "react-spinners";

import { routers } from "~/constants/routers";
import Link from "next/link";

const Wallet = () => {
    const { wallet } = useWallet();

    return (
        <div>
            {!isNil(wallet) ? (
                <Account />
            ) : (
                <section className="hidden xl:block">
                    <Link
                        href={routers.login}
                        className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-gray-800/50 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:border-white/50 hover:bg-gray-700/50"
                    >
                        <span>Connect Wallet</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </Link>
                </section>
            )}
        </div>
    );
};

export const ConnectWallet = dynamic(() => Promise.resolve(Wallet), {
    loading: () => <div></div>,
    ssr: false,
});
