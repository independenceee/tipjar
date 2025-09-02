import { HydraAdapter } from "~/adapter/hydra.adapter";
import { getLovelaceOnlyUTxO } from "~/utils";

export class HydraTxbuilder extends HydraAdapter {
    /**
     * Initializing Head creation and UTxO commitment phase.
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
     *
     * @returns unsignedTx
     */
    commit = async (): Promise<string> => {
        await this.hydraProvider.connect();
        const utxos = await this.meshWallet.getUtxos();
        const utxoOnlyLovelace = getLovelaceOnlyUTxO(utxos);
        return await this.hydraInstance.commitFunds(utxoOnlyLovelace.input.txHash, utxoOnlyLovelace.input.outputIndex);
    };
}
