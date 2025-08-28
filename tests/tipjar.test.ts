import { BlockfrostProvider, ForgeScript, mConStr0, MeshTxBuilder, MeshWallet, resolveScriptHash, stringToHex, UTxO, value } from "@meshsdk/core";
import { HydraProvider, HydraInstance } from "@meshsdk/hydra";
import { BLOCKFROST_API_KEY, HYDRA_HTTP_URL, HYDRA_WS_URL } from "~/constants/enviroments";
import { getLovelaceOnlyUTxO } from "~/utils";

describe("Hydra TipJar: Bringing Instant and Affordable Tips to Cardano Communities", function () {
    let meshWallet: MeshWallet;
    let meshTxBuilder: MeshTxBuilder;
    let hydraProvider: HydraProvider;
    let hydraInstance: HydraInstance;
    let blockfrostProvider: BlockfrostProvider;

    beforeEach(async function () {
        hydraProvider = new HydraProvider({
            httpUrl: "http://194.195.87.66:4001",
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
                words: process.env.ALICE_APP_MNEMONIC?.split(" ") || [],
                // words: process.env.BOB_APP_MNEMONIC?.split(" ") || [],
            },
        });

        const protocolParameters = await hydraProvider.fetchProtocolParameters();

        meshTxBuilder = new MeshTxBuilder({
            fetcher: hydraProvider,
            submitter: hydraProvider,
            isHydra: true,
            params: protocolParameters,
        });
    });

    jest.setTimeout(60_000_000);

    describe("Common and basic state management in head hydra", function () {
        it("Initializing Head creation and UTxO commitment phase.", async () => {
            return;
            await hydraProvider.connect();
            await new Promise<void>((resolve, reject) => {
                hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "INITIALIZING") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                hydraProvider.init().catch((error: Error) => reject(error));
            });
        });

        it("Closed Head closed, starting contestation phase.", async () => {
            return;
            await hydraProvider.connect();
            await new Promise<void>((resolve, reject) => {
                hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "CLOSED") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                hydraProvider.close().catch((error: Error) => reject(error));
            });
        });

        it("Ready to fanout  Snapshot finalized, ready for layer-1 distribution.", async () => {
            return;
            await hydraProvider.connect();
            await new Promise<void>((resolve, reject) => {
                hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "FANOUT_POSSIBLE") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                hydraProvider.fanout().catch((error: Error) => reject(error));
            });
        });

        it("Finalized Head completed, UTxOs returned to layer-1.", async function () {
            return;
            await hydraProvider.connect();
            await new Promise<void>((resolve, reject) => {
                hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "FINAL") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                hydraProvider.fanout().catch((error: Error) => reject(error));
            });
        });

        it("Aborted Head canceled before opening.", async () => {
            return;
            await hydraProvider.connect();
            await new Promise<void>((resolve, reject) => {
                hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "OPEN") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                hydraProvider.abort().catch((error: Error) => reject(error));
            });
        });
    });

    describe("Implement full fund lifecycle within Hydra head (commit funds into head and decommit them back to main chain)", () => {
        it("1- Commit UTXOs into the Hydra head to make them available for off-chain transactions.", async () => {
            return;
            await hydraProvider.connect();
            const utxos = await meshWallet.getUtxos();
            const utxoOnlyLovelace = getLovelaceOnlyUTxO(utxos);
            const commitUnsignedTx = await hydraInstance.commitFunds(utxoOnlyLovelace.input.txHash, utxoOnlyLovelace.input.outputIndex);
            const commitSignedTx = await meshWallet.signTx(commitUnsignedTx, true);
            const commitTxHash = await meshWallet.submitTx(commitSignedTx);
            console.log("https://preview.cexplorer.io/tx/" + commitTxHash);
            const snapshotUtxos = await hydraProvider.subscribeSnapshotUtxo();
            console.log(snapshotUtxos);
        });

        it("2- Commit UTXOs into the Hydra head to make them available for off-chain transactions.", async () => {
            return;
            await hydraProvider.connect();
            const utxos = await meshWallet.getUtxos();
            const utxoOnlyLovelace = getLovelaceOnlyUTxO(utxos);
            console.log(utxoOnlyLovelace);
            const walletAddress = await meshWallet.getChangeAddress();
            const unsignedTx = await meshTxBuilder
                .txIn(utxoOnlyLovelace.input.txHash, utxoOnlyLovelace.input.outputIndex)
                .txOut("", utxoOnlyLovelace.output.amount)
                .changeAddress(walletAddress)
                .selectUtxosFrom(utxos)
                .setNetwork("preview")
                .complete();
            const commitSignedTx = await meshWallet.signTx(unsignedTx, true);
            const commitTxHash = await meshWallet.submitTx(commitSignedTx);
            console.log("https://preview.cexplorer.io/tx/" + commitTxHash);
            const snapshotUtxos = await hydraProvider.subscribeSnapshotUtxo();
            console.log(snapshotUtxos);
        });

        it("1- Decommit UTXOs from the Hydra head, withdrawing funds back to the Cardano main chain.", async () => {
            return;
        });

        it("2- Decommit UTXOs from the Hydra head, withdrawing funds back to the Cardano main chain.", async () => {
            return;
        });
    });

    describe("Building utxo reading functions in hydra brought to Layer", function () {
        it("", async function () {
            return;
            await hydraProvider.connect();
            const utxos = await hydraProvider.fetchUTxOs();
            // console.log(utxos[0].output.amount);
        });
    });

    describe("Transaction processing in hydra from basic to advanced", function () {
        it("Lovelace transfer from one address to another", async function () {
            return;
            await hydraProvider.connect();
            const walletAddress = await meshWallet.getChangeAddress();
            const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);

            const unsignedTx = await meshTxBuilder
                .txIn(utxos[0].input.txHash, utxos[0].input.outputIndex)
                // .txOut("addr_test1qzk0hl57jzwu2p0kpuqs48q2f7vty8efhcwh4l8wynckp4se2hwvvldt8r4c3cr7dcszlt2f7xs5ef2hydn25pugcgvs4843vd", [
                //     {
                //         unit: "lovelace",
                //         quantity: "1000000",
                //     },
                // ])

                .txOut("addr_test1qz45qtdupp8g30lzzr684m8mc278s284cjvawna5ypwkvq7s8xszw9mgmwpxdyakl7dgpfmzywctzlsaghnqrl494wnqhgsy3g", [
                    {
                        unit: "lovelace",
                        quantity: "1000000",
                    },
                ])
                .changeAddress(walletAddress)
                .selectUtxosFrom(utxos)
                .setFee("0")
                .setNetwork("preview")
                .complete();
            const signedTx = await meshWallet.signTx(unsignedTx, true);
            await hydraProvider.submitTx(signedTx);
            const utxosSnapshot = await hydraProvider.subscribeSnapshotUtxo();
            console.log(utxosSnapshot);
        });

        it("Transfer funds from one address to another with datum", async function () {
            return;
            await hydraProvider.connect();
            const walletAddress = await meshWallet.getChangeAddress();
            const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);

            const unsignedTx = await meshTxBuilder
                .txIn(utxos[0].input.txHash, utxos[0].input.outputIndex)
                .txOut("addr_test1qzk0hl57jzwu2p0kpuqs48q2f7vty8efhcwh4l8wynckp4se2hwvvldt8r4c3cr7dcszlt2f7xs5ef2hydn25pugcgvs4843vd", [
                    {
                        unit: "lovelace",
                        quantity: "5000000",
                    },
                ])
                .txOutInlineDatumValue(mConStr0(["Independence"]))
                .changeAddress(walletAddress)
                .selectUtxosFrom(utxos)
                .setFee("0")
                .setNetwork("preview")
                .complete();
            const signedTx = await meshWallet.signTx(unsignedTx, true);
            await hydraProvider.submitTx(signedTx);
            const utxosSnapshot = await hydraProvider.subscribeSnapshotUtxo();
            console.log(utxosSnapshot);
        });

        it("Mint assets via forge script with CIP25", async function () {
            return;
            await hydraProvider.connect();
            const walletAddress = await meshWallet.getChangeAddress();
            const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);
            const forgingScript = ForgeScript.withOneSignature(walletAddress);
            const policyId = resolveScriptHash(forgingScript);
            const assetName = stringToHex("Independences");
            const metadata = {
                name: "Independences",
                image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
                mediaType: "image/jpg",
                description: "This NFT was minted by Hydra Layer 2 Cardano.",
            };

            const unsignedTx = await meshTxBuilder
                .mint("1", policyId, assetName)
                .mintingScript(forgingScript)
                .metadataValue(721, { [policyId]: { [assetName]: { ...metadata } } })
                .txOut(walletAddress, [
                    {
                        quantity: "1",
                        unit: policyId + assetName,
                    },
                    {
                        quantity: "2000000",
                        unit: "lovelace",
                    },
                ])
                .changeAddress(walletAddress)
                .selectUtxosFrom(utxos)
                .setNetwork("preview")
                .setFee("0")
                .complete();
            const signedTx = await meshWallet.signTx(unsignedTx, true);
            await hydraProvider.submitTx(signedTx);
            const utxosSnapshot = await hydraProvider.subscribeSnapshotUtxo();
            console.log(utxosSnapshot);
        });

        it("Asset transfer from one address to another", async function () {
            return;
            await hydraProvider.connect();
            const walletAddress = await meshWallet.getChangeAddress();
            const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);
            const forgingScript = ForgeScript.withOneSignature(walletAddress);
            const policyId = resolveScriptHash(forgingScript);
            const assetName = stringToHex("Independence");

            const unsignedTx = await meshTxBuilder
                .txIn(utxos[0].input.txHash, utxos[0].input.outputIndex)
                .txOut("addr_test1qzk0hl57jzwu2p0kpuqs48q2f7vty8efhcwh4l8wynckp4se2hwvvldt8r4c3cr7dcszlt2f7xs5ef2hydn25pugcgvs4843vd", [
                    {
                        unit: policyId + assetName,
                        quantity: "1",
                    },
                ])
                .changeAddress(walletAddress)
                .selectUtxosFrom(utxos)
                .setNetwork("preview")
                .setFee("0")
                .complete();
            const signedTx = await meshWallet.signTx(unsignedTx, true);
            await hydraProvider.submitTx(signedTx);
            const utxosSnapshot = await hydraProvider.subscribeSnapshotUtxo();
            console.log(utxosSnapshot);
        });

        it("Burn assets via forge script with CIP25", async function () {
            return;

            await hydraProvider.connect();
            const walletAddress = await meshWallet.getChangeAddress();
            const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);
            const forgingScript = ForgeScript.withOneSignature(walletAddress);
            const policyId = resolveScriptHash(forgingScript);
            const assetName = stringToHex("Independence");

            console.log(utxos[0].output);

            const unsignedTx = await meshTxBuilder
                .mint("-1", policyId, assetName)
                .mintingScript(forgingScript)
                .changeAddress(walletAddress)
                .selectUtxosFrom(utxos)
                .setNetwork("preview")
                .setFee("0")
                .complete();
            const signedTx = await meshWallet.signTx(unsignedTx, true);
            await hydraProvider.submitTx(signedTx);
            const utxosSnapshot = await hydraProvider.subscribeSnapshotUtxo();
            console.log(utxosSnapshot);
        });
    });
});
