"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QR, Tip } from "./icons";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { QRCodeCanvas } from "qrcode.react";

export default function Info({
    title = "Your Tip Jar",
    link = "https://tipjar.cardano2vn.io/accounts/nguyen-duy-khanh-undefined-n4jt",
    description = "Share your tip jar with your fans",
}: {
    title?: string;
    link?: string;
    description?: string;
}) {
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopyStatus("copied");
            setTimeout(() => setCopyStatus("idle"), 2000);
        } catch (err) {
            setCopyStatus("error");
            setTimeout(() => setCopyStatus("idle"), 2000);
        }
    };

    return (
        <motion.div
            className="rounded-2xl border border-blue-200/50 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-slate-900"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <div className="rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900/50 dark:to-purple-900/50">
                <div className="flex items-center gap-3">
                    <motion.div
                        className="rounded-full bg-white/90 p-2 dark:bg-slate-800/90"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Tip className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                    </div>
                </div>
            </div>

            {/* Link and Actions Section */}
            <div className="mt-4 space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Your Tip Jar Link</label>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                            className="w-full rounded-lg border border-blue-200/50 bg-white/80 px-4 py-2 text-sm font-mono text-gray-800 outline-none transition-all focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-gray-200 dark:focus:border-blue-500"
                            value={link}
                            readOnly
                            aria-label="Tip jar link"
                        />
                        <div className="flex gap-3">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <motion.div
                                        variants={{
                                            rest: { scale: 1 },
                                            hover: { scale: 1.05 },
                                            tap: { scale: 0.95 },
                                        }}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Button
                                            className="flex items-center gap-2 rounded-lg border border-blue-400 bg-white px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 dark:border-blue-500 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                            aria-label="Share QR code"
                                        >
                                            <QR className="h-4 w-4" />
                                            Share QR
                                        </Button>
                                    </motion.div>
                                </DialogTrigger>
                                <DialogContent>
                                    <motion.div
                                        variants={{
                                            hidden: { opacity: 0, scale: 0.95 },
                                            visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
                                            exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
                                        }}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Scan to Tip</DialogTitle>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Scan this QR code to send a tip to {title}.</p>
                                        </DialogHeader>
                                        <div className="my-6 flex justify-center rounded-lg bg-white/80 p-4 dark:bg-slate-800/80">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                            >
                                                <QRCodeCanvas
                                                    value={link}
                                                    size={180}
                                                    bgColor="#ffffff"
                                                    fgColor="#000000"
                                                    level="H"
                                                    includeMargin={true}
                                                    className="rounded-md"
                                                />
                                            </motion.div>
                                        </div>
                                        <div className="flex justify-center">
                                            <DialogClose asChild>
                                                <motion.div
                                                    variants={{
                                                        rest: { scale: 1 },
                                                        hover: { scale: 1.05 },
                                                        tap: { scale: 0.95 },
                                                    }}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Button
                                                        className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                        aria-label="Close dialog"
                                                    >
                                                        Close
                                                    </Button>
                                                </motion.div>
                                            </DialogClose>
                                        </div>
                                    </motion.div>
                                </DialogContent>
                            </Dialog>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div
                                            variants={{
                                                rest: { scale: 1 },
                                                hover: { scale: 1.05 },
                                                tap: { scale: 0.95 },
                                            }}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="relative"
                                        >
                                            <Button
                                                onClick={handleCopy}
                                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                aria-label="Copy tip jar link"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-4 w-4"
                                                >
                                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                </svg>
                                                {copyStatus === "copied" ? "Copied!" : copyStatus === "error" ? "Failed" : "Copy Link"}
                                            </Button>
                                            <AnimatePresence>
                                                {copyStatus !== "idle" && (
                                                    <motion.div
                                                        className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-blue-600 px-2 py-1 text-xs text-white dark:bg-blue-500"
                                                        variants={{
                                                            idle: { opacity: 0, y: -10 },
                                                            copied: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                                                        }}
                                                        initial="idle"
                                                        animate="copied"
                                                        exit="idle"
                                                    >
                                                        {copyStatus === "copied" ? "Link Copied!" : "Failed to Copy"}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-blue-600 text-white dark:bg-blue-500">
                                        {copyStatus === "copied"
                                            ? "Link copied to clipboard!"
                                            : copyStatus === "error"
                                            ? "Failed to copy link"
                                            : "Copy the tip jar link"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
