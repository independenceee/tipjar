import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export default function Tipper({
    image,
    title,
    author,
    datetime,
    slug,
    participants,
}: {
    title: string;
    image: string | StaticImageData;
    author: string;
    datetime: string;
    slug: string;
    participants: number;
}) {
    return (
        <div className="text-card-foreground px-5 py-3 group relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-gray-300 dark:hover:border-white/40 hover:shadow-2xl rounded-xl bg-white dark:bg-slate-900/50 p-6 shadow-md shadow-blue-200/30 dark:shadow-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600">
            <Link className="block" href={`/tipper/${slug}`} aria-label={`Read more about ${title}`}>
                <div className="relative aspect-video overflow-hidden">
                    <img
                        alt={title}
                        loading="lazy"
                        width={1200}
                        height={675}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={typeof image === "string" ? image : image.src}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) {
                                fallback.classList.remove("hidden");
                            }
                        }}
                    />
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Image not available</span>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 lg:text-2xl line-clamp-2 h-16 flex items-start">
                        {title}
                    </h2>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                            <span className="font-mono">{datetime}</span>
                            <span>by {author}</span>
                            <div className="flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4a4 4 0 100 8 4 4 0 000-8zm0 10c-3.86 0-7 1.79-7 4v2h14v-2c0-2.21-3.14-4-7-4z"
                                    />
                                </svg>
                                <span>{participants} participants</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 transition-colors duration-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                            <span className="text-xs font-medium">Read More</span>
                            <svg
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
