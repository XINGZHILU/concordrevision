'use client';

import { toaster } from '@/lib/components/ui/toaster';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { StorageURLOlympiads } from "@/lib/utils";
import cuid from "cuid";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from 'next/navigation';
import { LuTrash2, LuEye } from "react-icons/lu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/lib/components/ui/dialog';
import { Button } from '@/lib/components/ui/button';
import { XIcon } from "lucide-react";
import { ImageUploader } from "@/lib/customui/Upload/upload_image";

interface EditOlympiadResourceFormProps {
    resourceId: number;
    olympiadId: number;
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

export default function EditOlympiadResourceForm({ resourceId, olympiadId, initialData }: EditOlympiadResourceFormProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState<string>(initialData.title || "");
    const [description, setDescription] = useState<string>(initialData.description || "");
    const [isImageDialogOpen, setImageDialogOpen] = useState(false);
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState(initialData.files || []);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const supabase = createClient();
    const router = useRouter();
    const storageKey = `edit-olympiad-resource-form-${resourceId}`;

    useEffect(() => {
        const savedData = sessionStorage.getItem(storageKey);
        if (savedData) {
            const { title: savedTitle, description: savedDescription } = JSON.parse(savedData);
            setTitle(savedTitle);
            setDescription(savedDescription);
        }
    }, [storageKey]);

    useEffect(() => {
        const data = JSON.stringify({ title, description });
        sessionStorage.setItem(storageKey, data);
    }, [title, description, storageKey]);


    const handleInsertImage = (url: string) => {
        const newDescription = `${description || ''}\n![Image](${url})\n`;
        setDescription(newDescription);
        setImageDialogOpen(false);
    }

    async function uploadNewFiles(files: File[]) {
        const urls: string[] = [];
        const names: string[] = [];
        
        for (const file of files) {
            const response = await supabase.storage.from('olympiads-storage').upload(
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

            urls.push(StorageURLOlympiads(response.data.path));
            names.push(file.name);
        }

        return { urls, names };
    }

    async function deleteFile(fileId: number) {
        setIsDeleting(fileId);
        
        try {
            const response = await fetch('/api/olympiads/files/' + fileId, {
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

    async function updateResource(title: string, desc: string, newFileData?: { urls: string[], names: string[] }) {
        const response = await fetch('/api/olympiads/resources/' + resourceId, {
            method: 'PUT',
            body: JSON.stringify({
                resourceId: resourceId,
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

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setCantUpload(true);

        try {
            let newFileData: { urls: string[], names: string[] } | undefined = undefined;

            // Upload new files if any are selected
            if (stagedFiles.length > 0) {
                newFileData = await uploadNewFiles(stagedFiles);
            }

            // Update the resource
            await updateResource(title, description, newFileData);

            toaster.success({
                title: "Successfully updated!",
                description: "Your resource has been updated successfully",
            });

            // Clear session storage on successful update
            sessionStorage.removeItem(storageKey);

            // Redirect back to the resource after a short delay
            setTimeout(() => {
                router.push(`/olympiads/${olympiadId}/resources/${resourceId}`);
            }, 1500);

        } catch (error) {
            console.error('Update error:', error);
            const errorMessage = error instanceof Error ? error.message : "Something went wrong with the update";
            toaster.error({
                title: "Update failed",
                description: errorMessage,
            });
        } finally {
            setCantUpload(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setStagedFiles(prevFiles => {
                const existingFileNames = prevFiles.map(f => f.name);
                const uniqueNewFiles = newFiles.filter(f => !existingFileNames.includes(f.name));
                return [...prevFiles, ...uniqueNewFiles];
            });
        }
    };

    const removeStagedFile = (fileName: string) => {
        setStagedFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
        if (inputFileRef.current) {
            inputFileRef.current.value = "";
        }
    }

    const handleReset = () => {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        if (inputFileRef.current) inputFileRef.current.value = '';
        setStagedFiles([]);
        sessionStorage.removeItem(storageKey);
    };

    return (
        <div className="w-full mx-auto bg-card rounded-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                        Resource Title
                    </label>
                    <input
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Enter a descriptive title"
                        className="w-full px-4 py-2 border border-input bg-background rounded-md shadow-sm focus:ring-2 focus:ring-ring"
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="description" className="block text-sm font-medium text-foreground">
                            Resource Description
                        </label>
                        <Button variant="outline" type="button" onClick={() => setImageDialogOpen(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6 4H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2z" />
                            </svg>
                            Add Image
                        </Button>
                    </div>
                    <MDEditor
                        textareaProps={{
                            placeholder: "Describe what this resource covers and how it can be used"
                        }}
                        value={description}
                        height={400}
                        onChange={(value) => setDescription(value || "")}
                        data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                    />
                    <Dialog open={isImageDialogOpen} onOpenChange={setImageDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload an Image</DialogTitle>
                            </DialogHeader>
                            <ImageUploader onUploadFinished={handleInsertImage} />
                        </DialogContent>
                    </Dialog>
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
                    {stagedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {stagedFiles.map(file => (
                                <div key={file.name} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                    <span className="text-sm text-muted-foreground truncate">{file.name}</span>
                                    <Button variant="ghost" size="icon" onClick={() => removeStagedFile(file.name)}>
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4 flex justify-center px-6 py-4 border-2 border-border border-dashed rounded-md">
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
                            {stagedFiles.length > 0 && (
                                <p className="text-sm text-primary font-medium">
                                    {stagedFiles.length} new file{stagedFiles.length !== 1 ? 's' : ''} selected
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
                        onClick={() => {
                            sessionStorage.removeItem(storageKey);
                            router.back();
                        }}
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
    );
} 