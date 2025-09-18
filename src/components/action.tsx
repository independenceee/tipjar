import Link from "next/link";

export default function Action({ title = "Next", href = "#home" }: { title?: string; href?: string }) {
    return (
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 transform lg:flex">
            <Link
                href={href}
                className="group flex flex-col items-center text-gray-500 dark:text-white/60 transition-colors duration-300 hover:text-gray-900 dark:hover:text-white"
            >
                <div className="mb-2 text-xs font-medium uppercase tracking-widest">{title}</div>
                <div className="h-8 w-px bg-gray-300 dark:bg-white/20 transition-colors duration-300 group-hover:bg-gray-500 dark:group-hover:bg-white/40" />
                <svg className="mt-2 h-4 w-4 animate-[throb_2s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </Link>
        </div>
    );
}
