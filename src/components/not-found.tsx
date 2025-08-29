export default function NotFound({ onClearFilters }: { onClearFilters?: () => void }) {
    return (
        <div className="flex h-full flex-col w-full items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 py-20">
            {/* Background Logo */}
            <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-3 pointer-events-none select-none block">
                <img
                    src="/images/common/loading.png"
                    alt="Cardano2VN Logo"
                    className="w-[1200px] h-[1200px] object-contain"
                    draggable={false}
                    style={{ objectPosition: "left center" }}
                />
            </div>
            <div>
                <img className="animate-pulse" width={260} src="/images/common/logo.png" alt="not-found" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">404 - Page not found</div>
            <div className="text-base text-gray-600 dark:text-gray-400">The page you are looking for does not exist</div>
            {onClearFilters && (
                <button
                    onClick={onClearFilters}
                    className="inline-flex items-center gap-2 rounded-sm border border-gray-300 dark:border-white/30 bg-gray-100 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white shadow-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-white/50 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                >
                    <span>Clear filters</span>
                </button>
            )}
        </div>
    );
}
