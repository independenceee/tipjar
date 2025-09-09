import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { images } from "~/public/images";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export const baseOptions: BaseLayoutProps = {
    nav: {
        title: (
            <div className="flex flex-col items-start gap-3">
                <Image src={images.logo} alt="logo" width={160} height={100} />
                <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 rounded-md"
                >
                    <Home className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>
            </div>
        ),
    },
    githubUrl: "https://github.com/cardano2vn",
    // disableThemeSwitch: true,
};
