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
      httpUrl: "https://194.195.87.66:4001",
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
    await hydraProvider.init();
    await hydraProvider.connect();

    const pp = await hydraProvider.fetchProtocolParameters();
    console.log(pp);
    const utxos = await hydraProvider.fetchUTxOs();

    // meshTxBuilder = new MeshTxBuilder({
    //   fetcher: blockfrostProvider,
    //   submitter: blockfrostProvider,
    //   params: pp,
    //   isHydra: true,
    // });
    // const unsignedTx = await meshTxBuilder
    //   .txIn("cd8d9b66df467df82cf6df10a0dbd24847a27ac280e1033e509a8bc0de8d2579", 2)
    //   .txOut("", [
    //     {
    //       unit: "lovelace",
    //       quantity: "30000000",
    //     },
    //   ])
    //   .selectUtxosFrom(utxos)
    //   .setFee("0")
    //   .changeAddress("")
    //   .setNetwork("preprod")
    //   .complete();

    // console.log(unsignedTx);

    // const tx = await hInstance.commitBlueprint("ad16a3a415763e8662469c868038a659f5076a174633323894666f4c9d2e60d1", 1, {
    //   cborHex: unsignedTx,
    //   description: "a new blueprint tx",
    //   type: "Tx ConwayEra",
    // });
    // console.log("tx", tx);
    // const signedTx = await wallet.signTx(tx, true);
    // const txHash = await wallet.submitTx(signedTx);
    // console.log("commit txhash:", txHash);
    // expect(typeof txHash).toBe("string");
  });
});
