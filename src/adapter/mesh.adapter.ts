import { IFetcher, MeshTxBuilder, MeshWallet } from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";

export class MeshAdapter {
  protected fetcher: IFetcher;
  protected meshWallet: MeshWallet;
  protected meshTxBuilder: MeshTxBuilder;
  protected hydraInstance: HydraInstance;
  protected hydraProvider: HydraProvider;

  constructor({ meshWallet = null! }: { meshWallet: MeshWallet }) {
    this.meshWallet = meshWallet;
    
  }
}
