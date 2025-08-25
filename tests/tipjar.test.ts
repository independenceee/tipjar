import { BlockfrostProvider, MeshTxBuilder, MeshWallet, UTxO, value } from "@meshsdk/core";
import { HydraProvider, HydraInstance } from "@meshsdk/hydra";
import { BLOCKFROST_API_KEY } from "~/constants/enviroments";

describe("Hydra Tipjar Cardano", function () {
  let meshWallet: MeshWallet;
  let meshTxBuilder: MeshTxBuilder;
  let hydraProvider: HydraProvider;
  let hydraInstance: HydraInstance;
  let blockfrostProvider: BlockfrostProvider;

  beforeEach(function () {
    hydraProvider = new HydraProvider({
      httpUrl: "http://194.195.87.66:4001",
      wsUrl: "ws://194.195.87.66:4002",
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
  });

  jest.setTimeout(600000000);

  it("should make and submit a valid tx", async () => {
    // return;

    await hydraProvider.subscribeSnapshotUtxo();
    await hydraProvider.connect();
    // await hydraProvider.contest();
    // await hydraProvider.init();

    // await hydraProvider.fanout();

    // await hydraProvider.onStatusChange()

    const protocolParameters = await hydraProvider.fetchProtocolParameters();
    const utxos = await hydraProvider.fetchUTxOs();
    console.log("UTxO", utxos);
    return;

    const meshTxBuidler = new MeshTxBuilder({
      verbose: true,
      isHydra: true,
      fetcher: blockfrostProvider,
      submitter: blockfrostProvider,
      params: protocolParameters,
    });

    const unsignedTx = await meshTxBuidler
      .txIn(utxos[0].input.txHash, utxos[0].input.outputIndex)
      .txOut("addr_test1qrr879mjnxd3gjqjdgjxkwzfcnvcgsve927scqk5fc3gfs2hs03pn7uhujentyhzq3ays72u4xtfrlahyjalujhxufsqdeezc0", [
        {
          unit: "lovelace",
          quantity: "10000",
        },
      ])
      .changeAddress("addr_test1qrr879mjnxd3gjqjdgjxkwzfcnvcgsve927scqk5fc3gfs2hs03pn7uhujentyhzq3ays72u4xtfrlahyjalujhxufsqdeezc0")
      .selectUtxosFrom(utxos)
      .setNetwork("preview")
      .complete();

    const signedTx = await meshWallet.signTx(unsignedTx);

    const txHash = await hydraProvider.submitTx(signedTx);
    console.log(txHash);
  });

  it("Decommit UTxO", async function () {
    return;
    await hydraProvider.connect();
    await hydraProvider.init();
    // const status = await hydraProvider.post("", Ơ);
    // console.log(status);
  });
});
