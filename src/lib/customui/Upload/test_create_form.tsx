'use client';

import {Toaster, toaster} from "@/components/ui/toaster"
import {useState, useRef} from 'react';

export default function NewTestForm({subject}: { subject: number }) {
    async function create(title: string, desc: string, type: string, date: string) {

        const response = await fetch('/api/add_test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                desc: desc,
                subject: subject,
                type: type,
                date: date
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to upload");
        }
    }


    //const colourRef = useRef<HTMLSelectElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    return (
        <>
            <Toaster/>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    setCantUpload(true);


                    const title = titleRef.current?.value || 'No title';
                    const desc = descriptionRef.current?.value || '';
                    const type = typeRef.current?.value || '0';
                    const date = dateRef.current?.value || '1970-01-01 00:00:00';


                    toaster.promise(create(title, desc, type, date), {
                        success: {
                            title: "Successfully scheduled test!",
                            description: "The test is now available for others to view",
                        },
                        error: {
                            title: "Scheduling failed",
                            description: "Something went wrong with the upload",
                        },
                        loading: {title: "Uploading...", description: "Please do not leave the page"},
                    })

                    setCantUpload(false);

                }}
            >
                <label htmlFor="title">Test Name:</label>
                <input name="title" ref={titleRef} type="text" placeholder='Test Name'
                       className={'border-2 border-gray-500 w-4/12 '} required/>
                <br/>
                <label htmlFor="description">Information:</label><br/>
                <textarea name="description" placeholder='Information' ref={descriptionRef}
                          className={'w-11/12 h-80 border-2 border-gray-500'}/>
                <br/>
                <label htmlFor="type">Type:</label>
                <select name="type" ref={typeRef} className={'border-2 border-gray-500'} defaultValue={0} required>
                    <option value={0}>Saturday Test</option>
                    <option value={1}>End of Term</option>
                    <option value={2}>Public Exam</option>
                </select>
                <br/>
                <label htmlFor="date">Date:</label>
                <input name="date" ref={dateRef} type="date" className={'border-2 border-gray-500'} required/>
                <br/>
                <button className={'border-solid border-2 border-blue-500'} disabled={cantUpload}>Add</button>
            </form>
        </>
    );
}