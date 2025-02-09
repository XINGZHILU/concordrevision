'use client';

import {Toaster, toaster} from "@/components/ui/toaster"
import { useState, useRef } from 'react';

export default function TestUploadForm({ subject, author, test, type }: { subject: number, author: string, test: number, type: number }) {
    async function upload(file: File, title: string, desc: string ) {
        const response = await fetch(`/api/upload_test_notes?filename=${file.name}&subject=${subject}&title=${title}&author=${author}&desc=${desc}&test=${test}&type=${type}`, {
            method: 'POST',
            body: file
        });
        if (!response.ok) {
            throw new Error("Failed to upload");
        }
    }


    const inputFileRef = useRef<HTMLInputElement>(null);
    //const colourRef = useRef<HTMLSelectElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    return (
        <>
            <Toaster/>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    if (!inputFileRef.current?.files) {
                        throw new Error("No file selected");
                    }

                    setCantUpload(true);


                    const file = inputFileRef.current.files[0];
                    const title = titleRef.current?.value || 'No title';
                    const desc = descriptionRef.current?.value || '';

                    //const colour = colourRef.current?.value;

                    toaster.promise(upload(file, title, desc), {
                        success: {
                            title: "Successfully uploaded!",
                            description: "The resource is now available for others to view",
                        },
                        error: {
                            title: "Upload failed",
                            description: "Something wrong with the upload",
                        },
                        loading: {title: "Uploading...", description: "Please wait"},
                    })

                    setCantUpload(false);

                }}
            >
                <label htmlFor="title">Note Title:</label>
                <input name="title" ref={titleRef} type="text" placeholder='Note Title' className={'border-2 border-gray-500 w-4/12 '} required />
                <br />
                <label htmlFor="description">Note Description:</label><br/>
                <textarea name="description" placeholder='Note Description' ref={descriptionRef} className={'w-11/12 h-80 border-2 border-gray-500'}/>
                <br />
                <label htmlFor="file">Select a file:</label>
                <input name="file" ref={inputFileRef} type="file" accept='.pdf' required />
                <br />
                <button className={'border-solid border-2 border-blue-500'} disabled={cantUpload}>Upload</button>
            </form>
        </>
    );
}