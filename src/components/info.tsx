"use client";

import { useState } from "react";
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
            setTimeout(() => setCopyStatus("idle"), 2000); // Reset after 2 seconds
        } catch (err) {
            setCopyStatus("error");
            setTimeout(() => setCopyStatus("idle"), 2000);
        }
    };
    return (
        <div className="rounded-[24px] bg-card text-card-foreground border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-r from-green-50/80 to-blue-50/80 dark:from-slate-900/80 dark:to-slate-800/80 dark:shadow-[0_0_15px_rgba(16,185,129,0.1)] overflow-hidden">
            <div className="flex flex-col space-y-1.5 bg-gradient-to-r from-green-100/80 to-blue-100/80 dark:from-slate-800/90 dark:to-slate-700/90 p-4">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-3 flex items-center justify-center shadow-inner">
                        <Tip />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-4">
                <div className="space-y-4 md:space-y-0">
                    <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 dark:text-gray-300">
                            Your Tip Jar Link
                        </label>
                        <div className="flex flex-col md:flex-row gap-2">
                            <input
                                className="flex h-10 w-full rounded-md border px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono text-sm bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 shadow-sm"
                                value={link}
                            />
                            <div className="flex gap-2 md:gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:text-accent-foreground h-10 px-4 py-2 border-blue-400 text-blue-500 dark:border-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 max-md:w-full max-md:flex-1"
                                            aria-label="Share QR code"
                                        >
                                            <QR />
                                            Share QR
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] rounded-2xl bg-gradient-to-br from-green-50/90 to-blue-50/90 dark:from-slate-900/90 dark:to-slate-800/90 border border-emerald-200/50 dark:border-emerald-900/50 shadow-lg p-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Scan to Tip</DialogTitle>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Scan this QR code to send a tip to {title}.
                                            </p>
                                        </DialogHeader>
                                        <div className="flex justify-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-inner border border-gray-200 dark:border-slate-700">
                                            <QRCodeCanvas
                                                value={link}
                                                size={200}
                                                bgColor="#ffffff"
                                                fgColor="#000000"
                                                level="H"
                                                includeMargin={true}
                                                className="rounded-md"
                                            />
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <DialogClose asChild>
                                                <Button
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 h-10 px-10 py-2"
                                                    aria-label="Close dialog"
                                                >
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={handleCopy}
                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white  max-md:w-full max-md:flex-1 hover:opacity-90 dark:hover:opacity-80 h-10 px-4 py-2"
                                                aria-label="Copy tip jar link"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-copy h-4 w-4 mr-2"
                                                    aria-hidden="true"
                                                >
                                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                                </svg>
                                                {copyStatus === "copied" ? "Copied!" : copyStatus === "error" ? "Failed to copy" : "Copy Link"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
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
            </div>
        </div>
    );
}
