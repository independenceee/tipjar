import { BlockfrostProvider, MeshTxBuilder, MeshWallet } from "@meshsdk/core";
import { HydraProvider, HydraInstance } from "@meshsdk/hydra";
import { getLovelaceOnlyUTxOs } from "~/utils";
// process.exit(0);
describe("Bob Tipjar Cardano", function () {
  let meshWallet: MeshWallet;
  let meshTxBuilder: MeshTxBuilder;
  let hydraProvider: HydraProvider;
  let hydraInstance: HydraInstance;
  let blockfrostProvider: BlockfrostProvider;

  beforeEach(function () {
    hydraProvider = new HydraProvider({
      httpUrl: "http://194.195.87.66:4002",
    });
    blockfrostProvider = new BlockfrostProvider("previewkiE6gOIulzmz9HIxyrTW2axrxWj4wMHt");

    hydraInstance = new HydraInstance({
      provider: hydraProvider,
      fetcher: blockfrostProvider,
      submitter: blockfrostProvider,
    });

    meshWallet = new MeshWallet({
      networkId: 0,
      fetcher: blockfrostProvider,
      submitter: blockfrostProvider,
      key: {
        type: "mnemonic",
        words: process.env.BOB_APP_MNEMONIC?.split(" ") || [],
      },
    });
  });

  jest.setTimeout(600000000);

  it("Should initialize Hydra Head and reach INITIALIZING status", async function () {
    return;
    await hydraProvider.connect();

    await new Promise<void>((resolve, reject) => {
      hydraProvider.onStatusChange((status) => {
        try {
          console.log("Status changed:", status);
          if (status === "INITIALIZING") {
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      });

      hydraProvider.init().catch((err: Error) => reject(err));
    });
  });

  it("Wait for Close status after initiating fanout", async function () {
    return;
    await hydraProvider.connect();

    await new Promise<void>((resolve, reject) => {
      hydraProvider.onStatusChange((status) => {
        try {
          console.log("Status changed:", status);
          if (status === "CLOSED") {
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      });

      hydraProvider.close().catch((err: Error) => reject(err));
    });
  });

  it("Wait for FANOUT_POSSIBLE status after initiating fanout", async function () {
    return;
    await hydraProvider.connect();

    await new Promise<void>((resolve, reject) => {
      hydraProvider.onStatusChange((status) => {
        try {
          console.log("Status changed:", status);
          if (status === "FANOUT_POSSIBLE") {
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      });

      hydraProvider.fanout().catch((err: Error) => reject(err));
    });
  });

  it("Should successfully commit fund to Hydra", async function () {
    return;
    await hydraProvider.connect();
    const utxos = await meshWallet.getUtxos();
    const utxosOnlyLovelace = getLovelaceOnlyUTxOs(utxos);
    const commitUnsignedTx = await hydraInstance.commitFunds(utxosOnlyLovelace.input.txHash, utxosOnlyLovelace.input.outputIndex);
    const commitSignedTx = await meshWallet.signTx(commitUnsignedTx, true);
    const commitTxHash = await meshWallet.submitTx(commitSignedTx);
    console.log("https://preview.cexplorer.io/tx/" + commitTxHash);
  });
});
