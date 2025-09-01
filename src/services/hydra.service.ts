"use server";

import { UTxO } from "@meshsdk/core";
import cbor from "cbor";
import { isNil } from "lodash";
import { SPEND_ADDRESS } from "~/constants/enviroments";
import { blockfrostFetcher, blockfrostProvider, koiosFetcher } from "~/providers/cardano";
import { parseError } from "~/utils/error/parse-error";

export async function getCreaters({ query = "", page = 1, limit = 12 }: { query?: string; page?: number; limit?: number }) {
    try {
        const assetsAddress: Array<{
            policy_id: string;
            asset_name: string;
        }> = await koiosFetcher.fetchAssetsFromAddress(SPEND_ADDRESS);

        const total = assetsAddress.length;

        const assetsSlice: Array<{
            policy_id: string;
            asset_name: string;
        }> = assetsAddress.slice((page - 1) * limit, page * limit);

        const data = await Promise.all(
            assetsSlice.map(async ({ policy_id, asset_name }) => {
                const assetTxs: Array<{ tx_hash: string; block_time: string }> = await blockfrostFetcher.fetchAssetTransactions(
                    policy_id + asset_name,
                );

                const txUtxos: UTxO[] = await blockfrostProvider.fetchUTxOs(assetTxs[0].tx_hash);
                let walletAddress = "";
                let plutusData: {
                    title: string;
                    author: string;
                    image: string;
                    tag: string;
                };
                for (const utxo of txUtxos) {
                    if (utxo.output.address === SPEND_ADDRESS) {
                        if (!isNil(utxo.output.plutusData)) {
                            const buffer: Buffer = Buffer.from(utxo.output.plutusData, "hex");
                            const datum = (await cbor.decodeFirst(buffer)).value[0].toString("utf-8");
                            plutusData = JSON.parse(datum);
                        }
                    } else {
                        walletAddress = utxo.output.address;
                    }
                }
                if (!isNil(plutusData!)) {
                    return {
                        walletAddress: walletAddress,
                        datetime: assetTxs[0].block_time,
                        title: plutusData.title,
                        image: plutusData.image,
                        author: plutusData.author,
                        tag: plutusData.tag,
                    };
                }
            }),
        );

        return {
            data: data,
            totalItem: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        return {
            data: [],
            message: parseError(error),
        };
    }
}

export async function getCreator() {}
