'use client';

import { useState, useRef } from 'react';

export default function UploadForm({subject, author} : {subject : number, author : string}) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
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
                    const desc = descriptionRef.current?.value;

                    const response = await fetch(`/api/upload?filename=${file.name}&subject=${subject}&title=${title}&author=${author}&desc=${desc}`, {
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
                <label htmlFor="title">Note Title:</label>
                <input name="title" ref={titleRef} type="text" placeholder='Note Title' required />
                <br/>
                <label htmlFor="description">Note Description:</label>
                <input name="description" type="text" placeholder='Note Description' ref={descriptionRef} required />
                <br/>
                <label htmlFor="file">Select a file:</label>
                <input name="file" ref={inputFileRef} type="file" accept='.pdf' required />
                <br/>
                <button>Upload</button>
            </form>
            <h5>{status}</h5>
        </>
    );
}