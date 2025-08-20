import { IFetcher, MeshTxBuilder, MeshWallet } from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";
import { HYDRA_URL } from "~/constants/enviroments";
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
      httpUrl: HYDRA_URL,
    });

    this.hydraInstance = new HydraInstance({
      submitter: blockfrostProvider,
      provider: this.hydraProvider,
      fetcher: this.fetcher,
    });

    this.initialize();
  }

  async initialize() {
    const protocolParams = await this.hydraProvider.fetchProtocolParameters();
    this.meshTxBuilder = new MeshTxBuilder({
      fetcher: this.fetcher,
      submitter: this.hydraProvider !== null ? this.hydraProvider : blockfrostProvider,
      params: protocolParams,
      isHydra: !!this.hydraProvider,
    });
  }
}
