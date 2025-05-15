'use client';

import MDEditor from "@uiw/react-md-editor";
import React from 'react';
//import ReactMarkdown from 'react-markdown';
//import MarkdownRenderer from './customMDRenderer';

export default function MDViewer({ content }: { content: string }) {
    return <div className="container" data-color-mode="light">
        <MDEditor.Markdown source={content} />
        {/* <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        borderRadius: '5px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <MarkdownRenderer content={content} />
      </div> */}
    </div>;
}