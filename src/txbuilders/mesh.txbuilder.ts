import { deserializeAddress, ForgeScript, mConStr0, resolveScriptHash, stringToHex, UTxO } from "@meshsdk/core";
import { MeshAdapter } from "~/adapter/mesh.adapter";
import { APP_NETWORK } from "~/constants/enviroments";

export class MeshTxBuilder extends MeshAdapter {
    /**
     *
     * @param param { assetName: string, metadata: Record<string, string>}
     * @returns unsignedTx
     */
    signup = async ({ assetName, metadata }: { assetName: string; metadata: Record<string, string | number> }): Promise<string> => {
        const { utxos, collateral, walletAddress } = await this.getWalletForTx();

        const forgingScript = ForgeScript.withOneSignature(walletAddress);
        const policyId = resolveScriptHash(forgingScript);
        const utxo = await this.getAddressUTXOAsset(this.spendAddress, policyId + stringToHex(assetName));

        const unsignedTx = this.meshTxBuilder;

        if (!utxo) {
            unsignedTx
                .mint("1", policyId, stringToHex(assetName))
                .mintingScript(forgingScript)

                .txOut(this.spendAddress, [{ unit: policyId + stringToHex(assetName), quantity: "1" }])
                .txOutInlineDatumValue(mConStr0([JSON.stringify(metadata)]));
        } else {
            unsignedTx
                .spendingPlutusScriptV3()
                .txIn(utxo.input.txHash, utxo.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr0([]))
                .txInScript(this.spendScriptCbor)
                .txOut(this.spendAddress, [
                    {
                        unit: policyId + stringToHex(assetName),
                        quantity: "1",
                    },
                ])
                .txOutInlineDatumValue(mConStr0([JSON.stringify(metadata)]));
        }

        unsignedTx
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };

    /**
     *
     * @param param { assetName: string }
     * @returns unsignedTx
     */
    signout = async ({ assetName }: { assetName: string }): Promise<string> => {
        const { utxos, collateral, walletAddress } = await this.getWalletForTx();
        const forgingScript = ForgeScript.withOneSignature(walletAddress);
        const policyId = resolveScriptHash(forgingScript);
        const utxo = await this.getAddressUTXOAsset(this.spendAddress, policyId + stringToHex(assetName));
        const unsignedTx = this.meshTxBuilder;
        if (!utxo) {
            throw new Error("UTxO not found.");
        } else {
            unsignedTx
                .spendingPlutusScriptV3()
                .txIn(utxo.input.txHash, utxo.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr0([]))
                .txInScript(this.spendScriptCbor)
                .mint("-1", policyId, stringToHex(assetName))
                .mintingScript(forgingScript);
        }

        unsignedTx
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };

    /**
     * @returns unsignedTx
     */
    remove = async (): Promise<string> => {
        const { utxos, collateral, walletAddress } = await this.getWalletForTx();

        const utxosAssets: Array<UTxO> = await this.fetcher.fetchAddressUTxOs(this.spendAddress);

        const unsignedTx = this.meshTxBuilder;

        utxosAssets.forEach((utxo) => {
            unsignedTx
                .spendingPlutusScriptV3()
                .txIn(utxo.input.txHash, utxo.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr0([]))
                .txInScript(this.spendScriptCbor)
                .txOut(walletAddress, utxo.output.amount);
        });

        unsignedTx
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };
}
