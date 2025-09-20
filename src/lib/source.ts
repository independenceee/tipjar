import { docs } from "../../.source";
import { loader } from "fumadocs-core/source";

/**
 * Load documentation source for Fumadocs.
 *
 * - `baseUrl`: The base path for accessing documentation routes.
 * - `source`: The documentation content, transformed into a Fumadocs-compatible format.
 *
 * `docs.toFumadocsSource()` converts your local `.source` docs into
 * the format expected by Fumadocs.
 */
export const source = loader({
    baseUrl: "/documentation",
    source: docs.toFumadocsSource(),
});
