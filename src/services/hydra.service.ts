"use server";

import { MeshWallet, UTxO } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { isNil } from "lodash";
import { DECIMAL_PLACE, HeadStatus } from "~/constants/common";
import cbor from "cbor";
import { APP_MNEMONIC, APP_NETWORK_ID, HYDRA_HTTP_URL, HYDRA_HTTP_URL_SUB, HYDRA_WS_URL, HYDRA_WS_URL_SUB } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { HydraTxBuilder } from "~/txbuilders/hydra.txbuilder";

import { parseError } from "~/utils/error/parse-error";

export const withdraw = async function ({ status, isCreator = false }: { status: string; isCreator: boolean }) {
    try {
        const meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                words: APP_MNEMONIC?.split(" ") || [],
            },
        });

        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        const hydraTxBuilder: HydraTxBuilder = new HydraTxBuilder({
            meshWallet: meshWallet,
            hydraProvider: hydraProvider,
        });

        await hydraProvider.connect();
        switch (status) {
            case HeadStatus.OPEN:
                await hydraProvider.close();
                await hydraTxBuilder.fanout();
                await hydraTxBuilder.final();
                break;
            case HeadStatus.CLOSED:
                await hydraTxBuilder.fanout();
                await hydraTxBuilder.final();
                break;
            case HeadStatus.FANOUT_POSSIBLE:
                await hydraTxBuilder.final();
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
};

/**
 * Commit UTXOs from a wallet into a Hydra Head session.
 *
 * This function connects to a Hydra node (creator or subscriber),
 * optionally initializes the Hydra Head if `isInit` is true,
 * and commits UTXOs associated with the provided wallet address.
 *
 * @param {string} walletAddress - The wallet address that will commit UTXOs.
 * @param {boolean} isCreator - Whether the wallet is the creator of the Hydra Head.
 * @param {boolean} isInit - Whether to initialize the Hydra Head (only valid if isCreator is true).
 *
 * @returns {Promise<{success: boolean; unsignedTx: unknown; message: string}>}
 *          An object containing success flag, unsigned transaction, and message.
 *
 * @throws {Error} If the wallet address is missing or Hydra/Mesh operations fail.
 */
export const commit = async function ({
    walletAddress,
    input,
    isCreator = false,
    status,
}: {
    walletAddress: string;
    input?: { txHash: string; outputIndex: number };
    isCreator: boolean;
    status?: string;
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

        console.log(status === HeadStatus.IDLE);
        if (status === HeadStatus.IDLE) {
            await hydraTxBuilder.init();
        }

        return await hydraTxBuilder.commit({ input: input });
    } catch (error) {
        throw Error(String(error));
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

        const utxos = (await hydraProvider.fetchAddressUTxOs(walletAddress)).filter(
            (utxo) => utxo.output.plutusData && !isNil(utxo.output.plutusData) && utxo.output.plutusData !== "",
        );
        const total = utxos.length;
        const utxosSlice: Array<UTxO> = utxos.slice((page - 1) * limit, page * limit);

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
            return "Invalid wallet address provided";
        }

        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        await hydraProvider.connect();
        const status = await hydraProvider.get("head");

        return (status.tag as string).toUpperCase();
    } catch (error) {
        return "Idle";
    }
};

export const getBalanceTip = async function ({ walletAddress }: { walletAddress: string }) {
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

export const getBalanceCommit = async function ({ walletAddress }: { walletAddress: string }) {
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

        const utxosSlice: Array<UTxO> = utxos.filter(async function (utxo) {
            return utxo.output.plutusData === "";
        });

        const balance = utxosSlice.reduce((total: number, utxo: UTxO) => {
            const amounts = Array.isArray(utxo?.output?.amount) ? utxo.output.amount : [];
            const lovelaceAsset = amounts.find((asset) => asset.unit === "lovelace");
            const amount = Number(lovelaceAsset?.quantity || 0);
            return total + amount;
        }, 0);

        return balance;
    } catch (_) {
        return 0;
    }
};
