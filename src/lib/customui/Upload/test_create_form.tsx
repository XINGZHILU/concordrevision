// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client';

import { Toaster, toaster } from "@/components/ui/toaster"
import { useState, useRef } from 'react';
import MDEditor from "@uiw/react-md-editor";

export default function NewTestForm({ subject }: { subject: number }) {
    const [description, setDescription] = useState<string>("");
    const titleRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const [cantUpload, setCantUpload] = useState<boolean>(false);

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
        else {
            if (titleRef.current) titleRef.current.value = '';
            setDescription('');
            if (typeRef.current) typeRef.current.value = '0';
            if (dateRef.current) dateRef.current.value = '';
        }
    }



    // Calculate minimum date (today) for the date picker
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Toaster />
            <div className="w-full mx-auto bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Schedule a New Test</h2>
                    <p className="text-gray-600 mt-1">Create a new test and provide details for students</p>
                </div>

                <form
                    className="space-y-6"
                    onSubmit={async (event) => {
                        event.preventDefault();

                        setCantUpload(true);

                        const title = titleRef.current?.value || 'No title';
                        const type = typeRef.current?.value || '0';
                        const date = dateRef.current?.value || '1970-01-01 00:00:00';

                        toaster.promise(create(title, description, type, date), {
                            success: {
                                title: "Successfully scheduled test!",
                                description: "The test is now available for others to view",
                            },
                            error: {
                                title: "Scheduling failed",
                                description: "Something went wrong with the upload",
                            },
                            loading: { title: "Creating test...", description: "Please do not leave the page" },
                        })

                        setCantUpload(false);
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Test Name
                            </label>
                            <input
                                name="title"
                                ref={titleRef}
                                type="text"
                                placeholder="Enter test name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                Test Type
                            </label>
                            <select
                                name="type"
                                ref={typeRef}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                defaultValue="0"
                                required
                            >
                                <option value="0">Saturday Test</option>
                                <option value="1">End of Term Exam</option>
                                <option value="2">Public Exam</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Test Date
                            </label>
                            <input
                                name="date"
                                ref={dateRef}
                                type="date"
                                min={today}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Select a date for the test (must be today or later)
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Test Information
                        </label>
                        <MDEditor
                            textareaProps={{
                                placeholder: "Provide details about this test (topics covered, preparation guidance, etc.)"
                            }}
                            value={description}
                            height={450}
                            onChange={setDescription}
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                                if (titleRef.current) titleRef.current.value = '';
                                setDescription('');
                                if (typeRef.current) typeRef.current.value = '0';
                                if (dateRef.current) dateRef.current.value = '';
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${cantUpload
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
                            {cantUpload ? 'Creating...' : 'Schedule Test'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}