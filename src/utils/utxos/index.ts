import { UTxO } from "@meshsdk/core";

/**
 * Returns the first UTxO containing only Lovelace with quantity > 1,000,000,000.
 * @param utxos - Array of UTxO objects
 * @returns - A single UTxO or undefined if no UTxO meets the criteria
 * @throws - Error if no qualifying UTxO is found
 */
export function getLovelaceOnlyUTxO(utxos: UTxO[]): UTxO {
    return utxos.filter((utxo) => {
        const amount = utxo.output.amount;
        return (
            Array.isArray(amount) &&
            amount.length === 1 &&
            amount[0].unit === "lovelace" &&
            typeof amount[0].quantity === "string" &&
            Number(amount[0].quantity) >= 10_000_000
        );
    })[0];
}
