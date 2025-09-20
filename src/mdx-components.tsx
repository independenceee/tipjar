import defaultMdxComponents from "fumadocs-ui/mdx";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";

/**
 * @description Get the MDX components used to render `.mdx` content.
 *
 * - Starts with the default MDX components from `fumadocs-ui/mdx`.
 * - Adds `TabsComponents` (custom tab UI components from Fumadocs).
 * - Merges in any additional custom components passed as argument.
 *
 * @param components - Optional extra MDX components to extend or override defaults.
 * @returns A merged object containing all MDX components for rendering.
 *
 * @example
 * const mdxComponents = getMDXComponents({
 *   CustomComponent: (props) => <div {...props} />,
 * });
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        ...TabsComponents,
        ...components,
    };
}
