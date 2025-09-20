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

/**
 * @description
 * MeshAdapter class provides a wrapper around Mesh SDK for:
 * - Managing Plutus scripts (mint & spend)
 * - Resolving policy IDs and script addresses
 * - Handling wallet UTxOs and collaterals
 * - Preparing data for transaction building
 */
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

    /**
     * @description
     * Construct a MeshAdapter instance.
     * This sets up:
     * - Plutus scripts (mint & spend)
     * - Script addresses
     * - Policy ID resolution
     *
     * @param {MeshWallet} meshWallet - Active Mesh wallet instance to connect.
     */
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

    /**
     * @description
     * Retrieve wallet essentials for building a transaction:
     * - Available UTxOs
     * - A valid collateral UTxO (>= 5 ADA in lovelace)
     * - Wallet's change address
     *
     * Flow:
     * 1. Get all wallet UTxOs.
     * 2. Ensure collateral exists (create one if missing).
     * 3. Get wallet change address.
     *
     * @returns {Promise<{ utxos: UTxO[]; collateral: UTxO; walletAddress: string }>}
     *          Object containing wallet UTxOs, a collateral UTxO, and change address.
     *
     * @throws {Error}
     *         If UTxOs or wallet address cannot be retrieved.
     */
    protected getWalletForTx = async (): Promise<{
        utxos: UTxO[];
        collateral: UTxO;
        walletAddress: string;
    }> => {
        const utxos = await this.meshWallet.getUtxos();
        const collaterals =
            (await this.meshWallet.getCollateral()).length === 0 ? [await this.getCollateral()] : await this.meshWallet.getCollateral();
        const walletAddress = await this.meshWallet.getChangeAddress();
        if (!utxos || utxos.length === 0) throw new Error("No UTXOs found in getWalletForTx method.");

        if (!collaterals || collaterals.length === 0) this.meshWallet.createCollateral();

        if (!walletAddress) throw new Error("No wallet address found in getWalletForTx method.");

        return { utxos, collateral: collaterals[0], walletAddress };
    };

    /**
     * @description
     * Read a specific Plutus validator from a compiled Plutus JSON object.
     *
     * @param {Plutus} plutus - The Plutus JSON file (compiled).
     * @param {string} title - The validator title to search for.
     *
     * @returns {string}
     *          Compiled Plutus script code as a hex string.
     *
     * @throws {Error}
     *         If validator with given title is not found.
     *
     */
    protected readValidator = function (plutus: Plutus, title: string): string {
        const validator = plutus.validators.find(function (validator) {
            return validator.title === title;
        });

        if (!validator) {
            throw new Error(`${title} validator not found.`);
        }

        return validator.compiledCode;
    };

    /**
     * @description
     * Fetch the last UTxO at a given address containing a specific asset.
     *
     * @param {string} address - Address to query.
     * @param {string} unit - Asset unit (policyId + hex-encoded name or "lovelace").
     *
     * @returns {Promise<UTxO>}
     *          The last matching UTxO for the specified asset.
     */
    protected getAddressUTXOAsset = async (address: string, unit: string) => {
        const utxos = await this.fetcher.fetchAddressUTxOs(address, unit);
        return utxos[utxos.length - 1];
    };

    /**
     * @description
     * Fetch all UTxOs at a given address containing a specific asset.
     *
     * @param {string} address - Address to query.
     * @param {string} unit - Asset unit (policyId + hex-encoded name or "lovelace").
     *
     * @returns {Promise<UTxO[]>}
     *          List of UTxOs with the specified asset.
     */
    protected getAddressUTXOAssets = async (address: string, unit: string) => {
        return await this.fetcher.fetchAddressUTxOs(address, unit);
    };

    /**
     * @description
     * Select a UTxO from wallet to serve as collateral for Plutus script transactions.
     *
     * Rules:
     * - Must contain only Lovelace.
     * - Must have quantity >= 5 ADA (5,000,000 lovelace).
     *
     * @returns {Promise<UTxO>}
     *          A UTxO that can be used as collateral.
     */
    protected getCollateral = async (): Promise<UTxO> => {
        const utxos = await this.meshWallet.getUtxos();
        return utxos.filter((utxo) => {
            const amount = utxo.output.amount;
            return (
                Array.isArray(amount) &&
                amount.length === 1 &&
                amount[0].unit === "lovelace" &&
                typeof amount[0].quantity === "string" &&
                Number(amount[0].quantity) >= 5_000_000
            );
        })[0];
    };
}
