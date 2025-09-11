import Link from "next/link";
import { routers } from "~/constants/routers";

export default function NotFound() {
    return (
        <div className="flex h-full flex-col w-full items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 py-20 relative overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 pointer-events-none select-none">
                <img
                    src="/images/common/loading.png"
                    alt="Cardano2VN Logo"
                    className="w-[600px] h-[600px] object-contain blur-sm"
                    draggable={false}
                />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4">
                <img className="animate-pulse drop-shadow-lg" width={120} src="/images/common/logo.png" alt="not-found" />
                <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight">404 - Page not found</div>
                <div className="text-base text-gray-600 dark:text-gray-400 mb-4">The page you are looking for does not exist.</div>

                <Link
                    href={routers.home}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-white/30 bg-blue-50 dark:bg-blue-900/30 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-200 shadow-lg transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
