"use server";

import { MeshWallet } from "@meshsdk/core";
import { isNil } from "lodash";
import { APP_NETWORK_ID } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { HydraTxbuilder } from "~/txbuilders/hydra.txbuilder";

export const commit = async function ({ walletAddress }: { walletAddress: string }) {
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

        const hydraTxbuilder: HydraTxbuilder = new HydraTxbuilder({ meshWallet: meshWallet });
        const unsignedTx = await hydraTxbuilder.commit();

        return unsignedTx;
    } catch (error) {
        return error;
    }
};
