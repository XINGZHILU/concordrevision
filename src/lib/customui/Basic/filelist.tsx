import React from 'react';
import { 
    File, 
    FileSpreadsheet, 
    FileText, 
    FileImage, 
    FileVideo, 
    FileAudio, 
    FileArchive,
    ExternalLink
} from 'lucide-react';

interface FileItemProps {
    id: number;
    filename: string;
    path: string;
}

// Helper function to determine the appropriate icon based on file extension
function getFileIcon(filename: string) {
    const extension = filename.split('.').pop()?.toLowerCase() || '';

    const iconMap: { [key: string]: React.ComponentType } = {
        'pdf': FileText,
        'doc': FileText,
        'docx': FileText,
        'xls': FileSpreadsheet,
        'xlsx': FileSpreadsheet,
        'csv': FileSpreadsheet,
        'jpg': FileImage,
        'jpeg': FileImage,
        'png': FileImage,
        'gif': FileImage,
        'bmp': FileImage,
        'mp3': FileAudio,
        'wav': FileAudio,
        'mp4': FileVideo,
        'avi': FileVideo,
        'mov': FileVideo,
        'zip': FileArchive,
        'rar': FileArchive,
        '7z': FileArchive,
        default: File
    };

    return iconMap[extension] || iconMap.default;
}

// Helper to truncate long filenames with ellipsis in the middle
function truncateFilename(filename: string, maxLength = 30) {
    if (filename.length <= maxLength) return filename;
    
    const extension = filename.includes('.') ? filename.split('.').pop() : '';
    const nameWithoutExt = filename.includes('.') ? 
        filename.substring(0, filename.lastIndexOf('.')) : 
        filename;
    
    if (!extension) return `${nameWithoutExt.substring(0, maxLength - 3)}...`;
    
    const availableChars = maxLength - extension.length - 4; // 4 for "..." and "."
    const start = nameWithoutExt.substring(0, Math.ceil(availableChars / 2));
    const end = nameWithoutExt.substring(nameWithoutExt.length - Math.floor(availableChars / 2));
    
    return `${start}...${end}.${extension}`;
}

export default function FileList({ files }: { files: FileItemProps[] }) {
    if (files.length === 0) {
        return (
            <p className="text-gray-500 text-center py-4">No files available</p>
        );
    }
    
    return (
        <div className="space-y-3">
            {files.map((file) => {
                const FileIcon = getFileIcon(file.filename);
                const displayName = truncateFilename(file.filename);
                
                return (
                    <div key={file.id} className="group">
                        <a
                            href={file.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border border-gray-200 hover:border-indigo-300 rounded-lg hover:bg-indigo-50 transition-all group-hover:shadow-sm"
                            title={file.filename}
                        >
                            <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-md text-indigo-700 mr-3">
                                {/* @ts-expect-error: doesn't exist */}
                                <FileIcon size={20} />
                            </div>
                            
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {displayName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {file.filename.split('.').pop()?.toUpperCase()}
                                </p>
                            </div>
                            
                            <div className="flex-shrink-0 ml-2 text-gray-400 group-hover:text-indigo-600">
                                <ExternalLink size={16} />
                            </div>
                        </a>
                    </div>
                );
            })}
        </div>
    );
}