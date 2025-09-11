"use client";

import { Recent as RecentType } from "~/types";
import { USD } from "./icons";
import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecents } from "~/services/hydra.service";
import Pagination from "./pagination";
import Image from "next/image";
import { images } from "~/public/images*";

const Recent = function ({ walletAddress }: { walletAddress: string }) {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useQuery({
        queryKey: ["hydra", page],
        queryFn: () =>
            getRecents({
                walletAddress: walletAddress!,
                limit: 12,
                page: page,
            }),
    });

    return (
        <div className="h-full min-h-[calc(100%)]">
            <div className="rounded-[24px] bg-card text-card-foreground flex flex-col h-[470px] overflow-hidden border border-blue-200/50 dark:border-blue-900/30">
                <div className="p-6 pt-0 dark:bg-slate-800 h-full flex flex-col">
                    <div className="p-6 -mt-2 -mx-2 mb-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between px-[8px]">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-3 flex items-center justify-center shadow-inner">
                                <USD />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg dark:text-white">Recent Tips</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Your latest received tips</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {error && <NotFound />}
                        {isLoading && <Loading />}
                        {data && data.totalItem === 0 && <NotFound />}
                    </div>
                    <div className="mt-12 flex justify-center">
                        <Pagination currentPage={page} totalPages={data?.totalPages ?? 0} setCurrentPage={setPage} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotFound = function () {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-300 space-y-4 flex-1">
            <div className="rounded-full p-8 bg-sky-100">
                <USD className="lucide lucide-dollar-sign h-12 w-12 text-blue-500" />
            </div>
            <div className="text-center">
                <p className="text-lg font-medium dark:text-gray-200">Tips you receive will appear here</p>
                <p className="text-sm mt-2 dark:text-gray-400">Share your Tip Jar link with your audience</p>
            </div>
        </div>
    );
};

const Loading = function () {
    return (
        <div className="flex h-full flex-col w-full items-center justify-center py-20 gap-2">
            <div>
                <Image className="animate-pulse" width={100} src={images.logo} alt="not-found" />
            </div>
            <div className="text-lg font-medium dark:text-gray-200">Loading ...</div>
        </div>
    );
};

export default memo(Recent);
