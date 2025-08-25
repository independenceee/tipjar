import { BlockfrostProvider, MeshTxBuilder, MeshWallet } from "@meshsdk/core";
import { HydraProvider, HydraInstance } from "@meshsdk/hydra";
// process.exit(0);
describe("Bob Tipjar Cardano", function () {
  let meshWallet: MeshWallet;
  let meshTxBuilder: MeshTxBuilder;
  let hydraProvider: HydraProvider;
  let hydraInstance: HydraInstance;
  let blockfrostProvider: BlockfrostProvider;

  beforeEach(function () {
    hydraProvider = new HydraProvider({
      httpUrl: "http://194.195.87.66:4001",
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

  it("should make and submit a valid tx", async () => {
    return;
    await hydraProvider.connect();
    await hydraProvider.init();
    const utxos = await meshWallet.getUtxos();
    console.log(utxos[0]);
    const protocolParameters = await hydraProvider.fetchProtocolParameters();
    meshTxBuilder = new MeshTxBuilder({
      fetcher: hydraProvider,
      submitter: hydraProvider,
      params: protocolParameters,
      isHydra: true,
    });

    const unsignedTx = await meshTxBuilder
      // .txIn(utxos[o])
      .txOut("", [
        {
          unit: "lovelace",
          quantity: "30000",
        },
      ])
      .selectUtxosFrom(utxos)
      .changeAddress("")
      .setNetwork("preview")
      .complete();

    const signedTx = await meshWallet.signTx(unsignedTx, true);
    const txHash = await meshWallet.submitTx(signedTx);
    console.log("commit txhash:", txHash);
    expect(typeof txHash).toBe("string");
  });
});
