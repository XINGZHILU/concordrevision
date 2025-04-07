// components/CompleteMarkdownRenderer.js
import React, { useState, useEffect } from 'react';

function CompleteMarkdownRenderer({ content }) {
  const [processedContent, setProcessedContent] = useState('');
  
  useEffect(() => {
    // Process the markdown to handle all required elements and reduce line spacing
    const processed = processMarkdown(content || '');
    setProcessedContent(processed);
  }, [content]);
  
  return (
    <div className="markdown-content">
      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      
      <style jsx global>{`
        .markdown-content code {
          font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
          background-color: #f6f8fa;
          padding: 0.05em 0.15em;
          border-radius: 2px;
          font-size: 13px;
        }
        
        .markdown-content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          display: block;
          overflow-x: auto;
        }
        
        .markdown-content blockquote {
          border-left: 3px solid #ddd;
          padding: 0 0.3em;
          margin: 0.2em 0;
          color: #666;
        }
        
        .markdown-content img {
          max-width: 100%;
          height: auto;
        }
        
        .markdown-content a {
          color: #0366d6;
          text-decoration: none;
        }
        
        .markdown-content a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

// Function to convert markdown to HTML
function processMarkdown(markdown) {
  if (!markdown) return '';
  
  // Split the markdown into lines to process block elements
  const lines = markdown.split('\n');
  let html = '';
  let inTable = false;
  let tableLines = [];
  let inCodeBlock = false;
  let codeLines = [];
  let inList = false;
  let listType = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check if we're in a code block
    if (trimmedLine.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLines = [];
        // Extract the language if provided (after the ```)
        const language = trimmedLine.slice(3).trim();
        codeLines.language = language;
      } else {
        // End of code block
        html += renderCodeBlock(codeLines);
        inCodeBlock = false;
      }
      continue;
    }
    
    // If we're in a code block, just add the line
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }
    
    // Check for table line
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(trimmedLine);
      continue;
    } 
    // Check for separator line (table)
    else if (trimmedLine.startsWith('|') && trimmedLine.includes('-') && trimmedLine.endsWith('|')) {
      if (inTable) {
        tableLines.push(trimmedLine);
      }
      continue;
    }
    // Not a table line
    else if (inTable) {
      // Convert collected table lines to HTML
      html += renderTable(tableLines);
      inTable = false;
    }
    
    // Headings
    if (trimmedLine.startsWith('# ')) {
      html += `<h1>${processInlineMarkdown(trimmedLine.substring(2))}</h1>\n`;
    } 
    else if (trimmedLine.startsWith('## ')) {
      html += `<h2>${processInlineMarkdown(trimmedLine.substring(3))}</h2>\n`;
    } 
    else if (trimmedLine.startsWith('### ')) {
      html += `<h3>${processInlineMarkdown(trimmedLine.substring(4))}</h3>\n`;
    } 
    else if (trimmedLine.startsWith('#### ')) {
      html += `<h4>${processInlineMarkdown(trimmedLine.substring(5))}</h4>\n`;
    } 
    else if (trimmedLine.startsWith('##### ')) {
      html += `<h5>${processInlineMarkdown(trimmedLine.substring(6))}</h5>\n`;
    } 
    else if (trimmedLine.startsWith('###### ')) {
      html += `<h6>${processInlineMarkdown(trimmedLine.substring(7))}</h6>\n`;
    }
    // Unordered lists
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const listMarker = trimmedLine.startsWith('- ') ? '- ' : '* ';
      
      // Start a new list if not already in one
      if (!inList || listType !== 'ul') {
        if (inList) html += `</${listType}>\n`; // Close previous list if different type
        html += '<ul>\n';
        inList = true;
        listType = 'ul';
      }
      
      // Get the indentation level to handle nested lists
      const indentation = line.indexOf(listMarker[0]);
      const content = processInlineMarkdown(trimmedLine.substring(listMarker.length));
      
      html += `<li>${content}</li>\n`;
      
      // Check if the next line is not a list item or is a different kind of list
      const nextLine = lines[i+1]?.trim() || '';
      if (!nextLine.startsWith('- ') && !nextLine.startsWith('* ') && 
          !(nextLine.match(/^\d+\.\s/) && listType === 'ol')) {
        html += `</ul>\n`;
        inList = false;
      }
    }
    // Ordered lists
    else if (trimmedLine.match(/^\d+\.\s/)) {
      // Start a new list if not already in one
      if (!inList || listType !== 'ol') {
        if (inList) html += `</${listType}>\n`; // Close previous list if different type
        html += '<ol>\n';
        inList = true;
        listType = 'ol';
      }
      
      const content = processInlineMarkdown(trimmedLine.substring(trimmedLine.indexOf('.')+1).trim());
      html += `<li>${content}</li>\n`;
      
      // Check if the next line is not a list item
      const nextLine = lines[i+1]?.trim() || '';
      if (!nextLine.match(/^\d+\.\s/) && 
          !(nextLine.startsWith('- ') && listType === 'ul') && 
          !(nextLine.startsWith('* ') && listType === 'ul')) {
        html += `</ol>\n`;
        inList = false;
      }
    }
    // Blockquotes
    else if (trimmedLine.startsWith('> ')) {
      html += `<blockquote>${processInlineMarkdown(trimmedLine.substring(2))}</blockquote>\n`;
    }
    // Horizontal rule
    else if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
      html += '<hr>\n';
    }
    // Empty lines
    else if (trimmedLine === '') {
      // If we were in a list, we don't automatically end it on a blank line
      // because markdown allows blank lines between list items
      if (i < lines.length - 1) {
        const nextLine = lines[i+1].trim();
        if ((inList && listType === 'ul' && !nextLine.startsWith('- ') && !nextLine.startsWith('* ')) ||
            (inList && listType === 'ol' && !nextLine.match(/^\d+\.\s/))) {
          html += `</${listType}>\n`;
          inList = false;
        }
      }
      
      // Only add paragraph break if not followed by a block element
      // Don't add too many breaks for empty lines to reduce spacing
      // Empty lines are already handled by paragraph margins
    }
    // Regular paragraphs
    else {
      html += `<p>${processInlineMarkdown(trimmedLine)}</p>\n`;
    }
  }
  
  // Handle cases where elements are at the end of the markdown
  if (inTable) {
    html += renderTable(tableLines);
  }
  
  if (inCodeBlock) {
    html += renderCodeBlock(codeLines);
  }
  
  if (inList) {
    html += `</${listType}>\n`;
  }
  
  return html;
}

// Function to render a code block with correct styling
function renderCodeBlock(codeLines) {
  if (!codeLines.length) return '';
  
  const language = codeLines.language || '';
  const code = codeLines.join('\n');
  
  // Escape HTML entities in code
  const escapedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  return `<pre><code class="language-${language}">${escapedCode}</code></pre>\n`;
}

// Function to render a markdown table as HTML
function renderTable(tableLines) {
  if (tableLines.length < 3) return ''; // Need at least header, separator, and one data row
  
  const headerLine = tableLines[0];
  const headers = headerLine
    .split('|')
    .filter(cell => cell.trim() !== '')
    .map(cell => processInlineMarkdown(cell.trim()));
  
  let html = '<table>\n<thead>\n<tr>\n';
  headers.forEach(header => {
    html += `<th>${header}</th>\n`;
  });
  html += '</tr>\n</thead>\n<tbody>\n';
  
  // Skip header and separator rows
  for (let i = 2; i < tableLines.length; i++) {
    const rowLine = tableLines[i];
    const cells = rowLine
      .split('|')
      .filter(cell => cell.trim() !== '')
      .map(cell => processInlineMarkdown(cell.trim()));
    
    html += '<tr>\n';
    cells.forEach(cell => {
      html += `<td>${cell}</td>\n`;
    });
    html += '</tr>\n';
  }
  
  html += '</tbody>\n</table>\n';
  return html;
}

// Process inline markdown elements (bold, italic, links, images, code)
function processInlineMarkdown(text) {
  if (!text) return '';
  
  // Process inline code first (so we don't process markdown inside code)
  let processed = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Process images - ![alt text](url "title")
  processed = processed.replace(/!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, (match, alt, url, title) => {
    return `<img src="${url}" alt="${alt || ''}" title="${title || alt || ''}" />`;
  });
  
  // Process links - [text](url "title")
  processed = processed.replace(/\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, (match, text, url, title) => {
    return `<a href="${url}" title="${title || ''}" target="_blank">${text}</a>`;
  });
  
  // Bold - **text** or __text__
  processed = processed.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
  
  // Italic - *text* or _text_
  processed = processed.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
  
  // Strikethrough - ~~text~~
  processed = processed.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  return processed;
}

export default CompleteMarkdownRenderer;