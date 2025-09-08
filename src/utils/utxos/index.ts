import { UTxO } from "@meshsdk/core";


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
