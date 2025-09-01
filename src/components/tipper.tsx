import { StaticImageData } from "next/image";
import Link from "next/link";

export default function Tipper({
    image,
    title,
    author,
    datetime,
    slug,
    tag = "Creator",
}: {
    title: string;
    image: string | StaticImageData;
    author: string;
    datetime: string;
    slug: string;
    tag?: string;
}) {
    function cleanYoutubeUrl(url: string) {
        if (!url) return "";
        const match = url.match(/(https?:\/\/www\.youtube\.com\/watch\?v=[^&\s]+)/);
        return match ? match[1] : url;
    }
    function getYoutubeIdFromUrl(url: string) {
        if (!url) return "";
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
        return match ? match[1] : "";
    }
    const isMediaObj = typeof image === "object" && image !== null;
    const isYoutube = isMediaObj && "type" in image && (image as { type?: string }).type === "YOUTUBE";
    const rawUrl = isMediaObj ? ("url" in image ? (image as { url: string }).url : "src" in image ? (image as { src: string }).src : "") : image;
    const cleanUrl = cleanYoutubeUrl(rawUrl);
    const youtubeId = isYoutube && "id" in image ? (image as { id?: string }).id || getYoutubeIdFromUrl(cleanUrl) : "";
    const imgUrl = isMediaObj
        ? "url" in image
            ? (image as { url: string }).url
            : "src" in image
            ? (image as { src: string }).src
            : ""
        : typeof image === "string"
        ? image
        : "";
    return (
        <div className="rounded-sm text-card-foreground px-5 py-3 group relative overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-white/40 hover:shadow-2xl">
            <Link className="block" href={`/tipper/${slug}`}>
                <div className="relative aspect-video overflow-hidden">
                    {isYoutube && youtubeId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full object-cover rounded"
                        />
                    ) : (
                        <>
                            {imgUrl ? (
                                <img
                                    alt={title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={imgUrl}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        target.nextElementSibling?.classList.remove("hidden");
                                    }}
                                />
                            ) : (
                                <img
                                    alt={title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={"/images/common/logo.png"}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        target.nextElementSibling?.classList.remove("hidden");
                                    }}
                                />
                            )}
                            <div className=" h-full w-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">Image not available</span>
                            </div>
                        </>
                    )}
                </div>

                {/* <div className="mb-3">
          <span className="inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/30">
            {action}
          </span>
        </div> */}
                <div className="p-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 lg:text-2xl line-clamp-2 h-16 flex items-start">
                        {title}
                    </h2>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                            <span className="font-mono">{datetime}</span>
                            <span>by {author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 transition-colors duration-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                            <span className="text-xs font-medium">Read More</span>
                            <svg
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
