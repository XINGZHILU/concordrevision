'use client';

import MDEditor from "@uiw/react-md-editor";
import React from "react";

export default function MDViewer({content} : {content : string}){
    return <div>
        <MDEditor.Markdown source={content} style={{ whiteSpace: 'pre-wrap' }} />
    </div>;
}