import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import cbor from "cbor";

/**
 * @description Merge multiple Tailwind CSS class names into a single string.
 * - Combines class names conditionally using `clsx`.
 * - Resolves Tailwind conflicts using `tailwind-merge`.
 *
 * @param inputs - List of class values (string, object, array, etc.)
 * @returns A single merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * @description Shorten a string by keeping the first and last `length` characters, separated by ellipsis (`...`).
 *
 * @example
 * shortenString("abcdef123456", 3) // "abc...456"
 *
 * @param str - The original string to shorten.
 * @param length - Number of characters to keep at the start and end (default = 6).
 * @returns The shortened string if longer than `2 * length`, otherwise returns the original string.
 */
export function shortenString(str = "", length: number = 6): string {
    if (str.length <= length * 2) {
        return str;
    }
    const start = str.slice(0, length);
    const end = str.slice(-length);
    return `${start}...${end}`;
}

/**
 * @description Convert inline datum (hex string) from a UTxO into JSON metadata.
 *
 * Process:
 * 1. Converts the hex string into a buffer.
 * 2. Decodes CBOR data from the buffer into a JavaScript object.
 * 3. Converts CBOR map entries into key-value pairs (UTF-8 or hex for `_pk`).
 *
 * @param datum - The inline datum in hex string format.
 * @param option - Optional settings:
 *   - `contain_pk`: If `false`, excludes the `_pk` field (default behavior).
 * @returns A JSON object (key-value map) representing the datum metadata.
 *
 * @throws Error if the datum is not a valid CBOR map.
 */
export async function datumToJson(
    datum: string,
    option?: {
        contain_pk?: boolean;
    },
): Promise<unknown> {
    const cborDatum: Buffer = Buffer.from(datum, "hex");
    const datumMap = (await cbor.decodeFirst(cborDatum)).value[0];
    if (!(datumMap instanceof Map)) {
        throw new Error("Invalid Datum");
    }
    const obj: Record<string, string> = {};
    datumMap.forEach((value, key) => {
        const keyStr = key.toString("utf-8");
        if (keyStr === "_pk" && !option?.contain_pk) {
            return;
        }
        obj[keyStr] = keyStr !== "_pk" ? value.toString("utf-8") : value.toString("hex");
    });
    return obj;
}

/**
 * @description Extract the payment key hash (`_pk`) from inline datum.
 *
 * @param datum - The inline datum in hex string format.
 * @returns The payment key hash in hex format, or an empty string if not found.
 */
export async function getPaymentKeykHash(datum: string): Promise<string> {
    const cborDatum: Buffer = Buffer.from(datum, "hex");
    const decoded = await cbor.decodeFirst(cborDatum);
    for (const [key, value] of decoded.value[0]) {
        if (key.toString("utf-8") === "_pk") {
            return value.toString("hex");
        }
    }

    return "";
}

/**
 * @description Convert an array of key-value pairs (with hex-encoded bytes) into a plain JavaScript object.
 *
 * - Keys are decoded from hex to UTF-8 strings.
 * - Values are decoded from hex to UTF-8, except `_pk` which is left in hex.
 *
 * @example
 * convertToKeyValue([{ k: { bytes: "6162" }, v: { bytes: "6364" } }])
 * // { ab: "cd" }
 *
 * @param data - Array of objects containing `{ k: { bytes }, v: { bytes } }`.
 * @returns A record mapping decoded keys to decoded values.
 */
export function convertToKeyValue(data: { k: { bytes: string }; v: { bytes: string } }[]): Record<string, string> {
    return Object.fromEntries(
        data.map(({ k, v }) => {
            const key = Buffer.from(k.bytes, "hex").toString("utf-8");
            const value = key === "_pk" ? v.bytes : Buffer.from(v.bytes, "hex").toString("utf-8");
            return [key, value];
        }),
    );
}
