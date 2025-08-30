import {
    applyParamsToScript,
    deserializeAddress,
    IFetcher,
    MeshTxBuilder,
    MeshWallet,
    PlutusScript,
    resolveScriptHash,
    scriptAddress,
    serializeAddressObj,
    serializePlutusScript,
    UTxO,
} from "@meshsdk/core";
import { blockfrostProvider } from "~/providers/cardano";
import plutus from "../../contract/plutus.json";
import { Plutus } from "~/types";
import { title } from "~/constants/common";
import { APP_NETWORK_ID } from "~/constants/enviroments";
export class MeshAdapter {
    public policyId: string;
    public spendAddress: string;

    protected spendCompileCode: string;
    protected mintCompileCode: string;

    protected spendScriptCbor: string;
    protected mintScriptCbor: string;

    protected spendScript: PlutusScript;
    protected mintScript: PlutusScript;

    protected fetcher: IFetcher;
    protected meshWallet: MeshWallet;
    protected meshTxBuilder: MeshTxBuilder;

    constructor({ meshWallet = null! }: { meshWallet: MeshWallet }) {
        this.meshWallet = meshWallet;
        this.fetcher = blockfrostProvider;
        this.meshTxBuilder = new MeshTxBuilder({
            fetcher: this.fetcher,
            evaluator: blockfrostProvider,
        });

        this.mintCompileCode = this.readValidator(plutus as Plutus, title.mint);
        this.spendCompileCode = this.readValidator(plutus as Plutus, title.store);

        this.spendScriptCbor = applyParamsToScript(this.spendCompileCode, []);
        this.mintScriptCbor = applyParamsToScript(this.mintCompileCode, []);

        this.spendScript = {
            code: this.spendScriptCbor,
            version: "V3",
        };

        this.mintScript = {
            code: this.mintScriptCbor,
            version: "V3",
        };

        this.spendAddress = serializeAddressObj(
            scriptAddress(
                deserializeAddress(serializePlutusScript(this.spendScript, undefined, APP_NETWORK_ID, false).address).scriptHash,
                "",
                false,
            ),
            APP_NETWORK_ID,
        );

        this.policyId = resolveScriptHash(this.mintScriptCbor, "V3");
    }

    protected getWalletForTx = async (): Promise<{
        utxos: UTxO[];
        collateral: UTxO;
        walletAddress: string;
    }> => {
        const utxos = await this.meshWallet.getUtxos();
        const collaterals = await this.meshWallet.getCollateral();
        const walletAddress = await this.meshWallet.getChangeAddress();
        if (!utxos || utxos.length === 0) throw new Error("No UTXOs found in getWalletForTx method.");

        if (!collaterals || collaterals.length === 0) throw new Error("No collateral found in getWalletForTx method.");

        if (!walletAddress) throw new Error("No wallet address found in getWalletForTx method.");

        return { utxos, collateral: collaterals[0], walletAddress };
    };

    protected readValidator = function (plutus: Plutus, title: string): string {
        const validator = plutus.validators.find(function (validator) {
            return validator.title === title;
        });

        if (!validator) {
            throw new Error(`${title} validator not found.`);
        }

        return validator.compiledCode;
    };

    protected getAddressUTXOAsset = async (address: string, unit: string) => {
        const utxos = await this.fetcher.fetchAddressUTxOs(address, unit);
        return utxos[utxos.length - 1];
    };

    protected getAddressUTXOAssets = async (address: string, unit: string) => {
        return await this.fetcher.fetchAddressUTxOs(address, unit);
    };
}
