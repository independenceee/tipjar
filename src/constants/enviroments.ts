import { Network } from "@meshsdk/core";

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || "";
const KOIOS_TOKEN = process.env.KOIOS_TOKEN || "";

const APP_NETWORK: Network = (process.env.NEXT_PUBLIC_APP_NETWORK?.toLowerCase() as Network) || "preprod";

const APP_NETWORK_ID = APP_NETWORK === "mainnet" ? 1 : 0;
const IPFS_ENDPOINT = process.env.IPFS_ENDPOINT || "";
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/";

export { APP_NETWORK, APP_NETWORK_ID, BLOCKFROST_API_KEY, KOIOS_TOKEN, IPFS_ENDPOINT, IPFS_GATEWAY };
