"use client";

import { memo, useCallback } from "react";
import { useWallet } from "~/hooks/use-wallet";
import { commit, getStatus } from "~/services/hydra.service";
import { submitTx } from "~/services/mesh.service";
import { Warn } from "./icons";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { ClipLoader } from "react-spinners";

export enum HeadStatus {
    IDLE = "IDLE",
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    INITIALIZING = "INITIALIZING",
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    FANOUT_POSSIBLE = "FANOUT_POSSIBLE",
    FINAL = "FINAL",
}

const Status = function ({ walletAddress, isCreator }: { walletAddress: string; isCreator: boolean }) {
    const params = useParams();
    const { address, signTx } = useWallet();

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["status", walletAddress],
        queryFn: () => getStatus({ walletAddress }),
        enabled: !!walletAddress,
    });

    const handleCommit = useCallback(
        async function () {
            try {
                const unsignedTx = await commit({
                    walletAddress: address as string,
                    isCreator: isCreator,
                    isInit: data?.status?.toString().toUpperCase() === HeadStatus.IDLE,
                });
                const signedTx = await signTx(unsignedTx as string);
                const { result } = await submitTx({ signedTx });

                queryClient.invalidateQueries({ queryKey: ["status", walletAddress] });
                return result;
            } catch (error) {
                console.error("Commit transaction failed:", error);
            }
        },
        [address, params.address, data, signTx, walletAddress, queryClient],
    );

    return (
        <div className="relative w-full rounded-lg border [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 text-destructive [&>svg]:text-destructive flex flex-col md:flex-row items-start md:items-center gap-4 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-4">
            <Warn />
            <div className="flex-1">
                <h5 className="mb-1 font-medium leading-none tracking-tight text-blue-700 dark:text-blue-200">
                    You must verify your identity to withdraw funds.
                </h5>
                <div className="text-sm [&amp;_p]:leading-relaxed text-blue-600 dark:text-blue-300">
                    Status: {isLoading ? <ClipLoader color={"#3b82f6"} loading={isLoading} size={13} /> : (data?.status as string)}
                </div>
            </div>

            {data?.committed ? (
                <Button
                    onClick={handleCommit}
                    disabled={data?.committed}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0 self-center min-w-[80px] text-center"
                >
                    Registed
                </Button>
            ) : (
                <Button
                    onClick={handleCommit}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0 self-center min-w-[80px] text-center"
                >
                    {isLoading ? <ClipLoader color={"#3b82f6"} loading={isLoading} size={15} /> : "Register"}
                </Button>
            )}
        </div>
    );
};

export default memo(Status);
