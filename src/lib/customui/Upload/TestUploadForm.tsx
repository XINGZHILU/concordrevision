// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client';

import { useState, useRef } from 'react';
import { StorageURLNotes } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import cuid from "cuid";
import MDEditor from "@uiw/react-md-editor";
import { ImageUploader } from "./upload_image";
import { DialogRoot as Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEdgeStore } from '../../../lib/edgestore';

export default function TestUploadForm({ subject, author, test, type }: { subject: number, author: string, test: number, type: number }) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState<string>("");
    const [isImageDialogOpen, setImageDialogOpen] = useState(false);
    const titleRef = useRef<HTMLInputElement>(null);
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<number>(0);
    const supabase = createClient();
    const { edgestore } = useEdgeStore();

    async function upload(files: FileList, title: string, desc: string) {
        const urls = [];
        const names = [];
        for (const file of files) {
            const response = await supabase.storage.from('notes-storage').upload(cuid() + file.name,
                file, {
                cacheControl: '3600',
                upsert: false
            });

            if (response.error) {
                throw new Error("Failed to upload files, there is probably a file with the same name");
            }

            urls.push(StorageURLNotes(response.data.path));
            names.push(file.name);
        }

        const response2 = await fetch('/api/add_test_notes', {
            method: 'POST',
            body: JSON.stringify({
                urls: urls,
                names: names,
                title: title,
                desc: desc,
                subject: subject,
                author: author,
                type: type,
                test: test
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response2.ok) {
            throw new Error("Failed to update database");
        }
        else {
            if (titleRef.current) titleRef.current.value = '';
            if (inputFileRef.current) inputFileRef.current.value = '';
            setSelectedFiles(0);
            setDescription("");
        }
    }



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files.length);
        } else {
            setSelectedFiles(0);
        }
    };

    const handleInsertImage = (url: string) => {
        const newDescription = `${description || ''}\n![Image](${url})\n`;
        setDescription(newDescription);
        setImageDialogOpen(false); // Close the dialog
    }

    // Function to get type name for display
    const getTypeName = () => {
        switch (type) {
            /*
            case 0: return "Practice Question";
            case 1: return "Sample Test";
            case 2: return "Study Guide";
            default: return "Test Material";
            */
            case 3: return "Test Material";
            default: return "Revision Resources"
        }
    };

    return (
        <div className="w-full mx-auto bg-card rounded-lg shadow p-6">
            <div className="mb-6">
                <Label htmlFor="title" className="block text-lg font-medium text-foreground mb-2">
                    Material Title
                </Label>
                <Input
                    id="title"
                    name="title"
                    ref={titleRef}
                    type="text"
                    placeholder="Enter a descriptive title"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md shadow-sm focus:ring-2 focus:ring-ring"
                    required
                />
            </div>

            <div>
                <Label htmlFor="description" className="block text-sm font-medium text-foreground">
                    Description
                </Label>
                <Button variant="outline" type="button" onClick={() => setImageDialogOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6 4H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2z" />
                    </svg>
                    Add Image
                </Button>
                <MDEditor
                    textareaProps={{
                        placeholder: "Explain what topics are covered, difficulty level, and any instructions for students"
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
                <Label htmlFor="file" className="block text-sm font-medium text-foreground mb-1">
                    Select Files (PDF)
                </Label>
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
                                <span>Upload files</span>
                                <input
                                    id="file-upload"
                                    name="file"
                                    type="file"
                                    className="sr-only"
                                    ref={inputFileRef}
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                    required
                                    multiple
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">PDF files only</p>
                        {selectedFiles > 0 && (
                            <p className="text-sm text-primary font-medium">
                                {selectedFiles} file{selectedFiles !== 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end">
                <Button
                    type="button"
                    className="mr-4 px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    onClick={() => {
                        if (titleRef.current) titleRef.current.value = '';
                        if (inputFileRef.current) inputFileRef.current.value = '';
                        setSelectedFiles(0);
                        setDescription("");
                    }}
                >
                    Reset
                </Button>
                <Button
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
                    {cantUpload ? 'Uploading...' : 'Upload Materials'}
                </Button>
            </div>
        </div>
    );
}