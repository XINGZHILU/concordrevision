'use client';

import {Toaster, toaster} from "@/components/ui/toaster"
import { useState, useRef } from 'react';
import cuid from "cuid";
import {StorageURLOlympiads} from "@/lib/utils";
import {createClient} from "@/utils/supabase/client";

export default function OlympiadUploadForm({ olympiad, author }: { olympiad: number, author: string}) {
    async function upload(file: File, title: string, desc: string) {
        const response = await supabase.storage.from('olympiads-storage').upload(file.name.replace(' ', '_').substring(0, file.name.length-4)+cuid()+'.pdf',
            file, {
                cacheControl: '3600',
                upsert: false
            });

        if (response.error) {
            throw new Error("Failed to upload file");
        }

        const url = StorageURLOlympiads(response.data.path);

        const response2 = await fetch('/api/upload_olympiad', {
            method: 'POST',
            body: JSON.stringify({
                url: url,
                title: title,
                desc: desc,
                olympiad: olympiad,
                author: author,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response2.ok) {
            throw new Error("Failed to update database");
        }
    }


    const inputFileRef = useRef<HTMLInputElement>(null);
    //const colourRef = useRef<HTMLSelectElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    const supabase = createClient();
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
                            description: "Something went wrong with the upload",
                        },
                        loading: {title: "Uploading...", description: "Please do not leave the page"},
                    })

                    setCantUpload(false);

                }}
            >
                <label htmlFor="title">Title:</label>
                <input name="title" ref={titleRef} type="text" placeholder='Note Title' className={'border-2 border-gray-500 w-4/12 '} required />
                <br />
                <label htmlFor="description">Description:</label><br/>
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