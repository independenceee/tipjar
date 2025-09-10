"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
    code: string;
    title?: string;
}

export default function CodeBlock({ code, title }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code:", err);
        }
    };

    return (
        <div className="relative mb-6">
            {title && <div className="mb-2 text-sm font-medium text-gray-700">{title}</div>}
            <div className="relative rounded-lg bg-gray-900 p-4">
                <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-2 p-2 text-gray-400 hover:text-gray-200 bg-gray-800 rounded border transition-colors"
                >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
                <pre className="text-sm overflow-x-auto">
                    <code className="text-gray-200 font-mono">{code}</code>
                </pre>
            </div>
        </div>
    );
}
