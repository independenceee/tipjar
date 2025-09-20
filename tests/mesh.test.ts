import { MeshWallet } from "@meshsdk/core";
import { blockfrostProvider } from "~/providers/cardano";
import { MeshTxBuilder } from "~/txbuilders/mesh.txbuilder";

describe("Save data and read data to participate in the cardano hydra process", function () {
    let meshWallet: MeshWallet;
    beforeEach(async function () {
        meshWallet = new MeshWallet({
            networkId: 0,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                // words: process.env.APP_MNEMONIC?.split(" ") || [],
                words: process.env.ALICE_APP_MNEMONIC?.split(" ") || [],

                // words: process.env.BOB_APP_MNEMONIC?.split(" ") || [],
            },
        });
    });
    jest.setTimeout(600000000);

    test("SignUp", async function () {
        return;
        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });
        const unsignedTx: string = await meshTxBuilder.signup({
            assetName: "Nguyen Duy Khanh",
            metadata: {
                author: "Nguyen Duy Khanh",
                title: "Beyond Financial Sovereignty: Democratizing Treasury Administration",
                image: "https://www.andamio.io/_next/image?url=%2Fblog%2F028-blog-cover.png&w=1920&q=75&dpl=dpl_GFazRiFpLrX9toggGgN9UoZDYapY",
                walletAddress: await meshWallet.getChangeAddress(),
                tag: "Creator",
                datetime: Date.now().toString(),
            },
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve, reject) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preview.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    });

    test("Deregister", async function () {
        return;
        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });
        const unsignedTx: string = await meshTxBuilder.signout({
            assetName: "Alice",
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve, reject) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preview.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    });

    test("Removes", async function () {
        // return;
        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });
        const unsignedTx: string = await meshTxBuilder.remove();
        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);

        await new Promise<void>(function (resolve, reject) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preview.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    });
});
