"use server";

import { stringToHex, UTxO } from "@meshsdk/core";
import cbor from "cbor";
import { SPEND_ADDRESS } from "~/constants/enviroments";
import { blockfrostFetcher, blockfrostProvider } from "~/providers/cardano";
import { Transaction } from "~/types";
import { parseError } from "~/utils/error/parse-error";

export async function getCreaters({
    query = "",
    page = 1,
    limit = 12,
    walletAddress,
}: {
    query?: string;
    page?: number;
    limit?: number;
    walletAddress?: string;
}) {
    try {
        const utxos = await blockfrostProvider.fetchAddressUTxOs(SPEND_ADDRESS);
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
                        if (parsed.walletAddress !== walletAddress) {
                            return parsed;
                        }
                    } catch (error) {
                        throw new Error(String(error));
                    }
                }
            }),
        );

        const filteredData = data.filter((item) => item !== null && item !== undefined);

        return {
            data: filteredData,
            totalItem: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        return {
            data: [],
            message: parseError(error),
        };
    }
}

export async function getCreator({ walletAddress }: { walletAddress: string }) {
    try {
        if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim() === "") {
            return {
                data: null,
                message: "Invalid wallet address provided",
            };
        }
        const utxos = await blockfrostProvider.fetchAddressUTxOs(SPEND_ADDRESS);

        for (const utxo of utxos) {
            if (!utxo.output.plutusData) {
                continue;
            }

            try {
                const buffer = Buffer.from(utxo.output.plutusData, "hex");
                const decoded = await cbor.decodeFirst(buffer);
                const datum = decoded.value[0].toString("utf-8");
                const parsedDatum = JSON.parse(datum);

                if (parsedDatum.walletAddress === walletAddress) {
                    return {
                        data: parsedDatum,
                        message: "Successfully retrieved creator data",
                    };
                }
            } catch (decodeError) {
                console.error(`Error decoding UTXO: ${decodeError}`);
                continue;
            }
        }

        // If no matching creator is found
        return {
            data: null,
            message: "No matching creator found",
        };
    } catch (error) {
        return {
            data: null,
            message: `Error fetching creator data: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}

export const getWithdraws = async function ({ walletAddress, page = 1, limit = 6 }: { walletAddress: string; page?: number; limit?: number }) {
    try {
        if (!walletAddress || walletAddress.trim() === "") {
            throw new Error("Wallet address is not found !");
        }

        const addressTransactions: Array<{
            tx_hash: string;
            tx_index: number;
            block_height: number;
            block_time: number;
        }> = await blockfrostFetcher.fetchAddressTransactions(walletAddress);
        const data = await Promise.all(
            addressTransactions.map(async function ({ tx_hash, block_time }) {
                const transactionUTxO: Transaction = await blockfrostFetcher.fetchTransactionsUTxO(tx_hash);

                const hasHydraHeadV1 = transactionUTxO.inputs.some((input) =>
                    input.amount.some((asset) => asset.unit.endsWith(stringToHex("HydraHeadV1"))),
                );
                if (hasHydraHeadV1) {
                    const outputAddress = transactionUTxO.outputs.find((output) => output.address === walletAddress);
                    const amount = outputAddress ? outputAddress.amount.find((asset) => asset.unit === "lovelace")?.quantity || null : null;
                    return {
                        type: "Withdraw",
                        status: "Complete",
                        datetime: block_time,
                        txHash: tx_hash,
                        address: walletAddress,
                        amount: amount,
                    };
                }
            }),
        );
        const filteredData = data.filter((item) => item !== null && item !== undefined);
        const dataSlice = filteredData.slice((page - 1) * limit, page * limit);

        return {
            data: dataSlice,
            totalItem: data.length,
            totalPages: Math.ceil(data.length / limit),
            currentPage: page,
        };
    } catch (error) {
        return {
            data: null,
            message: `Error fetching creator data: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
};
