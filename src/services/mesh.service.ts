"use server";

import { MeshWallet } from "@meshsdk/core";
import { isNil } from "lodash";
import { APP_NETWORK_ID } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { MeshTxBuilder } from "~/txbuilders/mesh.txbuilder";
import { parseError } from "~/utils/error/parse-error";

export const register = async function ({
    walletAddress,
    assetName,
    metadata,
}: {
    walletAddress: string;
    assetName: string;
    metadata: Record<string, string>;
}) {
    try {
        if (isNil(walletAddress)) {
            throw new Error("User not found");
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

        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({ meshWallet: meshWallet });
        const unsignedTx = await meshTxBuilder.register({
            assetName: assetName,
            metadata: {
                walletAddress: walletAddress,
                datetime: Date.now().toString(),
                ...metadata,
            },
        });

        return unsignedTx;
    } catch (error) {
        return error;
    }
};

export const submitTx = async ({ signedTx }: { signedTx: string }): Promise<{ data: string | null; result: boolean; message: string }> => {
    try {
        const txHash = await blockfrostProvider.submitTx(signedTx);

        await new Promise<void>((resolve, reject) => {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                resolve();
            });
        });

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
