import React from "react";
import { create } from "zustand";
import { BrowserWallet, UTxO, Wallet } from "@meshsdk/core";
import { Session } from "next-auth";
import { isNil } from "lodash";
import { getNonceAddress } from "~/utils/auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { APP_NETWORK, APP_NETWORK_ID } from "~/constants/enviroments";
import { wallets } from "~/constants/wallets";

export interface WalletStoreType {
    wallet: Wallet | null;
    address: string | null;
    stakeAddress: string | null;
    browserWallet: BrowserWallet | null;
    getBalance: () => Promise<number>;
    getUtxos: () => Promise<Array<UTxO>>;
    signTx: (unsignedTx: string) => Promise<string>;
    submitTx: (signedTx: string) => Promise<string>;
    disconnect: () => Promise<void>;
    signIn: (session: Session | null, wallet: Wallet) => Promise<void>;
    syncWithSession: (session: Session | null) => Promise<void>;
}

export const useWallet = create<WalletStoreType>((set, get) => ({
    wallet: null,
    browserWallet: null,
    address: null,
    stakeAddress: null,

    getUtxos: async () => {
        const { browserWallet } = get();
        if (!browserWallet) {
            return [];
        }
        return await browserWallet.getUtxos();
    },
    getBalance: async () => {
        const { browserWallet } = get();
        if (!browserWallet) {
            return 0;
        }
        const balance = await browserWallet.getLovelace();
        return Number(balance);
    },
    signTx: async (unsignedTx: string) => {
        const { browserWallet, wallet } = get();
        if (!browserWallet || !wallet) {
            throw new Error("Wallet not connected");
        }
        const signedTx = await browserWallet.signTx(unsignedTx);
        if (!signedTx) {
            throw new Error("Failed to sign data");
        }
        return signedTx;
    },

    submitTx: async (signedTx: string) => {
        const { browserWallet } = get();
        if (!browserWallet) {
            throw new Error("Wallet not connected");
        }
        const txHash = await browserWallet.submitTx(signedTx);
        if (!txHash) {
            throw new Error("Failed to submit transaction");
        }
        return txHash;
    },

    signIn: async (session: Session | null, wallet: Wallet) => {
        try {
            const { name } = wallet;
            const browserWallet: BrowserWallet = await BrowserWallet.enable(name.toLowerCase());
            if (!browserWallet) {
                throw new Error("Failed to connect wallet");
            }
            const network = await browserWallet.getNetworkId();
            if (network !== APP_NETWORK_ID) {
                throw new Error(`Invalid network, please switch to ${APP_NETWORK}`);
            }
            const address = await browserWallet.getChangeAddress();

            if (address.length === 0) {
                throw new Error("Cant get address");
            }
            const stakeList = await browserWallet.getRewardAddresses();
            if (stakeList.length === 0) {
                throw new Error("Cant get stake address");
            }
            const stakeAddress = stakeList[0];

            if (isNil(session)) {
                const { data, result, message } = await getNonceAddress(address);
                if (!result || isNil(data)) {
                    throw new Error(message);
                }
                const signature = await browserWallet.signData(data);
                if (isNil(signature)) {
                    throw new Error("Cant get signature");
                }
                await signIn("credentials", {
                    data: JSON.stringify({
                        wallet: name,
                        address: address,
                    }),
                });
                set({
                    browserWallet: browserWallet,
                    wallet: wallet,
                    address: address,
                    stakeAddress: stakeAddress,
                });
            } else if (session.user?.address !== address) {
                throw new Error("Invalid address");
            } else {
                const address = await browserWallet.getChangeAddress();
                set({
                    browserWallet: browserWallet,
                    wallet: wallet,
                    address: address,
                    stakeAddress: stakeAddress,
                });
            }
        } catch (error) {
            await signOut();
        }
    },

    disconnect: async () => {
        set({ browserWallet: null!, wallet: null! });
    },

    syncWithSession: async (session: Session | null) => {
        if (!session?.user?.address) {
            set({ browserWallet: null, wallet: null, address: null, stakeAddress: null });
            return;
        }

        const { wallet, address } = get();
        
        if (wallet && address === session.user.address) {
            return;
        }

        try {
            const walletName = session.user.wallet;
            
            if (walletName) {
                let browserWallet: BrowserWallet | null = null;
                let retryCount = 0;
                const maxRetries = 3;
                
                while (!browserWallet && retryCount < maxRetries) {
                    try {
                        browserWallet = await BrowserWallet.enable(walletName.toLowerCase());
                    } catch (enableError) {
                        retryCount++;
                        
                        if (retryCount < maxRetries) {
                            await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
                        } else {
                            throw enableError;
                        }
                    }
                }
                
                if (browserWallet) {
                    const network = await browserWallet.getNetworkId();
                    
                    if (network === APP_NETWORK_ID) {
                        const address = await browserWallet.getChangeAddress();
                        const stakeList = await browserWallet.getRewardAddresses();
                        const stakeAddress = stakeList[0];

                        const walletConfig = wallets.find(w => w.name.toLowerCase() === walletName.toLowerCase());
                        
                        set({
                            browserWallet: browserWallet,
                            wallet: {
                                icon: walletConfig?.image || "",
                                id: walletName,
                                name: walletName,
                                version: walletConfig?.version || "",
                            },
                            address: address,
                            stakeAddress: stakeAddress,
                        });
                    }
                }
            }
        } catch (error) {
        }
    },
}));

export const useWalletSync = () => {
    const { data: session } = useSession();
    const { syncWithSession } = useWallet();

    React.useEffect(() => {
        if (session) {
            const timeoutId = setTimeout(() => {
                syncWithSession(session);
            }, 1000);
            
            return () => clearTimeout(timeoutId);
        } else {
            syncWithSession(session);
        }
    }, [session, syncWithSession]);
};
