"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useWallet } from "~/hooks/use-wallet";
import { Warn } from "./icons";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { getStatus } from "~/services/hydra.service";

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

const Status = function ({ isCreator }: { isCreator: boolean }) {
    const { address } = useWallet();

    const { data, isLoading } = useQuery({
        queryKey: ["status", address],
        queryFn: () => getStatus({ walletAddress: address as string, isCreator }),
        enabled: !!address,
    });

    return (
        <motion.div
            className="relative w-full flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-900 border-l-4 border-blue-400 dark:border-blue-600 shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <motion.div
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-blue-500 dark:text-blue-400 flex-shrink-0"
            >
                <Warn className="w-5 h-5" />
            </motion.div>
            <div className="flex-1 min-w-0">
                <motion.p
                    className="text-sm font-medium text-blue-700 dark:text-blue-200 truncate"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    Verify identity to withdraw funds
                </motion.p>
                <motion.div
                    className="text-xs font-bold uppercase text-blue-600 dark:text-blue-300 flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    Status:{" "}
                    {isLoading ? (
                        <ClipLoader color="#3b82f6" loading={true} size={14} />
                    ) : (
                        <span className="bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded-md">{data?.status as string}</span>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default memo(Status);
