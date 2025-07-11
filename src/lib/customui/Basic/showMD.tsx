'use client';

import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import React from 'react';

export default function MDViewer({ content }: { content: string }) {
    const { resolvedTheme } = useTheme();
    return <div className="container" data-color-mode={resolvedTheme}>
        <MDEditor.Markdown source={content} />
    </div>;
}