import { HydraAdapter } from "~/adapter/hydra.adapter";
import { APP_NETWORK } from "~/constants/enviroments";

export class TipjarService extends HydraAdapter {
    /**
     *
     * @param param0
     */
    commit = async ({}) => {
        const { utxos, collateral, walletAddress } = await this.getWalletForTx();
        const unsignedTx = await this.meshTxBuilder
            .txIn("", 1)
            .txOut("", [
                {
                    unit: "lovelace",
                    quantity: "10000000",
                },
            ])
            .setFee("0")
            .changeAddress("")
            .selectUtxosFrom(utxos)
            .setNetwork(APP_NETWORK)
            .complete();

        const tx = await this.hydraInstance.commitBlueprint("", 1, {
            cborHex: unsignedTx,
            description: "a new blueprint transaction",
            type: "Tx ConwayEra",
        });

        return tx;
    };

    /**
     *
     * @param param0
     */
    tip = async ({ walletAddress, amount }: { walletAddress: string; amount: string }) => {
        await this.hydraProvider.connect();
        const utxos = await this.hydraProvider.fetchUTxOs();

        const tipperUtxo = await this.hydraProvider.fetchAddressUTxOs(walletAddress);

        const unsignedTx = await this.meshTxBuilder
            .txOut("", [
                {
                    unit: "lovelace",
                    quantity: "1500000",
                },
            ])
            .changeAddress(walletAddress)
            .selectUtxosFrom(tipperUtxo)
            .setNetwork(APP_NETWORK)
            .complete();

        const signedTx = await this.meshWallet.signTx(unsignedTx, true);
        await this.hydraProvider.submitTx(signedTx);
    };
}
