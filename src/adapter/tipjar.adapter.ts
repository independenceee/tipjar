import { IFetcher, MeshTxBuilder, MeshWallet, UTxO } from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";
import { HYDRA_HTTP_URL } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";

export class TipjarAdapter {
    protected fetcher: IFetcher;
    protected meshWallet: MeshWallet;
    protected meshTxBuilder!: MeshTxBuilder;
    protected hydraInstance!: HydraInstance;
    protected hydraProvider: HydraProvider;

    constructor({ meshWallet = null! }: { meshWallet: MeshWallet }) {
        this.meshWallet = meshWallet;
        this.fetcher = blockfrostProvider;

        this.hydraProvider = new HydraProvider({
            httpUrl: HYDRA_HTTP_URL,
        });

        this.hydraInstance = new HydraInstance({
            submitter: blockfrostProvider,
            provider: this.hydraProvider,
            fetcher: this.fetcher,
        });

        this.initialize();
    }

    protected initialize = async () => {
        const protocolParams = await this.hydraProvider.fetchProtocolParameters();
        this.meshTxBuilder = new MeshTxBuilder({
            fetcher: this.fetcher,
            submitter: this.hydraProvider !== null ? this.hydraProvider : blockfrostProvider,
            params: protocolParams,
            isHydra: !!this.hydraProvider,
        });
    };

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
}
