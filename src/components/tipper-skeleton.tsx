export default function TipperSkeleton() {
    return (
        <div className="rounded-sm px-5 py-3 group relative overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-xl animate-pulse">
            <div className="block">
                <div className="relative aspect-video overflow-hidden mb-4">
                    <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 mb-2">
                    <div className="h-6 w-20 bg-blue-300/20 dark:bg-blue-600/20 rounded-full" />
                    <div className="h-6 w-16 bg-blue-300/20 dark:bg-blue-600/20 rounded-full" />
                </div>
                <div className="mb-4 h-6 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-16 bg-blue-300/20 dark:bg-blue-600/20 rounded" />
                        <div className="h-4 w-4 bg-blue-300/20 dark:bg-blue-600/20 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
