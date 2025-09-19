"use client";

import { motion } from "framer-motion";
import { Warn } from "./icons";
import { ClipLoader } from "react-spinners";

const Status = function ({ title, data, loading }: { title: string; data: string; loading: boolean }) {
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
        </motion.div>
    );
};

export default Status;
