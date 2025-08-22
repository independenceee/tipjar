const data = {
  0: "ca7a1457ef9f4c7f9c747f8c4a4cfa6c",
  1: "cdfd40379640e6f079b7f69ffedea5ad",
  10: [
    "a30a81590117308201133081c6a003020102020500fadbdcf8300506032b657030003022180f32303235303830333038353735325a180f393939393132333132",
    "33353935395a3000302a300506032b65700321006047141eb9c99cffc21089cd87d60649be595c8444c50096eb9155db71405aa5a35d305b30590603551d1104",
    "523050864e7765622b63617264616e6f3a2f2f616464722f7374616b653175396b38666c7a6333747238387a6565776b396e6136336475356c6b703435306175",
    "616b3568356671346371323371397832666b73300506032b657003410094ec644f00870035920d6184874df69fc990ced491d24553aabab17a91212d340244c1",
    "3736cc1003f308a8e835ec5fe2f9f61365fa34e463515744b19dfe9a01181e83f7f7d9800558208939cf5b839d5ea89268a28774fbc156ebbbe128d470f2e6c1",
    "e90661a2c1c5fc186482a3000001820a000300a300030182181e020300",
  ],
  99: "e1c7aae92d4ce506466f9c1291e3fccac06f67dc214533a2382890648df533c051f8c570774dcd1bb8a9c4410cfd3ed198ad0b0d516b188bb962f923200c9902",
};

const joinedHex = data["10"]
  .map((s) => s.replace(/^0x/i, ""))
  .join("")
  .toLowerCase();

const marker = "032100";
const idx = joinedHex.indexOf(marker);
if (idx === -1) {
  throw new Error("Không tìm thấy BIT STRING (032100) chứa public key trong dữ liệu.");
}

const pubKeyHex = joinedHex.slice(idx + marker.length, idx + marker.length + 64);
const pubKey = Buffer.from(pubKeyHex, "hex");

const didPart = pubKey.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const did = `id.catalyst://cardano/${didPart}`;

console.log("Public key (hex):", pubKeyHex);
console.log("DID Catalyst:     ", did);
