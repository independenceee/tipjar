import { motion } from "framer-motion";

export default function Title({ title, description }: { title: string; description: string }) {
    return (
        <div className="relative mb-16">
            <motion.div
                className="absolute -top-8 left-0 h-1 w-32 bg-gradient-to-r from-blue-500 to-transparent shadow-lg shadow-blue-500/50"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            ></motion.div>
            <motion.div
                className="absolute -top-4 left-8 h-1 w-16 bg-gradient-to-r from-gray-300 dark:from-white/60 to-transparent"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            ></motion.div>
            <div className="mb-6 flex items-center gap-4">
                <motion.div
                    className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                ></motion.div>
                <motion.h1
                    className="text-4xl font-bold text-gray-900 dark:text-white lg:text-6xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {title}
                </motion.h1>
            </div>
            <motion.p
                className="max-w-3xl text-xl text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                {description}
            </motion.p>
        </div>
    );
}
