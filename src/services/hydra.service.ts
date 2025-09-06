"use server";

import { MeshWallet } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { isNil } from "lodash";
import { APP_NETWORK_ID, HYDRA_HTTP_URL, HYDRA_HTTP_URL_SUB, HYDRA_WS_URL, HYDRA_WS_URL_SUB } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { HydraTxbuilder } from "~/txbuilders/hydra.txbuilder";

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
