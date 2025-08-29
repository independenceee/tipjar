export default function Title({ title, description }: { title: string; description: string }) {
    return (
        <div className="relative mb-16">
            <div className="absolute -top-8 left-0 h-1 w-32 bg-gradient-to-r from-blue-500 to-transparent shadow-lg shadow-blue-500/50"></div>
            <div className="absolute -top-4 left-8 h-1 w-16 bg-gradient-to-r from-gray-300 dark:from-white/60 to-transparent"></div>
            <div className="mb-6 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-6xl">{title}</h1>
            </div>
            <p className="max-w-3xl text-xl text-gray-600 dark:text-gray-300">{description}</p>
        </div>
    );
}
