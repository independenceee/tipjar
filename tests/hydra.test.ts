import { MeshWallet } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { APP_NETWORK_ID, HYDRA_HTTP_URL, HYDRA_WS_URL, HYDRA_HTTP_URL_SUB, HYDRA_WS_URL_SUB } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";
import { HydraTxBuilder } from "~/txbuilders/hydra.txbuilder";

describe("Hydra TipJar: Bringing Instant and Affordable Tips to Cardano Communities", function () {
    let isCreator: boolean = false;
    let meshWallet: MeshWallet;
    let hydraProvider: HydraProvider;

    beforeEach(async function () {
        meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                // words: process.env.APP_MNEMONIC?.split(" ") || [],
                // words: process.env.ALICE_APP_MNEMONIC?.split(" ") || [],
                words: process.env.BOB_APP_MNEMONIC?.split(" ") || [],
            },
        });

        hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });
    });

    jest.setTimeout(60_000_000_000);

    describe("Common and basic state management in head hydra", function () {
        it("Initializing Head creation and UTxO commitment phase.", async () => {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.init();
            } catch (error) {
                console.log(error);
            }
        });

        it("Closed Head closed, starting contestation phase.", async () => {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.close();
            } catch (error) {
                console.log(error);
            }
        });

        it("Ready to fanout  Snapshot finalized, ready for layer-1 distribution.", async () => {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.fanout();
            } catch (error) {
                console.log(error);
            }
        });

        it("Finalized Head completed, UTxOs returned to layer-1.", async function () {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.final();
            } catch (error) {
                console.log(error);
            }
        });

        it("Aborted Head canceled before opening.", async () => {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.abort();
            } catch (error) {
                console.log(error);
            }
        });

        it("Get status on head hydra when hydra interact", async function () {});
    });

    describe("Implement full fund lifecycle within Hydra head (commit funds into head and decommit them back to main chain)", () => {
        it("1- Commit UTXOs into the Hydra head to make them available for off-chain transactions.", async () => {
            // return;
            const hydraTxBuilder = new HydraTxBuilder({
                meshWallet: meshWallet,
                hydraProvider: hydraProvider,
            });
            const commitUnsignedTx = await hydraTxBuilder.commit();
            const commitSignedTx = await meshWallet.signTx(commitUnsignedTx, true);
            const commitTxHash = await meshWallet.submitTx(commitSignedTx);
            console.log("https://preview.cexplorer.io/tx/" + commitTxHash);
            const snapshotUtxos = await hydraProvider.subscribeSnapshotUtxo();
            console.log(snapshotUtxos);
        });

        it("2- Commit UTXOs into the Hydra head to make them available for off-chain transactions.", async () => {
            return;
        });

        it("1- Decommit UTXOs from the Hydra head, withdrawing funds back to the Cardano main chain.", async () => {
            return;
        });

        it("2- Decommit UTXOs from the Hydra head, withdrawing funds back to the Cardano main chain.", async () => {
            return;
        });
    });

    describe("Transaction processing in hydra from basic to advanced", function () {
        it("Lovelace transfer from one address to another", async function () {
            // return;
            const hydraTxBuilder = new HydraTxBuilder({
                meshWallet: meshWallet,
                hydraProvider: hydraProvider,
            });
            await hydraTxBuilder.initialize();
            // const unsignedTx = await hydraTxBuilder.send({
            //     tipAddress: "addr_test1qz45qtdupp8g30lzzr684m8mc278s284cjvawna5ypwkvq7s8xszw9mgmwpxdyakl7dgpfmzywctzlsaghnqrl494wnqhgsy3g",
            //     amount: 1_000_000,
            // });
            // const signedTx = await meshWallet.signTx(unsignedTx, true);
            const txHash = await hydraProvider.submitTx(
                "84a400d901028182582055202fc2f7f84bb6928002c60f06f4bef2015780d040a9cce6f115ea944c1e0802018282583900ab402dbc084e88bfe210f47aecfbc2bc7828f5c499d74fb4205d6603d039a0271768db826693b6ff9a80a76223b0b17e1d45e601fea5aba61a001e848082583900acfbfe9e909dc505f60f010a9c0a4f98b21f29be1d7afcee24f160d61955dcc67dab38eb88e07e6e202fad49f1a14ca5572366aa0788c2191a007a12000200075820bdaa99eb158414dea0a91d6c727e2268574b23efe6e08ab3b841abe8059a030ca100818258205fd3ba99c1e900748f11f51f7fecbbb5459aa362b15a50b39d23963558785a705840728f78ce494a0b3e835439a6b38796155737f0ca3d9d120948fc94000b46285eab643e8d521df89bca70582269d290105898005729fdd8b6937ca773afe7490df5d90103a0",
            );
            const utxosSnapshot = await hydraProvider.subscribeSnapshotUtxo();
            console.log(utxosSnapshot);
        });

        it("Transfer funds from one address to another with datum", async function () {
            return;
        });

        it("Mint assets via forge script with CIP25", async function () {
            return;
        });

        it("Asset transfer from one address to another", async function () {
            return;
        });

        it("Burn assets via forge script with CIP25", async function () {
            return;
        });
    });
});
