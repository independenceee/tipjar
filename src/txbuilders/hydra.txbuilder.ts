import { HydraAdapter } from "~/adapter/hydra.adapter";

export class HydraTxbuilder extends HydraAdapter {
    /**
     * Initializing Head creation and UTxO commitment phase.
     */
    init = async () => {
        try {
            await this.hydraProvider.connect();
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
}
