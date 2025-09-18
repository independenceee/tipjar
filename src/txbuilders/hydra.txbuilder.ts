import { mConStr0 } from "@meshsdk/core";
import { HydraAdapter } from "~/adapter/hydra.adapter";
import { DECIMAL_PLACE } from "~/constants/common";
import { APP_NETWORK } from "~/constants/enviroments";

export class HydraTxBuilder extends HydraAdapter {
    /**
     * @description Lovelace transfer from one address to another.
     *
     * @param walletAddress
     * @param quantity
     * @returns unsignedTx
     */
    send = async ({ tipAddress, amount = DECIMAL_PLACE }: { tipAddress: string; amount: number }) => {
        await this.hydraProvider.connect();
        const utxos = await this.hydraProvider.fetchAddressUTxOs(await this.meshWallet.getChangeAddress());
        const utxo = this.getUTxOOnlyLovelace(utxos, amount);

        const unsignedTx = this.meshTxBuilder
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .txOut(tipAddress, [
                {
                    unit: "lovelace",
                    quantity: String(amount * DECIMAL_PLACE),
                },
            ])
            .txOutInlineDatumValue(
                mConStr0([
                    JSON.stringify({
                        walletAddress: await this.meshWallet.getChangeAddress(),
                        datetime: Date.now().toString(),
                    }),
                ]),
            )
            .changeAddress(await this.meshWallet.getChangeAddress())
            .selectUtxosFrom(utxos)
            .setFee(String(0))
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };

    /**
     * @description Merge UTxOs into one to be able to decommit
     * @returns unsignedTx
     */
    public merge = async () => {
        await this.hydraProvider.connect();
        const utxos = await this.hydraProvider.fetchUTxOs(await this.meshWallet.getChangeAddress());
        const unsignedTx = this.meshTxBuilder;
        const total = utxos.reduce((acc, utxo) => {
            unsignedTx.txIn(utxo.input.txHash, utxo.input.outputIndex);
            const lovelace = utxo.output.amount.find((amount) => amount.unit === "lovelace");
            return acc + (lovelace ? Number(lovelace.quantity) : 0);
        }, 0);
        unsignedTx
            .txOut(await this.meshWallet.getChangeAddress(), [
                {
                    unit: "lovelace",
                    quantity: String(total),
                },
            ])
            .changeAddress(await this.meshWallet.getChangeAddress())
            .selectUtxosFrom(utxos)
            .setFee(String(0))
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };
}
