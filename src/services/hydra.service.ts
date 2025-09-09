"use server";

import { MeshWallet } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { isNil } from "lodash";
import { APP_NETWORK_ID, HYDRA_HTTP_URL, HYDRA_HTTP_URL_SUB, HYDRA_WS_URL, HYDRA_WS_URL_SUB } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { HydraTxBuilder } from "~/txbuilders/hydra.txbuilder";
import { parseError } from "~/utils/error/parse-error";

export const withdraw = async function ({ walletAddress, isCreator = false }: { walletAddress: string; isCreator: boolean }) {
    try {
        if (isNil(walletAddress)) {
            throw new Error("walletAddress has been required.");
        }

        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        const meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "address",
                address: walletAddress,
            },
        });

        const hydraTxBuilder: HydraTxBuilder = new HydraTxBuilder({ meshWallet: meshWallet, hydraProvider: hydraProvider });

        await hydraTxBuilder.fanout();
        await hydraTxBuilder.final();

        return {
            data: null,
            result: true,
            message: "Withdraw successfully",
        };
    } catch (error) {
        console.log(error);
    }
};

/**
 * @description Register to become a creator or supporter.
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

        const status = await hydraProvider.get("head");
        console.log(status);
        if (status.tag !== "OPEN") {
            await hydraProvider.connect();
        }
        const hydraTxBuilder: HydraTxBuilder = new HydraTxBuilder({ meshWallet: meshWallet, hydraProvider: hydraProvider });
        const unsignedTx = await hydraTxBuilder.commit();

        return unsignedTx;
    } catch (error) {
        return error;
    }
};

/**
 * @description Tip to a creator.
 * @param param0 { walletAddress, tipAddress, amount, isCreator }
 * @returns unsignedTx
 */
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

        const hydraTxBuilder: HydraTxBuilder = new HydraTxBuilder({ meshWallet: meshWallet, hydraProvider: hydraProvider });
        await hydraTxBuilder.initialize();
        const unsignedTx = await hydraTxBuilder.send({ tipAddress: tipAddress, amount: amount });
        return unsignedTx;
    } catch (error) {
        console.log(error);
    }
};

/**
 *
 * @param param0 { signedTx, isCreator }
 * @returns
 */
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

export const getHeadStatus = async function () {
    try {
        const hydraProvider = new HydraProvider({
            httpUrl: HYDRA_HTTP_URL,
            wsUrl: HYDRA_WS_URL,
        });

        const status = await hydraProvider.get("head");

        return {
            data: status.tag,
            result: true,
            message: "Get head status successfully",
        };
    } catch (error) {
        return {
            data: null,
            result: false,
            message: parseError(error),
        };
    }
};
