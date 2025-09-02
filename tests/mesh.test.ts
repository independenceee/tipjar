import { MeshWallet } from "@meshsdk/core";
import { blockfrostProvider } from "~/providers/cardano";
import { getCreaters } from "~/txbuilders/hydra.txbuilder";
import { MeshService } from "~/txbuilders/mesh.txbuilder";

describe("Save data and read data to participate in the cardano hydra process", function () {
    let meshWallet: MeshWallet;
    beforeEach(async function () {
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

    test("Register", async function () {
        return;
        const meshService: MeshService = new MeshService({
            meshWallet: meshWallet,
        });
        const unsignedTx: string = await meshService.register({
            assetName: "Nguyen Duy Khanh",
            metadata: {
                title: "Beyond Financial Sovereignty: Democratizing Treasury Administration",
                image: "https://www.andamio.io/_next/image?url=%2Fblog%2F029-blog-cover.jpg&w=1920&q=75&dpl=dpl_GFazRiFpLrX9toggGgN9UoZDYapY",
                author: "Nguyễn Duy Khánh",
                tag: "Creator",
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
        const meshService: MeshService = new MeshService({
            meshWallet: meshWallet,
        });
        const unsignedTx: string = await meshService.deregister({
            assetName: "Nguyen Duy Khanh",
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

    test("", async function () {
        const assets = await getCreaters({});
        console.log(assets);
    });
});
