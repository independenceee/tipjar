import { IFetcher, MeshTxBuilder, MeshWallet, UTxO } from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";
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
            isHydra: !!this.hydraProvider,
        });
    };

   
}
