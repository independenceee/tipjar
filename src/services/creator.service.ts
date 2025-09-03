"use server";

import { UTxO } from "@meshsdk/core";
import cbor from "cbor";
import { SPEND_ADDRESS } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { parseError } from "~/utils/error/parse-error";

export async function getCreaters({ query = "", page = 1, limit = 12 }: { query?: string; page?: number; limit?: number }) {
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

                        return parsed;
                    } catch (error) {
                        throw new Error(String(error));
                    }
                }
            }),
        );

        return {
            data: data,
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
