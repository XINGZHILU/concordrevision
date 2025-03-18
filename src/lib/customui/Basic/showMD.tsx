'use client';

import MDEditor from "@uiw/react-md-editor";
import React from "react";

export default function MDViewer({content} : {content : string}){
    return <div className="container" data-color-mode="light">
        <MDEditor.Markdown source={content} />
    </div>;
}