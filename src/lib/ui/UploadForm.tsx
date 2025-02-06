'use client';

import { useState, useRef } from 'react';

export default function UploadForm({ subject, author }: { subject: number, author: string }) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    //const colourRef = useRef<HTMLSelectElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<string>("Waiting for file to be selected");
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    return (
        <>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    if (!inputFileRef.current?.files) {
                        throw new Error("No file selected");
                    }

                    setCantUpload(true);


                    setStatus("Uploading...");
                    const file = inputFileRef.current.files[0];
                    const title = titleRef.current?.value;
                    const desc = descriptionRef.current?.value;
                    //const colour = colourRef.current?.value;

                    const response = await fetch(`/api/upload?filename=${file.name}&subject=${subject}&title=${title}&author=${author}&desc=${desc}`, {
                        method: 'POST',
                        body: file
                    });

                    if (response.ok) {
                        setStatus("Upload finished");

                    }
                    else {
                        setStatus("Upload failed");
                        setCantUpload(false);
                    }

                }}
            >
                <label htmlFor="title">Note Title:</label>
                <input name="title" ref={titleRef} type="text" placeholder='Note Title' className={'border-2 border-gray-500 w-4/12 '} required />
                <br />
                <label htmlFor="description">Note Description:</label><br/>
                <textarea name="description" placeholder='Note Description' ref={descriptionRef} className={'w-11/12 h-80 border-2 border-gray-500'} required />
                <br />
                <label htmlFor="file">Select a file:</label>
                <input name="file" ref={inputFileRef} type="file" accept='.pdf' required />
                <br />
                <button className={'border-solid border-2 border-blue-500'} disabled={cantUpload}>Upload</button>
            </form>
            <h5>{status}</h5>
        </>
    );
}