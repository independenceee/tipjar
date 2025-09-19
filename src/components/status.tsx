"use client";

import { motion } from "framer-motion";
import { Warn } from "./icons";
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
import { HeadStatus } from "~/constants/common";
import { useState } from "react";
import { toast } from "sonner";
import { withdraw } from "~/services/hydra.service";
import { deleteCreator } from "~/services/tipjar.service";
import { useQueryClient } from "@tanstack/react-query";

const Status = function ({ title, data, loading }: { title: string; data: string; loading: boolean }) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleFanout = async function () {
        try {
            setIsLoading(true);
            await withdraw({ status: data, isCreator: true });
            await deleteCreator();
            queryClient.invalidateQueries({ queryKey: ["status"] });
        } catch (error) {
            toast.error(String(error));
        } finally {
            setIsLoading(false);
        }
    };
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
                    {title}
                </motion.p>
                <motion.div
                    className="text-xs font-bold uppercase text-blue-600 dark:text-blue-300 flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    Status:{" "}
                    {loading ? (
                        <ClipLoader color="#3b82f6" loading={true} size={14} />
                    ) : (
                        <span className="bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded-md">{data as string}</span>
                    )}
                </motion.div>
            </div>
            {(data?.toString().toUpperCase() === HeadStatus.OPEN ||
                data?.toString().toUpperCase() === HeadStatus.CLOSED ||
                data?.toString().toUpperCase() === HeadStatus.FANOUT_POSSIBLE) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                disabled={isLoading}
                                className="w-full rounded-md bg-blue-500 dark:bg-blue-600 py-3 px-8 text-base font-semibold text-white dark:text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? "Fanouting ..." : "Fanout"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Fanout to bring Layer 1</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You will fanout the current head then the services on layer 2 will be brought to layer 1
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleFanout} disabled={isLoading}>
                                    {isLoading ? "Fanouting ..." : "Fanout"}
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
