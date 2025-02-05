'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';

export default function UploadForm({subject, author} : {subject : number, author : string}) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<string>("Waiting for file to be selected");
    return (
        <>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    if (!inputFileRef.current?.files) {
                        throw new Error("No file selected");
                    }


                    setStatus("Uploading...");
                    const file = inputFileRef.current.files[0];
                    const title = titleRef.current?.value;

                    const response = await fetch(`/api/upload?filename=${file.name}&subject=${subject}&title=${title}&author=${author}`, {
                        method: 'POST',
                        body: file
                    });

                    if (response.ok){
                        setStatus("Upload finished");
                    }
                    else{
                        setStatus("Upload failed");
                    }
                }}
            >
                <input name="title" ref={titleRef} type="text" placeholder='Note Title' required />
                <br></br>
                <input name="file" ref={inputFileRef} type="file" accept='.pdf' required />
                <button type="submit">Upload</button>
            </form>
            <h2>{status}</h2>
        </>
    );
}