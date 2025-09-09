import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { images } from "~/public/images";
import Image from "next/image";
import Link from "next/link";
import { routers } from "~/constants/routers";

export const baseOptions: BaseLayoutProps = {
    nav: {
        title: (
            <div className="flex flex-col items-start gap-3">
                <Link href={routers.home} className="flex items-center gap-3">
                    <Image className="h-12 w-auto animate-pulse" loading="lazy" src={images.logo} alt="Cardano2vn" />
                    <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-300 font-stretch-50%">Tipjar Hydra</h3>
                </Link>
            </div>
        ),
    },
    githubUrl: "https://github.com/cardano2vn",
    // disableThemeSwitch: true,
};
