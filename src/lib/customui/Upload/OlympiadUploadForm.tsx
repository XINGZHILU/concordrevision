// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client';

import { toaster } from "../../../components/ui/toaster"
import { useState, useRef, useEffect } from 'react';
import { StorageURLOlympiads } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import cuid from "cuid";
import MDEditor from "@uiw/react-md-editor";
import { ImageUploader } from "./upload_image";
import { DialogRoot as Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from 'lucide-react';
import { useEdgeStore } from '../../../lib/edgestore';

export default function OlympiadUploadForm({ olympiad, author }: { olympiad: number, author: string }) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [isImageDialogOpen, setImageDialogOpen] = useState(false);
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    const { edgestore } = useEdgeStore();
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);
    const supabase = createClient();
    const storageKey = `olympiad-form-${olympiad}`;

    useEffect(() => {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
            const { title, description } = JSON.parse(saved);
            setTitle(title || "");
            setDescription(description || "");
        }
    }, [storageKey]);

    useEffect(() => {
        const data = JSON.stringify({ title, description });
        sessionStorage.setItem(storageKey, data);
    }, [title, description, storageKey]);

    async function upload(files: File[], title: string, desc: string) {
        const urls = [];
        const names = [];
        for (const file of files) {
            const response = await supabase.storage.from('olympiads-storage').upload(cuid() + file.name,
                file, {
                cacheControl: '3600',
                upsert: false
            });

            if (response.error) {
                throw new Error("Failed to upload files, there is probably a file with the same name");
            }

            urls.push(StorageURLOlympiads(response.data.path));
            names.push(file.name);
        }

        const response2 = await fetch('/api/upload_olympiad', {
            method: 'POST',
            body: JSON.stringify({
                urls: urls,
                title: title,
                desc: desc,
                olympiad: olympiad,
                author: author,
                names: names
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response2.ok) {
            throw new Error("Failed to update database");
        }
        else {
            if (inputFileRef.current) inputFileRef.current.value = '';
            setStagedFiles([]);
            setDescription("");
            setTitle("");
            sessionStorage.removeItem(storageKey);
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

    const handleInsertImage = (url: string) => {
        const newDescription = `${description || ''}\n![Image](${url})\n`;
        setDescription(newDescription);
        setImageDialogOpen(false); // Close the dialog
    }

    return (
        <div className="w-full max-w-lg mx-auto p-6 bg-card rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">Upload Olympiad Resource</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                        Title
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
                            Description
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
                        height={450}
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

                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-foreground mb-1">
                        Select Files (PDF)
                    </label>
                    {stagedFiles.length > 0 && (
                        <div className="mt-4">
                            <p className="font-semibold text-foreground">{stagedFiles.length} file(s) staged for upload:</p>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {stagedFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <Button
                    onClick={async () => {
                        if (stagedFiles.length === 0) {
                            toaster.error({ title: "No files selected", description: "Please select at least one file to upload." });
                            return;
                        }
                        toaster.promise(upload(stagedFiles, title, description), {
                            success: {
                                title: "Successfully uploaded!",
                                description: "The resource will be available for view after being approved by teachers",
                            },
                            error: {
                                title: "Upload failed",
                                description: "Something went wrong with the upload",
                            },
                            loading: { title: "Uploading...", description: "Please do not leave the page" },
                        })

                        setStagedFiles([]);
                    }}
                    className="w-full"
                    disabled={stagedFiles.length === 0 || !title}
                >
                    Upload Resource
                </Button>
            </form>
        </div>
    );
}