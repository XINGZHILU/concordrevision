// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client';

import { Toaster, toaster } from "../../../components/ui/toaster";
import { useState, useRef, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { StorageURLNotes } from "@/lib/utils";
import cuid from "cuid";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from 'next/navigation';
import { LuTrash2, LuEye } from "react-icons/lu";

interface EditResourceFormProps {
    noteId: number;
    subjectId: number;
    initialData: {
        title: string;
        description: string;
        files: Array<{
            id: number;
            filename: string;
            path: string;
            type: string;
        }>;
    };
}

/**
 * Form component for editing existing revision resources
 * Allows users to update title, description, and files
 */
export default function EditResourceForm({ noteId, subjectId, initialData }: EditResourceFormProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState<string>(initialData.description || "");
    const titleRef = useRef<HTMLInputElement>(null);
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<number>(0);
    const [existingFiles, setExistingFiles] = useState(initialData.files || []);
    // const [filesToDelete, setFilesToDelete] = useState<number[]>([]); // For future batch operations
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const supabase = createClient();
    const router = useRouter();

    // Set initial title value
    useEffect(() => {
        if (titleRef.current && initialData.title) {
            titleRef.current.value = initialData.title;
        }
    }, [initialData.title]);

    /**
     * Upload new files to storage
     */
    async function uploadNewFiles(files: FileList) {
        const urls = [];
        const names = [];
        
        for (const file of files) {
            const response = await supabase.storage.from('notes-storage').upload(
                cuid() + file.name,
                file,
                {
                    cacheControl: '3600',
                    upsert: false
                }
            );

            if (response.error) {
                throw new Error("Failed to upload files, there is probably a file with the same name");
            }

            urls.push(StorageURLNotes(response.data.path));
            names.push(file.name);
        }

        return { urls, names };
    }

    /**
     * Delete a file
     */
    async function deleteFile(fileId: number) {
        setIsDeleting(fileId);
        
        try {
            const response = await fetch('/api/delete_file', {
                method: 'DELETE',
                body: JSON.stringify({ fileId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete file");
            }

            // Remove file from local state
            setExistingFiles(prev => prev.filter(file => file.id !== fileId));

            toaster.success({
                title: "File deleted",
                description: "The file has been removed successfully",
            });

        } catch (error) {
            console.error('Delete file error:', error);
            toaster.error({
                title: "Delete failed",
                description: error instanceof Error ? error.message : "Failed to delete file",
            });
        } finally {
            setIsDeleting(null);
        }
    }

    /**
     * Update the resource
     */
    async function updateResource(title: string, desc: string, newFileData?: { urls: string[], names: string[] }) {
        const response = await fetch('/api/update_resource', {
            method: 'PUT',
            body: JSON.stringify({
                noteId: noteId,
                title: title,
                desc: desc,
                newFiles: newFileData ? {
                    urls: newFileData.urls,
                    names: newFileData.names
                } : null
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update resource");
        }

        return response.json();
    }

    /**
     * Handle form submission
     */
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setCantUpload(true);

        try {
            const title = titleRef.current?.value || 'No title';
            let newFileData = undefined;

            // Upload new files if any are selected
            if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
                newFileData = await uploadNewFiles(inputFileRef.current.files);
            }

            // Update the resource
            await updateResource(title, description, newFileData);

            toaster.success({
                title: "Successfully updated!",
                description: "Your resource has been updated successfully",
            });

            // Redirect back to the resource after a short delay
            setTimeout(() => {
                router.push(`/revision/${subjectId}/resources/${noteId}`);
            }, 1500);

        } catch (error) {
            console.error('Update error:', error);
            toaster.error({
                title: "Update failed",
                description: error.message || "Something went wrong with the update",
            });
        } finally {
            setCantUpload(false);
        }
    }

    /**
     * Handle file selection
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files.length);
        } else {
            setSelectedFiles(0);
        }
    };

    /**
     * Reset form to initial values
     */
    const handleReset = () => {
        if (titleRef.current) titleRef.current.value = initialData.title;
        if (inputFileRef.current) inputFileRef.current.value = '';
        setSelectedFiles(0);
        setDescription(initialData.description || "");
    };

    return (
        <>
            <Toaster />
            <div className="w-full mx-auto bg-card rounded-lg">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                            Resource Title
                        </label>
                        <input
                            name="title"
                            ref={titleRef}
                            type="text"
                            placeholder="Enter a descriptive title"
                            className="w-full px-4 py-2 border border-input bg-background rounded-md shadow-sm focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                            Resource Description
                        </label>
                        <MDEditor
                            textareaProps={{
                                placeholder: "Describe what this resource covers and how it can be used"
                            }}
                            value={description}
                            height={400}
                            onChange={setDescription}
                            data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                        />
                    </div>

                    {/* Display existing files */}
                    {existingFiles.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Current Files ({existingFiles.length})
                            </label>
                            <div className="bg-muted rounded-lg p-4 border border-border">
                                <div className="space-y-3">
                                    {existingFiles.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between bg-background p-4 rounded-lg border border-border hover:border-primary transition-colors">
                                            <div className="flex items-center flex-1 min-w-0">
                                                <svg className="h-8 w-8 text-destructive mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm font-medium text-foreground truncate">{file.filename}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                <a
                                                    href={file.path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded transition-colors"
                                                    title="View file"
                                                >
                                                    <LuEye className="h-3 w-3 mr-1" />
                                                    View
                                                </a>
                                                <button
                                                    onClick={() => deleteFile(file.id)}
                                                    disabled={isDeleting === file.id}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete file"
                                                >
                                                    {isDeleting === file.id ? (
                                                        <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <LuTrash2 className="h-3 w-3 mr-1" />
                                                    )}
                                                    {isDeleting === file.id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-3 bg-primary/10 p-2 rounded">
                                    💡 <strong>Tip:</strong> You can delete files you no longer need or add new files below.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Upload new files */}
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-foreground mb-1">
                            Add New Files (PDF) - Optional
                        </label>
                        <div className="mt-1 flex justify-center px-6 py-4 border-2 border-border border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-muted-foreground"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-4h-4m4 0v-8"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-muted-foreground">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-card rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                                    >
                                        <span>Upload additional files</span>
                                        <input
                                            id="file-upload"
                                            name="file"
                                            type="file"
                                            className="sr-only"
                                            ref={inputFileRef}
                                            onChange={handleFileChange}
                                            accept=".pdf"
                                            multiple
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-muted-foreground">PDF files only</p>
                                {selectedFiles > 0 && (
                                    <p className="text-sm text-primary font-medium">
                                        {selectedFiles} new file{selectedFiles !== 1 ? 's' : ''} selected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
                        <button
                            type="button"
                            className="px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring ${cantUpload
                                    ? 'bg-primary/50 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90'
                                }`}
                            disabled={cantUpload}
                        >
                            {cantUpload ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {cantUpload ? 'Updating...' : 'Update Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
} 