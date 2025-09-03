import { HydraAdapter } from "~/adapter/hydra.adapter";
import { DECIMAL_PLACE } from "~/constants/common";
import { APP_NETWORK } from "~/constants/enviroments";
import { getLovelaceOnlyUTxO } from "~/utils";

export class HydraTxbuilder extends HydraAdapter {
    /**
     * @description Initializing Head creation and UTxO commitment phase.
     */
    init = async () => {
        try {
            await this.hydraProvider.connect();
            await new Promise<void>((resolve, reject) => {
                this.hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "INITIALIZING") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                this.hydraProvider.init().catch((error: Error) => reject(error));
            });
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * @description Closed Head closed, starting contestation phase.
     */

    close = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "CLOSED") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.hydraProvider.close().catch((error: Error) => reject(error));
        });
    };

    /**
     *
     * @returns unsignedTx
     */
    commit = async (): Promise<string> => {
        await this.hydraProvider.connect();
        const utxos = await this.meshWallet.getUtxos();
        const utxoOnlyLovelace = getLovelaceOnlyUTxO(utxos);
        return await this.hydraInstance.commitFunds(utxoOnlyLovelace.input.txHash, utxoOnlyLovelace.input.outputIndex);
    };

    /**
     * @description Lovelace transfer from one address to another.
     *
     * @param walletAddress
     * @param quantity
     * @returns unsignedTx
     */
    tip = async (walletAddress: string, quantity = DECIMAL_PLACE) => {
        await this.hydraProvider.connect();
        const utxos = await this.hydraProvider.fetchAddressUTxOs(await this.meshWallet.getChangeAddress());

        const utxo = this.getLovelaceOnlyUTxO(utxos, quantity);

        const unsignedTx = this.meshTxBuilder
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .txOut(walletAddress, [
                {
                    unit: "lovelace",
                    quantity: String(quantity),
                },
            ])
            .changeAddress(await this.meshWallet.getChangeAddress())
            .selectUtxosFrom(utxos)
            .setFee(String(0))
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };
}
