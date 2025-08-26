import { BlockfrostProvider, MeshTxBuilder, MeshWallet, UTxO, value } from "@meshsdk/core";
import { HydraProvider, HydraInstance } from "@meshsdk/hydra";
import { BLOCKFROST_API_KEY } from "~/constants/enviroments";
import { getLovelaceOnlyUTxOs } from "~/utils";

describe("Hydra Tipjar Cardano", function () {
  let meshWallet: MeshWallet;
  let meshTxBuilder: MeshTxBuilder;
  let hydraProvider: HydraProvider;
  let hydraInstance: HydraInstance;
  let blockfrostProvider: BlockfrostProvider;

  beforeEach(async function () {
    hydraProvider = new HydraProvider({
      httpUrl: "http://194.195.87.66:4001",
      wsUrl: "ws://194.195.87.66:4001",
    });
    blockfrostProvider = new BlockfrostProvider(BLOCKFROST_API_KEY);

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
        words: process.env.APP_MNEMONIC?.split(" ") || [],
      },
    });
    const protocolParameters = await hydraProvider.fetchProtocolParameters();

    meshTxBuilder = new MeshTxBuilder({
      fetcher: hydraProvider,
      submitter: hydraProvider,
      isHydra: true,
      params: protocolParameters,
    });

    await hydraProvider.connect();
  });

  jest.setTimeout(60_000_000);

  it("Check and initialize Hydra Head", async function () {
    return;
    await hydraProvider.connect();
    await hydraProvider.fanout();
  });

  describe("Commit funds to Hydra", function () {
    it("Should successfully commit fund to Hydra", async function () {
      return;

      const utxos = await meshWallet.getUtxos();

      const utxosOnlyLovelace = getLovelaceOnlyUTxOs(utxos);
      console.log(utxosOnlyLovelace);

      const commitUnsignedTx = await hydraInstance.commitFunds(utxosOnlyLovelace.input.txHash, utxosOnlyLovelace.input.outputIndex);
      const commitSignedTx = await meshWallet.signTx(commitUnsignedTx, true);
      const commitTxHash = await meshWallet.submitTx(commitSignedTx);

      // await hydraProvider.buildCommit()
      console.log("https://preview.cexplorer.io/tx/" + commitTxHash);
    });
  });

  describe("Should read utxos successfully", function () {
    it("Read UTxO ", async function () {
      return;
      const utxos = await hydraProvider.fetchAddressUTxOs(await meshWallet.getChangeAddress());

      console.log(utxos);

      const unsignedTx = await meshTxBuilder
        .txOut("addr_test1qz45qtdupp8g30lzzr684m8mc278s284cjvawna5ypwkvq7s8xszw9mgmwpxdyakl7dgpfmzywctzlsaghnqrl494wnqhgsy3g", [
          { unit: "lovelace", quantity: "3000000" },
        ])
        .changeAddress(await meshWallet.getChangeAddress())
        .selectUtxosFrom(utxos)
        .setNetwork("preview")
        .complete();

      const signedTx = await meshWallet.signTx(unsignedTx);
      await hydraProvider.submitTx(signedTx);
    });
  });

  describe("", function () {});
});
