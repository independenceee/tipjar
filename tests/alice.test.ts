import { BlockfrostProvider, MeshTxBuilder, MeshWallet } from "@meshsdk/core";
import { HydraProvider, HydraInstance } from "@meshsdk/hydra";
import { getLovelaceOnlyUTxOs } from "~/utils";
// process.exit(0);
describe("Alice Tipjar Cardano", function () {
  let meshWallet: MeshWallet;
  let meshTxBuilder: MeshTxBuilder;
  let hydraProvider: HydraProvider;
  let hydraInstance: HydraInstance;
  let blockfrostProvider: BlockfrostProvider;

  beforeEach(async function () {
    hydraProvider = new HydraProvider({
      httpUrl: "http://194.195.87.66:4001",
      // history: true,
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
        words: process.env.ALICE_APP_MNEMONIC?.split(" ") || [],
      },
    });

    const protocolParameters = await hydraProvider.fetchProtocolParameters();

    meshTxBuilder = new MeshTxBuilder({
      fetcher: hydraProvider,
      submitter: hydraProvider,
      isHydra: true,
      params: protocolParameters,
      verbose: true,
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
    await hydraProvider.subscribeSnapshotUtxo();
    await new Promise<void>((resolve, reject) => {
      hydraProvider.onStatusChange((status) => {
        try {
          console.log("Status changed:", status);
          if (status === "CLOSED") {
            resolve();
          }
        } catch (error) {
          reject("Error: " + error);
        }
      });

      hydraProvider.close().catch((err: Error) => reject(err));
    });
  });

  it("Wait for FANOUT_POSSIBLE status after initiating fanout", async function () {
    return;
    await hydraProvider.connect();
    await hydraProvider.contest();
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
    // const commitUnsignedTx = await hydraInstance.incrementalCommitFunds(utxosOnlyLovelace.input.txHash, utxosOnlyLovelace.input.outputIndex);

    const commitUnsignedTx = await hydraInstance.commitFunds(utxosOnlyLovelace.input.txHash, utxosOnlyLovelace.input.outputIndex);
    const commitSignedTx = await meshWallet.signTx(commitUnsignedTx, true);
    const commitTxHash = await meshWallet.submitTx(commitSignedTx);
    console.log("https://preview.cexplorer.io/tx/" + commitTxHash);

    // await new Promise<void>((resolve, reject) => {
    //   hydraProvider
    //     .subscribeSnapshotUtxo()
    //     .then((snapshotUtxos) => {
    //       console.log("Snapshot UTxOs:", snapshotUtxos);
    //     })
    //     .catch((err: Error) => reject(err));
    //   hydraProvider.onStatusChange((status) => {
    //     console.log(`Hydra status changed: ${status}`);
    //     if (status === "OPEN") {
    //       resolve();
    //     }
    //   });
    // });
  });

  it("Read UTxO from hydra snapshot", async function () {
    // return;
    await hydraProvider.connect();
    const utxos = await hydraProvider.fetchUTxOs();
    console.log(utxos);
  });

  it("Read UTxO ", async function () {
    return;
    await hydraProvider.connect();
    await hydraProvider.init();
    const utxos = await hydraProvider.fetchAddressUTxOs(await meshWallet.getChangeAddress());

    const address = await meshWallet.getChangeAddress();
    console.log(utxos);
    console.log(address);

    const unsignedTx = await meshTxBuilder
      .txIn(utxos[0].input.txHash, utxos[0].input.outputIndex)
      .txOut("addr_test1qzk0hl57jzwu2p0kpuqs48q2f7vty8efhcwh4l8wynckp4se2hwvvldt8r4c3cr7dcszlt2f7xs5ef2hydn25pugcgvs4843vd", [
        { unit: "lovelace", quantity: "10000000" },
      ])

      .txOut(await meshWallet.getChangeAddress(), [{ unit: "lovelace", quantity: "9990000000" }])

      .changeAddress(await meshWallet.getChangeAddress())
      .selectUtxosFrom(utxos)
      .setNetwork("preview")
      .complete();

    console.log(unsignedTx);

    const signedTx = await meshWallet.signTx(unsignedTx, true);
    const txHash = await hydraProvider.submitTx(signedTx);
    const utxosSnapshot = await hydraProvider.subscribeSnapshotUtxo();
    console.log("================================" + utxosSnapshot);
  });
});
