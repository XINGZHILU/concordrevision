import React from 'react';
import { File, FileSpreadsheet, FileText, FileImage, FileVideo, FileAudio, FileArchive } from 'lucide-react';

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

    return iconMap[extension] || File;
}

export default function FileList({ files }: { files: FileItemProps[] }) {
    return (
        <div className="space-y-4">
            {files.length === 0 ? (
                <p className="text-gray-500 text-center">No files found</p>
            ) : (
                <ul className="grid gap-4">
                    {files.map((file) => {
                        const FileIcon = getFileIcon(file.filename);
                        return (
                            <li key={file.id} className="w-full">
                                <a
                                    href={file.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <FileIcon />
                                    <span className="font-medium text-gray-800 truncate">
                                        {file.filename}
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}