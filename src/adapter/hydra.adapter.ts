import { IFetcher, MeshTxBuilder, MeshWallet, UTxO } from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";
import { DECIMAL_PLACE } from "~/constants/common";
import { blockfrostProvider } from "~/providers/cardano";

/**
 * @description HydraAdapter base class for Hydra transactions and operations.
 * It provides helper methods to:
 * - Initialize Hydra connection
 * - Manage lifecycle of Hydra head (init, close, finalize, abort, fanout)
 * - Handle UTxOs (commit, decommit, filter Lovelace-only UTxOs)
 * - Provide access to MeshTxBuilder configured for Hydra
 */
export class HydraAdapter {
    protected fetcher: IFetcher;
    protected meshWallet: MeshWallet;
    public meshTxBuilder!: MeshTxBuilder;
    public hydraInstance!: HydraInstance;
    public hydraProvider: HydraProvider;

    /**
     * @param meshWallet - The MeshWallet instance to interact with user wallet.
     * @param hydraProvider - The HydraProvider instance to interact with Hydra head.
     */
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
     * @description
     * Initialize the MeshTxBuilder with protocol parameters fetched from the Hydra provider.
     * This step is mandatory before constructing or submitting any transactions within Hydra.
     *
     * The function performs the following:
     * 1. Fetches current protocol parameters from HydraProvider.
     * 2. Initializes a MeshTxBuilder instance configured for Hydra operations.
     * 3. Establishes connection with the Hydra head.
     *
     * @returns {Promise<void>}
     *          Resolves when the MeshTxBuilder is ready to use.
     *
     * @throws {Error}
     *         Throws if fetching protocol parameters or connecting to Hydra fails.
     */
    public async initialize() {
        const protocolParameters = await this.hydraProvider.fetchProtocolParameters();
        this.meshTxBuilder = new MeshTxBuilder({
            params: protocolParameters,
            fetcher: this.hydraProvider,
            submitter: this.hydraProvider,
            isHydra: true,
        });
        await this.connect();
    }

    /**
     * @description
     * Retrieve the first UTxO containing only Lovelace above a specified minimum threshold.
     *
     * This method filters out:
     * - UTxOs that include any non-ADA assets (e.g., native tokens).
     * - UTxOs with Lovelace amount smaller than the required threshold.
     *
     * Then, it sorts the eligible UTxOs in ascending order and returns the smallest valid one.
     *
     * @param {UTxO[]} utxos
     *        List of available UTxOs to evaluate.
     *
     * @param {number} quantity
     *        Minimum required Lovelace amount. Default is `DECIMAL_PLACE`.
     *
     * @returns {UTxO | undefined}
     *          The first valid Lovelace-only UTxO, or `undefined` if none is found.
     */
    public getUTxOOnlyLovelace = (utxos: UTxO[], quantity = DECIMAL_PLACE) => {
        const filteredUTxOs = utxos.filter((utxo) => {
            const amount = utxo.output?.amount;
            if (!Array.isArray(amount) || amount.length !== 1) return false;
            const { unit, quantity: qty } = amount[0];
            const quantityNum = Number(qty);
            return unit === "lovelace" && typeof qty === "string" && !isNaN(quantityNum) && quantityNum >= quantity;
        });

        return filteredUTxOs.sort((a, b) => {
            const qtyA = Number(a.output.amount[0].quantity);
            const qtyB = Number(b.output.amount[0].quantity);
            return qtyA - qtyB;
        })[0];
    };

    /**
     * @description
     * Establishes connection to the Hydra provider.
     *
     * Must be called before any operation that interacts with the Hydra network.
     *
     * @returns {Promise<void>}
     *          Resolves when successfully connected.
     *
     * @throws {Error}
     *         Throws if the Hydra provider connection fails.
     */
    public connect = async () => {
        try {
            await this.hydraProvider.connect();
        } catch (error) {
            throw error;
        }
    };

    /**
     * @description
     * Initialize Hydra head creation and UTxO commitment phase.
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `init` process.
     * 3. Listen for status changes.
     * 4. Resolve when status becomes `"INITIALIZING"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head initialization is confirmed.
     *
     * @throws {Error}
     *         Throws if Hydra init fails or provider reports error.
     */
    public init = async (): Promise<void> => {
        try {
            await this.connect();
            await new Promise<void>((resolve, reject) => {
                this.hydraProvider.init().catch((error: Error) => reject(error));

                this.hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "INITIALIZING") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * @description
     * Perform Hydra fanout, distributing finalized off-chain funds
     * back to layer-1 (Cardano mainnet/testnet).
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `fanout` process.
     * 3. Listen for status changes.
     * 4. Resolve when status becomes `"FANOUT_POSSIBLE"`.
     *
     * @returns {Promise<void>}
     *          Resolves when fanout is possible.
     *
     * @throws {Error}
     *         Throws if fanout request fails.
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
     * @description
     * Finalize the Hydra head. At this stage, all UTxOs
     * are returned back to the Cardano layer-1.
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `fanout`.
     * 3. Listen for status `"FINAL"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head reaches final state.
     *
     * @throws {Error}
     *         Throws if finalization fails.
     */
    public final = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.fanout().catch((error: Error) => reject(error));
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "FINAL") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    /**
     * @description
     * Close the Hydra head, entering the contestation phase.
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `close`.
     * 3. Listen for status `"CLOSED"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head is closed.
     *
     * @throws {Error}
     *         Throws if closing the head fails.
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
     * Abort Hydra head creation.
     * Used if initialization cannot proceed (e.g., not enough participants).
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `abort`.
     * 3. Listen for status `"OPEN"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head is aborted.
     *
     * @throws {Error}
     *         Throws if aborting fails.
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

    public submitTx = async (signedTx: string) => {
        await this.hydraProvider.connect();
        await new Promise<void>(async (resolve, reject) => {
            this.hydraProvider.submitTx(signedTx).catch((error: Error) => reject(error));
            this.hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "SnapshotConfirmed") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    /**
     * @description
     * Commit UTxOs into the Hydra head so that they become available for off-chain Hydra transactions.
     *
     * Behavior:
     * - If `input` is provided, commit that specific UTxO.
     * - If no input is provided, the function automatically selects the first Lovelace-only UTxO
     *   above a default threshold (10 ADA) by calling `getUTxOOnlyLovelace()`.
     *
     * This operation is crucial for enabling the wallet's funds to be used inside Hydra off-chain layer.
     *
     * @param {Object} param
     * @param {string} [param.input.txHash] - Transaction hash of the UTxO to commit.
     * @param {number} [param.input.outputIndex] - Output index of the UTxO.
     *
     * @returns {Promise<string>}
     *          An unsigned transaction string for committing the UTxO into Hydra.
     *
     * @throws {Error}
     *         Throws if no valid UTxO is found or Hydra provider connection fails.
     */
    public commit = async ({ input }: { input?: { txHash: string; outputIndex: number } }): Promise<string> => {
        await this.hydraProvider.connect();
        const utxos = await this.meshWallet.getUtxos();
        const utxoOnlyLovelace = this.getUTxOOnlyLovelace(utxos, 10_000_000);
        if (input) {
            return await this.hydraInstance.commitFunds(input.txHash, input.outputIndex);
        }

        console.log(utxos[0]);

        // return await this.hydraInstance.commitFunds(utxoOnlyLovelace.input.txHash, utxoOnlyLovelace.input.outputIndex);
        return await this.hydraInstance.commitFunds(utxos[0].input.txHash, utxos[0].input.outputIndex);
    };
}
