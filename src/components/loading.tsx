export default function Loading() {
    return (
        <div className="flex h-full flex-col w-full items-center justify-center py-20">
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
            <div className="text-2xl font-bold text-gray-900 dark:text-white">Loading ...</div>
            <div className="text-base text-gray-600 dark:text-gray-400"></div>
        </div>
    );
}
