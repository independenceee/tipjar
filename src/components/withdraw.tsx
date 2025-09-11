import { memo } from "react";
import { ArrowRight } from "./icons";

const Withdraw = function ({ walletAddress }: { walletAddress: string }) {
    return (
        <div className="rounded-[24px] bg-card text-card-foreground border border-blue-200/50 dark:border-blue-900/30 col-span-2">
            <div className="space-y-1.5 p-6 flex flex-row items-center gap-2 py-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-slate-800/90 dark:to-slate-700/90">
                <div className="rounded-full bg-[#D3E4FD] dark:bg-blue-900/30 p-2">
                    <ArrowRight />
                </div>
                <h3 className="font-semibold text-lg">Withdrawal History</h3>
            </div>
            <div className="p-6 pt-0">
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">Withdrawals you make will appear here.</div>
            </div>
        </div>
    );
};

export default memo(Withdraw);
