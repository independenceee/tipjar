import { BlockfrostProvider, MeshTxBuilder, MeshWallet } from "@meshsdk/core";
import { HydraProvider, HydraInstance } from "@meshsdk/hydra";
// process.exit(0);
describe("Hydra Tipjar Cardano", function () {
  let meshWallet: MeshWallet;
  let meshTxBuilder: MeshTxBuilder;
  let hydraProvider: HydraProvider;
  let hydraInstance: HydraInstance;
  let blockfrostProvider: BlockfrostProvider;

  beforeEach(function () {
    hydraProvider = new HydraProvider({
      httpUrl: "http://194.195.87.66:4001",
      wsUrl: "ws://194.195.87.66:4001",
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
        words: process.env.APP_MNEMONIC?.split(" ") || [],
      },
    });
  });

  jest.setTimeout(600000000);

  it("should make and submit a valid tx", async () => {
    await hydraProvider.connect();

    await hydraProvider.init();
    const utxosAlice = (await meshWallet.getUtxos())[12];
    console.log(await meshWallet.getChangeAddress());

    const protocolParameters = await hydraProvider.fetchProtocolParameters();

    const utxos = await hydraProvider.fetchUTxOs();
    console.log("UTxO", utxos);

    const commitTx = await hydraInstance.commitFunds("008a70e126e107cca6f272d78bfb40ce9f78ae7bb1b6d6dc4c382c0f9c5b72e9", 0);

    console.log("tx", commitTx);
    const signedTx = await meshWallet.signTx(commitTx, true);
    console.log(signedTx);
    const commitTxHash = await meshWallet.submitTx(signedTx);
    console.log("txHash: ", commitTxHash);
  });
});
