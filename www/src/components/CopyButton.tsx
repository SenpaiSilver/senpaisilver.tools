import React from "react";

interface CopyButtonProps {
    value: string;
    text?: string;
    className?: string;
}

export function CopyButton({ value, text, className }: CopyButtonProps) {
    function copy() {
        const input = document.createElement("textarea");
        input.value = value;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    }

    return (
        <button type="button" className={className || ""} onClick={copy}>
            {text || "Copy"}
        </button>
    )
}
