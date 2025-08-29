import { CircleCheck, Copy as CopyIcon } from "lucide-react";
import React from "react";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export default function Copy({ content, className = "" }: { content: string; className?: string }) {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = async () => {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(content);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = content;

            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";

            document.body.prepend(textArea);
            textArea.select();

            try {
                document.execCommand("copy");
            } catch (e) {
                console.error(e);
            } finally {
                textArea.remove();
            }
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 500);
    };
    return (
        <Button variant="ghost" size="icon" onClick={handleCopy} className={cn(className, "")}>
            {copied ? <CircleCheck className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
        </Button>
    );
}
