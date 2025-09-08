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
                    quantity: String(amount),
                },
            ])
            .changeAddress(await this.meshWallet.getChangeAddress())
            .selectUtxosFrom(utxos)
            .setFee(String(0))
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };
}
