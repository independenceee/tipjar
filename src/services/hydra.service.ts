"use server";

import { MeshWallet } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { isNil } from "lodash";
import { APP_NETWORK_ID, HYDRA_HTTP_URL, HYDRA_HTTP_URL_SUB, HYDRA_WS_URL, HYDRA_WS_URL_SUB } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { HydraTxbuilder } from "~/txbuilders/hydra.txbuilder";
import { parseError } from "~/utils/error/parse-error";

/**
 * @description
 * @param param { walletAddress: , isCreator: }
 * @returns
 */
export const commit = async function ({ walletAddress, isCreator = false }: { walletAddress: string; isCreator: boolean }) {
    try {
        if (isNil(walletAddress)) {
            throw new Error("walletAddress has been required.");
        }

        const meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "address",
                address: walletAddress,
            },
        });

        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        const hydraTxbuilder: HydraTxbuilder = new HydraTxbuilder({ meshWallet: meshWallet, hydraProvider: hydraProvider });
        const unsignedTx = await hydraTxbuilder.commit();

        return unsignedTx;
    } catch (error) {
        return error;
    }
};

export const tip = async function ({
    walletAddress,
    tipAddress,
    amount,
    isCreator = false,
}: {
    walletAddress: string;
    tipAddress: string;
    amount: number;
    isCreator: boolean;
}) {
    try {
        if (isNil(walletAddress)) {
            throw new Error("walletAddress has been required.");
        }

        const meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "address",
                address: walletAddress,
            },
        });

        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        const hydraTxBuilder: HydraTxbuilder = new HydraTxbuilder({ meshWallet: meshWallet, hydraProvider: hydraProvider });
        const unsignedTx = await hydraTxBuilder.tip({ tipAddress: tipAddress, amount: amount });
        return unsignedTx;
    } catch (error) {
        console.log(error);
    }
};

export const submitHydraTx = async function ({
    signedTx,
    isCreator,
}: {
    signedTx: string;
    isCreator: boolean;
}): Promise<{ data: string | null; result: boolean; message: string }> {
    try {
        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        const txHash = await hydraProvider.submitTx(signedTx);

        return {
            data: txHash,
            result: true,
            message: "Transaction submitted successfully",
        };
    } catch (error) {
        return {
            data: null,
            result: false,
            message: parseError(error),
        };
    }
};
