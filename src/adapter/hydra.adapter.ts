import { IFetcher, MeshTxBuilder, MeshWallet, UTxO } from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";
import { DECIMAL_PLACE } from "~/constants/common";
import { APP_NETWORK } from "~/constants/enviroments";
import { blockfrostProvider } from "~/providers/cardano";

/**
 * @description HydraAdapter base class for Hydra transactions and operations.
 * @param param { meshWallet: MeshWallet, hydraProvider: HydraProvider }
 */
export class HydraAdapter {
    protected fetcher: IFetcher;
    protected meshWallet: MeshWallet;
    public meshTxBuilder!: MeshTxBuilder;
    public hydraInstance!: HydraInstance;
    public hydraProvider: HydraProvider;

    constructor({ meshWallet, hydraProvider }: { meshWallet: MeshWallet; hydraProvider: HydraProvider }) {
        this.meshWallet = meshWallet;
        this.fetcher = blockfrostProvider;
        this.hydraProvider = hydraProvider;
        this.hydraInstance = new HydraInstance({
            submitter: blockfrostProvider,
            provider: this.hydraProvider,
            fetcher: blockfrostProvider,
        });
    }

    /**
     * @description Initialize the MeshTxBuilder with protocol parameters from the Hydra provider.
     * This method must be called before performing any transactions.
     * @returns void
     */
    public async initialize() {
        const protocolParameters = await this.hydraProvider.fetchProtocolParameters();
        this.meshTxBuilder = new MeshTxBuilder({
            params: protocolParameters,
            fetcher: this.hydraProvider,
            submitter: this.hydraProvider,
            isHydra: true,
        });
    }

    /**
     * Returns the first UTxO containing only Lovelace with quantity > 1,000,000,000.
     * @param utxos - Array of UTxO objects
     * @returns - A single UTxO or undefined if no UTxO meets the criteria
     * @throws - Error if no qualifying UTxO is found
     */
    public getUTxOOnlyLovelace = (utxos: UTxO[], quantity = DECIMAL_PLACE) => {
        return utxos.filter((utxo) => {
            const amount = utxo.output.amount;
            return (
                Array.isArray(amount) &&
                amount.length === 1 &&
                amount[0].unit === "lovelace" &&
                typeof amount[0].quantity === "string" &&
                Number(amount[0].quantity) >= quantity
            );
        })[0];
    };
    /**
     * @description Initializing Head creation and UTxO commitment phase.
     */
    public connect = async () => {
        try {
            await this.hydraProvider.connect();
        } catch (error) {
            console.log(error);
        }
    };
    /**
     * @description Initializing Head creation and UTxO commitment phase.
     */
    public init = async () => {
        try {
            await this.connect();
            await new Promise<void>((resolve, reject) => {
                this.hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "INITIALIZING") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                this.hydraProvider.init().catch((error: Error) => reject(error));
            });
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * @description Ready to fanout  Snapshot finalized, ready for layer-1 distribution.
     */
    public fanout = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.fanout().catch((error: Error) => reject(error));

            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "FANOUT_POSSIBLE") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    /**
     * @description Finalized Head completed, UTxOs returned to layer-1.
     */
    public final = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "FINAL") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.hydraProvider.fanout().catch((error: Error) => reject(error));
        });
    };

    /**
     * @description Closed Head closed, starting contestation phase.
     */
    public close = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "CLOSED") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.hydraProvider.close().catch((error: Error) => reject(error));
        });
    };

    /**
     * @description
     */
    public abort = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "OPEN") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.hydraProvider.abort().catch((error: Error) => reject(error));
        });
    };

    /**
     * @description Commit UTXOs into the Hydra head to make them available for off-chain transactions.
     * @returns unsignedTx
     */
    public commit = async (): Promise<string> => {
        await this.hydraProvider.connect();
        const utxos = await this.meshWallet.getUtxos();
        const utxoOnlyLovelace = this.getUTxOOnlyLovelace(utxos);
        return await this.hydraInstance.commitFunds(utxoOnlyLovelace.input.txHash, utxoOnlyLovelace.input.outputIndex);
    };

    /**
     * @description Decommit UTXOs from the Hydra head, withdrawing funds back to the Cardano main chain.
     * @returns unsignedTx
     */
    public decommit = async (): Promise<string> => {
        return "";
    };

    /**
     * @description Merge UTxOs into one to be able to decommit
     * @returns unsignedTx
     */
    public merge = async () => {
        await this.hydraProvider.connect();
        const utxos = await this.hydraProvider.fetchUTxOs(await this.meshWallet.getChangeAddress());
        const unsignedTx = this.meshTxBuilder;
        const total = utxos.reduce((acc, utxo) => {
            unsignedTx.txIn(utxo.input.txHash, utxo.input.outputIndex);
            const lovelace = utxo.output.amount.find((amount) => amount.unit === "lovelace");
            return acc + (lovelace ? Number(lovelace.quantity) : 0);
        }, 0);
        unsignedTx
            .txOut(await this.meshWallet.getChangeAddress(), [
                {
                    unit: "lovelace",
                    quantity: String(total),
                },
            ])
            .changeAddress(await this.meshWallet.getChangeAddress())
            .selectUtxosFrom(utxos)
            .setFee(String(0))
            .setNetwork(APP_NETWORK);
        return await unsignedTx.complete();
    };
}
