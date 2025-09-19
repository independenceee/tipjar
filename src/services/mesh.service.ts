"use server";

import { MeshWallet } from "@meshsdk/core";
import { isNil } from "lodash";
import { DECIMAL_PLACE } from "~/constants/common";
import { APP_NETWORK_ID } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { parseError } from "~/utils/error/parse-error";

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

/**
 * Retrieve a list of UTxOs containing only ADA (lovelace) from a given wallet address.
 *
 * @param {Object} params - Input parameters.
 * @param {string} params.walletAddress - The wallet address to query UTxOs from.
 * @param {number} [params.quantity=DECIMAL_PLACE] - The minimum required lovelace amount to filter UTxOs.
 *
 * @returns {Promise<Array<{ txHash: string; outputIndex: number; amount: number }>>}
 * - A list of UTxOs that match the criteria. Each UTxO includes:
 *   - `txHash`: The transaction hash where the UTxO originates.
 *   - `outputIndex`: The index of the output in the transaction.
 *   - `amount`: The amount of lovelace contained in the UTxO.
 *
 * @throws {Error} Throws an error if `walletAddress` is missing or if fetching UTxOs from the provider fails.
 */
export const getUTxOOnlyLovelace = async function ({
    walletAddress,
    quantity = DECIMAL_PLACE,
}: {
    walletAddress: string;
    quantity?: number;
}): Promise<
    {
        txHash: string;
        outputIndex: number;
        amount: number;
    }[]
> {
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

        const utxos = await meshWallet.getUtxos();

        return utxos
            .filter((utxo) => {
                const amount = utxo.output?.amount;
                if (!Array.isArray(amount) || amount.length !== 1) return false;
                const { unit, quantity: qty } = amount[0];
                const quantityNum = Number(qty);
                return unit === "lovelace" && typeof qty === "string" && !isNaN(quantityNum) && quantityNum >= quantity;
            })
            .map(function (utxo) {
                return {
                    txHash: utxo.input.txHash,
                    outputIndex: utxo.input.outputIndex,
                    amount: Number(utxo.output.amount[0].quantity),
                };
            });
    } catch (error) {
        throw Error(String(error));
    }
};
