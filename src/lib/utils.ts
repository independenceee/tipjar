import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function shortenString(str = "", length: number = 6): string {
    if (str.length <= length * 2) {
        return str;
    }
    const start = str.slice(0, length);
    const end = str.slice(-length);
    return `${start}...${end}`;
}
