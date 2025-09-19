import { motion } from "framer-motion";
import { Link } from "lucide-react";
import Image from "next/image";
import { images } from "~/public/images*";
export default function Loading() {
    return (
        <main className="relative pt-20">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <motion.div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <motion.div
                        className="mb-6 flex h-30 w-30 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image className="w-full h-full object-cover" src={images.logo} alt="" />
                    </motion.div>
                    <motion.h3
                        className="text-2xl font-semibold text-gray-900 dark:text-white mb-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Loading ...
                    </motion.h3>
                </motion.div>
            </div>
        </main>
    );
}
