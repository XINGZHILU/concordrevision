'use client';

import { useTheme } from "next-themes";
import React from "react";
import CompleteMarkdownRenderer from "@/lib/customui/Basic/customMDRenderer";

export default function MDViewer({ content }: { content: string }) {
    const { resolvedTheme } = useTheme();
    return (
        <div className="container" data-color-mode={resolvedTheme}>
            <CompleteMarkdownRenderer content={content} />
        </div>
    );
}