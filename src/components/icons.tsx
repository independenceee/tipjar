import { cn } from "~/lib/utils";

export const Warn = function () {
    return (
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
            className="lucide lucide-badge-alert h-6 w-6 text-blue-600 dark:text-blue-300 mt-1 md:mt-0"
            aria-hidden="true"
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
            <line x1="12" x2="12" y1="8" y2="12"></line>
            <line x1="12" x2="12.01" y1="16" y2="16"></line>
        </svg>
    );
};

export const ArrowRight = function () {
    return (
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
            className="lucide lucide-arrow-right-to-line h-5 w-5 text-blue-600"
            aria-hidden="true"
        >
            <path d="M17 12H3"></path>
            <path d="m11 18 6-6-6-6"></path>
            <path d="M21 5v14"></path>
        </svg>
    );
};

export const Wallet = function ({ className }: { className?: string }) {
    return (
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
            className={cn("lucide lucide-wallet h-6 w-6 text-blue-600 dark:text-blue-400", className)}
            aria-hidden="true"
        >
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
        </svg>
    );
};

export const Tip = function ({ className }: { className?: string }) {
    return (
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
            className={cn("lucide lucide-coins h-5 w-5 text-blue-600 dark:text-blue-400", className)}
            aria-hidden="true"
        >
            <circle cx="8" cy="8" r="6"></circle>
            <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
            <path d="M7 6h1v4"></path>
            <path d="m16.71 13.88.7.71-2.82 2.82"></path>
        </svg>
    );
};

export const QR = function ({ className }: { className?: string }) {
    return (
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
            className={cn("lucide lucide-qr-code h-4 w-4 mr-2", className)}
            aria-hidden="true"
        >
            <rect width="5" height="5" x="3" y="3" rx="1"></rect>
            <rect width="5" height="5" x="16" y="3" rx="1"></rect>
            <rect width="5" height="5" x="3" y="16" rx="1"></rect>
            <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
            <path d="M21 21v.01"></path>
            <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
            <path d="M3 12h.01"></path>
            <path d="M12 3h.01"></path>
            <path d="M12 16v.01"></path>
            <path d="M16 12h1"></path>
            <path d="M21 12v.01"></path>
            <path d="M12 21v-1"></path>
        </svg>
    );
};

export const USD = function ({ className }: { className?: string }) {
    return (
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
            className={cn("lucide lucide-dollar-sign h-5 w-5 text-blue-600 dark:text-blue-400", className)}
            aria-hidden="true"
        >
            <line x1="12" x2="12" y1="2" y2="22"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
    );
};
