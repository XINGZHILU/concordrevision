// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client';

import { Toaster, toaster } from "@/components/ui/toaster"
import { useState, useRef } from 'react';
import { StorageURLNotes } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import cuid from "cuid";
import MDEditor from "@uiw/react-md-editor";

export default function TestUploadForm({ subject, author, test, type }: { subject: number, author: string, test: number, type: number }) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState<string>("");
    const titleRef = useRef<HTMLInputElement>(null);
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<number>(0);
    const supabase = createClient();

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
    }

    

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files.length);
        } else {
            setSelectedFiles(0);
        }
    };

    // Function to get type name for display
    const getTypeName = () => {
        switch(type) {
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
        <>
            <Toaster />
            <div className="w-full mx-auto bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Upload Test Materials</h2>
                    <p className="text-gray-600 mt-1">
                        Share {getTypeName().toLowerCase()} for test preparation
                    </p>
                </div>

                <form
                    className="space-y-6"
                    onSubmit={async (event) => {
                        event.preventDefault();

                        if (!inputFileRef.current?.files) {
                            throw new Error("No file selected");
                        }

                        setCantUpload(true);

                        const files = inputFileRef.current.files;
                        if (!files) {
                            return;
                        }
                        const title = titleRef.current?.value || 'No title';

                        toaster.promise(upload(files, title, description), {
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

                        setCantUpload(false);
                    }}
                >
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Material Title
                        </label>
                        <input
                            name="title"
                            ref={titleRef}
                            type="text"
                            placeholder="Enter a descriptive title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <MDEditor
                            textareaProps={{
                                placeholder: "Explain what topics are covered, difficulty level, and any instructions for students"
                            }}
                            value={description}
                            height={450}
                            onChange={setDescription}
                        />
                    </div>

                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Files (PDF)
                        </label>
                        <div className="mt-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
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
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
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
                                <p className="text-xs text-gray-500">PDF files only</p>
                                {selectedFiles > 0 && (
                                    <p className="text-sm text-indigo-600 font-medium">
                                        {selectedFiles} file{selectedFiles !== 1 ? 's' : ''} selected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                                if (titleRef.current) titleRef.current.value = '';
                                if (descriptionRef.current) descriptionRef.current.value = '';
                                if (inputFileRef.current) inputFileRef.current.value = '';
                                setSelectedFiles(0);
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                cantUpload
                                    ? 'bg-indigo-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                            disabled={cantUpload}
                        >
                            {cantUpload ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {cantUpload ? 'Uploading...' : 'Upload Materials'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}