"use client";

import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { Button } from "./ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Warn } from "./icons";
import { withdraw } from "~/services/hydra.service";
import { deleteCreator } from "~/services/tipjar.service";
import { HeadStatus } from "~/constants/common";
import { routers } from "~/constants/routers";

interface StatusProps {
    title: string;
    data: string;
    loading: boolean;
}

const Status: React.FC<StatusProps> = ({ title, data, loading }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const isFanoutEligible = useMemo(() => [HeadStatus.OPEN, HeadStatus.CLOSED, HeadStatus.FANOUT_POSSIBLE].includes(data as HeadStatus), [data]);

    const handleFanout = useCallback(async () => {
        try {
            setIsLoading(true);
            await withdraw({ status: data, isCreator: true });
            await deleteCreator();
            queryClient.invalidateQueries({ queryKey: ["status", "proposals", "proposal"] });
            toast.success("Fanout to layer 1 successful!");
            router.push(routers.dashboard);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to fanout");
        } finally {
            setIsLoading(false);
        }
    }, [data, queryClient, router]);

    useEffect(() => {
        if (data === HeadStatus.CLOSED) {
            handleFanout();
        }
    }, [data, handleFanout]);

    return (
        <motion.div
            className="relative flex w-full items-center gap-4 rounded-lg border-l-4 border-blue-400 bg-gradient-to-r from-blue-50 to-white p-4 shadow-md dark:border-blue-600 dark:from-blue-900/30 dark:to-gray-900"
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="flex-shrink-0 text-blue-500 dark:text-blue-400"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Warn className="h-5 w-5" />
            </motion.div>
            <div className="min-w-0 flex-1">
                <motion.p
                    className="truncate text-sm font-medium text-blue-700 dark:text-blue-200"
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.2 }}
                >
                    {title}
                </motion.p>
                <motion.div
                    className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600 dark:text-blue-300"
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.3 }}
                >
                    Status:{" "}
                    {loading ? (
                        <ClipLoader color="#3b82f6" size={14} />
                    ) : (
                        <span className="rounded-md bg-blue-100 px-2 py-1 dark:bg-blue-800/50">{data}</span>
                    )}
                </motion.div>
            </div>
            {isFanoutEligible && (
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                disabled={isLoading}
                                className="w-full rounded-md bg-blue-500 py-3 px-8 text-base font-semibold text-white shadow-lg hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {isLoading ? "Fanouting..." : "Fanout"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Fanout to Layer 1</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will fanout the current head, transferring services from layer 2 to layer 1.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleFanout} disabled={isLoading}>
                                    {isLoading ? "Fanouting..." : "Fanout"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Status;
