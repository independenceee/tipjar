import { HydraBridge } from "@hydra-sdk/bridge";
import {} from "@hydra-sdk/core";

describe("Functions to test transactions on Hydra Sdk using 24 character wallet", function () {
  let hydraBridge: HydraBridge;

  beforeEach(async function () {
    hydraBridge = new HydraBridge({
      url: "ws://194.195.87.66:4001",
      verbose: true,
    });
  });

  describe("Cases to check Hydra Status and current Head status", function () {
    // it("conntect hhydra", async function () {
    //   // return;
    //   await new Promise((resolve) => {
    //     hydraBridge.connect();
    //     const isConnected = hydraBridge.connected();
    //     console.log("Connection status:", isConnected);
    //     const info = hydraBridge.headInfo().then((info) => {
    //       console.log({
    //         headId: info.headId,
    //         headStatus: info.headStatus,
    //         vkey: info.vkey,
    //       });
    //     });
    //   });
    // });
  });
});
