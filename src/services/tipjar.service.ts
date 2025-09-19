"use server";

import { stringToHex, UTxO } from "@meshsdk/core";
import cbor from "cbor";
import { SPEND_ADDRESS } from "~/constants/enviroments";
import { blockfrostFetcher, blockfrostProvider } from "~/providers/cardano";
import { Transaction } from "~/types";
import { parseError } from "~/utils/error/parse-error";

/**
 * Fetches proposals from the contract address (SPEND_ADDRESS) with pagination.
 *
 * Workflow:
 * 1. Fetch all UTxOs at the contract address.
 * 2. Apply pagination (page, limit).
 * 3. Decode `plutusData` (CBOR -> UTF-8 -> JSON).
 * 4. If `walletAddress` is provided → exclude proposals belonging to that address.
 * 5. Return the parsed proposals along with pagination info.
 *
 * @param {Object} params
 * @param {number} [params.page=1] - Current page (default = 1).
 * @param {number} [params.limit=12] - Number of items per page (default = 12).
 * @param {string} [params.walletAddress] - Wallet address to exclude proposals from.
 *
 * @returns {Promise<{
 *   data: any[];             // Parsed proposals
 *   totalItem: number;       // Total number of UTxOs found
 *   totalPages: number;      // Total pages
 *   currentPage: number;     // Current page
 *   message?: string;        // Error message if any
 * }>}
 */
export async function getProposals({ page = 1, limit = 12, walletAddress }: { page?: number; limit?: number; walletAddress?: string }) {
    try {
        const utxos = await blockfrostProvider.fetchAddressUTxOs(SPEND_ADDRESS);
        const total = utxos.length;

        const utxosSlice: Array<UTxO> = utxos.slice((page - 1) * limit, page * limit);

        const data = await Promise.all(
            utxosSlice.map(async (utxo) => {
                if (!utxo.output.plutusData) return null;

                try {
                    const buffer = Buffer.from(utxo.output.plutusData, "hex");
                    const decoded = await cbor.decodeFirst(buffer);
                    const datum = decoded.value[0].toString("utf-8");
                    const parsed = JSON.parse(datum);

                    if (!walletAddress || parsed.walletAddress !== walletAddress) {
                        return {
                            ...parsed,
                            txHash: utxo.input.txHash,
                            outputIndex: utxo.input.outputIndex,
                        };
                    }
                } catch (error) {
                    console.error("Decode/parse error:", error);
                    return null;
                }
            }),
        );

        const filtered = data.filter(Boolean);

        return {
            data: filtered,
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

/**
 * Fetches a single proposal for the given wallet address.
 *
 * Workflow:
 * 1. Validate the wallet address input.
 * 2. Fetch all UTxOs at the contract address (SPEND_ADDRESS).
 * 3. Iterate through UTxOs and decode `plutusData` (CBOR -> UTF-8 -> JSON).
 * 4. Check if the decoded datum matches the given `walletAddress`.
 * 5. Return the proposal data if found; otherwise return a "not found" message.
 *
 * @param {Object} params
 * @param {string} params.walletAddress - The wallet address of the proposal creator.
 *
 * @returns {Promise<{
 *   data: any | null;        // The parsed proposal data, or null if not found
 *   message: string;         // Status or error message
 * }>}
 */
export async function getProposal({ walletAddress }: { walletAddress: string }) {
    try {
        if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim() === "") {
            return {
                data: null,
                message: "Invalid wallet address provided",
            };
        }

        const utxos = await blockfrostProvider.fetchAddressUTxOs(SPEND_ADDRESS);

        for (const utxo of utxos) {
            if (!utxo.output.plutusData) continue;

            try {
                const buffer = Buffer.from(utxo.output.plutusData, "hex");
                const decoded = await cbor.decodeFirst(buffer);
                const datum = decoded.value[0].toString("utf-8");
                const parsedDatum = JSON.parse(datum);

                if (parsedDatum.walletAddress === walletAddress) {
                    return {
                        data: {
                            ...parsedDatum,
                            txHash: utxo.input.txHash,
                            outputIndex: utxo.input.outputIndex,
                        },
                        message: "Successfully retrieved proposal data",
                    };
                }
            } catch (decodeError) {
                console.error(`Error decoding UTxO:`, decodeError);
                continue;
            }
        }

        return {
            data: null,
            message: "No matching proposal found",
        };
    } catch (error) {
        return {
            data: null,
            message: `Error fetching proposal data: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}

/**
 * Fetches withdraw transactions for a given wallet address with pagination.
 *
 * Workflow:
 * 1. Validate the wallet address input.
 * 2. Fetch all transactions for the given address.
 * 3. For each transaction:
 *    - Fetch its UTxO details.
 *    - Check if any input contains the "HydraHeadV1" asset.
 *    - If yes, find the output for the wallet address and extract its lovelace amount.
 * 4. Build a withdraw object containing transaction details.
 * 5. Apply pagination and return results.
 *
 * @param {Object} params
 * @param {string} params.walletAddress - The wallet address to fetch withdraws for.
 * @param {number} [params.page=1] - Current page (default = 1).
 * @param {number} [params.limit=6] - Number of items per page (default = 6).
 *
 * @returns {Promise<{
 *   data: Array<{
 *     type: string;
 *     status: string;
 *     datetime: number;
 *     txHash: string;
 *     address: string;
 *     amount: string | null;
 *   }> | null;
 *   totalItem?: number;
 *   totalPages?: number;
 *   currentPage?: number;
 *   message?: string;
 * }>}
 */
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
