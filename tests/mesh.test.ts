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

    test("SignUp", async function () {});

    test("Deregister", async function () {});

    test("Removes", async function () {});
});
