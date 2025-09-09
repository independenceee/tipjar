import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";
import { baseOptions } from "~/app/layout.config";
import { source } from "~/lib/source";
import { DocsThemeHandler } from "~/components/docs/docs-theme-handler";
import { DocsRouteHandler } from "~/components/docs/docs-route-handler";
import "fumadocs-ui/css/ocean.css";
import "fumadocs-ui/css/preset.css";

const docsOptions: DocsLayoutProps = {
    ...baseOptions,
    tree: source.pageTree,
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <DocsRouteHandler />
            <div className="docs-isolated-container relative">
                {/* Background Logo */}
                <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-3 pointer-events-none select-none block">
                    <img
                        src="/images/common/loading.png"
                        alt="Cardano2VN Logo"
                        className="w-[1200px] h-[1200px] object-contain"
                        draggable={false}
                        style={{ objectPosition: "left center" }}
                    />
                </div>

                <DocsThemeHandler />
                <RootProvider>
                    <DocsLayout {...docsOptions}>{children}</DocsLayout>
                </RootProvider>
            </div>
        </>
    );
}
