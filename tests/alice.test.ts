import { BlockfrostProvider, MeshTxBuilder, MeshWallet } from "@meshsdk/core";
import { HydraProvider, HydraInstance } from "@meshsdk/hydra";
// process.exit(0);
describe("Alice Tipjar Cardano", function () {
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
        words: process.env.ALICE_APP_MNEMONIC?.split(" ") || [],
      },
    });
  });

  jest.setTimeout(600000000);

  it("should make and submit a valid tx", async () => {
    return;
    await hydraProvider.connect();
    await hydraProvider.init();
    console.log("Alice address: ", await meshWallet.getChangeAddress());

    // return;
    const utxoAlice = (await meshWallet.getUtxos())[0];

    // const protocolParameters = await hydraProvider.fetchProtocolParameters();
    // // console.log(protocolParameters);
    const utxos = await hydraProvider.fetchUTxOs();
    console.log("UTxO", utxos);

    // const commitTx = await hydraInstance.commitFunds("990d6958f3bd3289b58c500a4774f69fc0675af6c7844f8ca2e803f99ad40ae0", 0);
    const commitTx = await hydraInstance.commitFunds(utxoAlice.input.txHash, utxoAlice.input.outputIndex);

    console.log("tx => ", commitTx);
    const signedTx = await meshWallet.signTx(commitTx, true);
    console.log("signed Tx => ", signedTx);
    const commitTxHash = await meshWallet.submitTx(signedTx);
    console.log("txHash: ", commitTxHash);
  });
});
