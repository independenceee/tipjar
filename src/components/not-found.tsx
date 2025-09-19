import Link from "next/link";
import { routers } from "~/constants/routers";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col w-full items-center justify-center bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 py-16 px-4 relative overflow-hidden">
            {/* Background decorative image */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-5 pointer-events-none select-none">
                <img
                    src="/images/common/loading.png"
                    alt="Cardano2VN Logo"
                    className="w-[800px] h-[800px] object-contain blur-md animate-spin-slow"
                    draggable={false}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <img className="animate-bounce-slow drop-shadow-2xl" width={150} src="/images/common/logo.png" alt="Cardano2VN Logo" />
                <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-300 tracking-tight drop-shadow-md">404 - Page Not Found</h1>
                <p className="text-lg text-gray-500 dark:text-gray-300 max-w-md">
                    Oops! The page you are looking for seems to have wandered off. Lets get you back on track!
                </p>

                <Link
                    href={routers.home}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-500 dark:border-blue-400 bg-blue-600 dark:bg-blue-800 px-6 py-3 text-base font-semibold text-white dark:text-blue-100 shadow-xl transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-700 hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M6 4h12"
                        />
                    </svg>
                    Go Home
                </Link>
            </div>

            {/* Additional decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-100 dark:from-blue-950 to-transparent opacity-50" />
        </div>
    );
}
