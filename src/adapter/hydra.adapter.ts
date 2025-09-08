import { IFetcher, MeshTxBuilder, MeshWallet, UTxO } from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";
import { DECIMAL_PLACE } from "~/constants/common";
import { blockfrostProvider } from "~/providers/cardano";

export class HydraAdapter {
    protected fetcher: IFetcher;
    protected meshWallet: MeshWallet;
    protected meshTxBuilder!: MeshTxBuilder;
    protected hydraInstance!: HydraInstance;
    protected hydraProvider: HydraProvider;

    constructor({ meshWallet = null!, hydraProvider = null! }: { meshWallet: MeshWallet; hydraProvider: HydraProvider }) {
        this.meshWallet = meshWallet;
        this.fetcher = blockfrostProvider;
        this.hydraProvider = hydraProvider;
        this.hydraInstance = new HydraInstance({
            submitter: blockfrostProvider,
            provider: this.hydraProvider,
            fetcher: blockfrostProvider,
        });

        this.initialized();
    }

    protected initialized = async () => {
        const protocolParameters = await this.hydraProvider.fetchProtocolParameters();
        this.meshTxBuilder = new MeshTxBuilder({
            params: protocolParameters,
            fetcher: this.hydraProvider,
            submitter: this.hydraProvider,
            isHydra: true,
        });
    };

    protected getLovelaceOnlyUTxO = (utxos: UTxO[], quantity = DECIMAL_PLACE) => {
        return utxos.filter((utxo) => {
            const amount = utxo.output.amount;
            return (
                Array.isArray(amount) &&
                amount.length === 1 &&
                amount[0].unit === "lovelace" &&
                typeof amount[0].quantity === "string" &&
                Number(amount[0].quantity) >= quantity
            );
        })[0];
    };
}
