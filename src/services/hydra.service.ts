"use server";

import { MeshWallet, UTxO } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { isNil } from "lodash";
import { DECIMAL_PLACE } from "~/constants/common";
import cbor from "cbor";
import { APP_NETWORK_ID, HYDRA_HTTP_URL, HYDRA_HTTP_URL_SUB, HYDRA_WS_URL, HYDRA_WS_URL_SUB } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { HydraTxBuilder } from "~/txbuilders/hydra.txbuilder";
import { parseError } from "~/utils/error/parse-error";
import { MeshTxBuilder } from "~/txbuilders/mesh.txbuilder";

export const withdraw = async function ({
    walletAddress,
    assetName,
    isCreator = false,
}: {
    walletAddress: string;
    assetName: string;
    isCreator: boolean;
}) {
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
        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({ meshWallet: meshWallet });
        const hydraTxBuilder: HydraTxBuilder = new HydraTxBuilder({ meshWallet: meshWallet, hydraProvider: hydraProvider });
        await hydraProvider.connect();
        const status = await hydraProvider.get("head");
        if (status.tag === "Idle") {
            return await meshTxBuilder.signout({
                assetName: assetName,
            });
        }

        await hydraProvider.close();
        await hydraTxBuilder.fanout();
        await hydraTxBuilder.final();

        return await meshTxBuilder.signout({
            assetName: assetName,
        });
    } catch (error) {
        console.log(error);
    }
};

/**
 * @description Register to become a creator or supporter.
 * @param param { walletAddress: , isCreator: }
 * @returns
 */
export const commit = async function ({
    walletAddress,
    isCreator = false,
    isInit = false,
}: {
    walletAddress: string;
    isCreator: boolean;
    isInit: boolean;
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
        await hydraTxBuilder.connect();
        if (isInit) {
            console.log("Init", isInit);
            await hydraTxBuilder.init();
        }
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
export const send = async function ({
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
        console.log(JSON.stringify(error));
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
        await hydraProvider.connect();
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

export const getRecents = async function ({ walletAddress, page = 1, limit = 12 }: { walletAddress: string; page?: number; limit?: number }) {
    try {
        if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim() === "") {
            return {
                data: null,
                message: "Invalid wallet address provided",
            };
        }

        const hydraProvider = new HydraProvider({
            httpUrl: HYDRA_HTTP_URL || HYDRA_HTTP_URL_SUB,
            wsUrl: HYDRA_WS_URL || HYDRA_WS_URL_SUB,
        });

        const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);
        const total = utxos.length;
        const utxosSlice: Array<UTxO> = utxos
            .filter((utxo) => utxo.output.plutusData && !isNil(utxo.output.plutusData) && utxo.output.plutusData !== "")
            .slice((page - 1) * limit, page * limit);

        const data = await Promise.all(
            utxosSlice.map(async function (utxo) {
                if (utxo.output.plutusData) {
                    try {
                        const buffer = Buffer.from(utxo.output.plutusData, "hex");
                        const decoded = await cbor.decodeFirst(buffer);
                        const datum = decoded.value[0].toString("utf-8");
                        const parsed = JSON.parse(datum);

                        return {
                            walletAddress: parsed.walletAddress as string,
                            datetime: parsed.datetime as string,
                            txHash: utxo.input.txHash,
                            amount: utxo.output.amount.find((amt) => amt.unit === "lovelace")?.quantity
                                ? Number(
                                      (Number(utxo.output.amount.find((amt) => amt.unit === "lovelace")?.quantity) / DECIMAL_PLACE).toFixed(
                                          DECIMAL_PLACE.toString().length - 1,
                                      ),
                                  )
                                : 0,
                        };
                    } catch (error) {
                        throw new Error(String(error));
                    }
                }
            }),
        );
        return {
            data: data || null,
            totalItem: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        return {
            data: null,
            message: parseError(error),
        };
    }
};

export const getStatus = async function ({ walletAddress, isCreator }: { walletAddress: string; isCreator: boolean }) {
    try {
        if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim() === "") {
            return {
                data: null,
                message: "Invalid wallet address provided",
            };
        }

        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);

        await hydraProvider.connect();
        const status = await hydraProvider.get("head");

        return {
            status: status.tag as string,
            committed: utxos.length > 0,
        };
    } catch (error) {
        return {
            status: "Idle",
            committed: false,
        };
    }
};

export const getBalance = async function ({ walletAddress }: { walletAddress: string }) {
    try {
        if (!walletAddress || walletAddress.trim() === "") {
            return 0;
        }

        const hydraProvider = new HydraProvider({
            httpUrl: HYDRA_HTTP_URL || HYDRA_HTTP_URL_SUB,
            wsUrl: HYDRA_WS_URL || HYDRA_WS_URL_SUB,
        });
        await hydraProvider.connect();
        const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);

        const utxosSlice: Array<UTxO> = utxos.filter(
            (utxo) => utxo.output.plutusData && !isNil(utxo.output.plutusData) && utxo.output.plutusData !== "",
        );

        const balance = utxosSlice.reduce((total: number, utxo: UTxO) => {
            const amounts = Array.isArray(utxo?.output?.amount) ? utxo.output.amount : [];
            const lovelaceAsset = amounts.find((asset) => asset.unit === "lovelace");
            const amount = Number(lovelaceAsset?.quantity || 0);
            return total + amount;
        }, 0);

        return balance;
    } catch (error) {
        return 0;
    }
};

export const getBalanceOther = async function ({ walletAddress }: { walletAddress: string }) {
    try {
        if (!walletAddress || walletAddress.trim() === "") {
            return 0;
        }

        const hydraProvider = new HydraProvider({
            httpUrl: HYDRA_HTTP_URL || HYDRA_HTTP_URL_SUB,
            wsUrl: HYDRA_WS_URL || HYDRA_WS_URL_SUB,
        });
        await hydraProvider.connect();
        const utxos = await hydraProvider.fetchUTxOs();

        const utxosSlice: Array<UTxO> = utxos.filter(async function (utxo) {
            if (utxo.output.plutusData) {
                const buffer = Buffer.from(utxo.output.plutusData, "hex");
                const decoded = await cbor.decodeFirst(buffer);
                const datum = decoded.value[0].toString("utf-8");
                const parsed = JSON.parse(datum);

                return parsed.walletAddress === walletAddress;
            }
        });

        const balance = utxosSlice.reduce((total: number, utxo: UTxO) => {
            const amounts = Array.isArray(utxo?.output?.amount) ? utxo.output.amount : [];
            const lovelaceAsset = amounts.find((asset) => asset.unit === "lovelace");
            const amount = Number(lovelaceAsset?.quantity || 0);
            return total + amount;
        }, 0);

        return balance;
    } catch (error) {
        return 0;
    }
};
