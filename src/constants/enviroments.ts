import { Network } from "@meshsdk/core";

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || "";
const HYDRA_HTTP_URL = process.env.HYDRA_HTTP_URL || "";
const HYDRA_WS_URL = process.env.HYDRA_WS_URL || "";
const KOIOS_TOKEN = process.env.KOIOS_TOKEN || "";

const APP_NETWORK: Network = (process.env.NEXT_PUBLIC_APP_NETWORK?.toLowerCase() as Network) || "preview";

const APP_NETWORK_ID = APP_NETWORK === "mainnet" ? 1 : 0;
const IPFS_ENDPOINT = process.env.IPFS_ENDPOINT || "";
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/";
const SPEND_ADDRESS = process.env.SPEND_ADDRESS || "addr_test1wps7xts4e28ykdmg0uq86y6x050wsse86q42eytg6ljz5tqmrcwgm";

export { APP_NETWORK, HYDRA_HTTP_URL, APP_NETWORK_ID, BLOCKFROST_API_KEY, KOIOS_TOKEN, IPFS_ENDPOINT, IPFS_GATEWAY, HYDRA_WS_URL, SPEND_ADDRESS };
