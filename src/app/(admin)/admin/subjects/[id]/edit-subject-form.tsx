'use client';

// File: app/admin/subjects/[id]/edit-subject-form.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { year_group_names } from "@/lib/consts";
import { toaster, Toaster } from "@/components/ui/toaster";

type Subject = {
    id: number;
    title: string;
    desc: string;
    level: number;
    _count: {
        notes: number;
    };
};

interface EditSubjectFormProps {
    subject: Subject;
}

export default function EditSubjectForm({ subject }: EditSubjectFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(subject.title);
    const [description, setDescription] = useState(subject.desc);
    const [level, setLevel] = useState(subject.level);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toaster.error({
                title: "Error",
                description: "Subject title is required"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/subjects`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    desc: description.trim(),
                    level: parseInt(level.toString()),
                    id : subject.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update subject');
            }

            toaster.success({
                title: "Success",
                description: "Subject updated successfully"
            });

            // Navigate back to subjects list after a short delay
            setTimeout(() => {
                router.push('/admin/subjects');
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error('Error updating subject:', error);
            toaster.error({
                title: "Error",
                description: "Failed to update subject. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Toaster />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Subject: {subject.title}</h1>
                <Link
                    href="/admin/subjects"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                {subject._count.notes > 0 && (
                    <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-blue-700">
                                    This subject is associated with <strong>{subject._count.notes}</strong> note{subject._count.notes !== 1 ? 's' : ''}.
                                    Changing the year group may affect where these notes appear.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Physics, Mathematics, Biology"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                            Year Group <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            disabled={true}
                        >
                            {year_group_names.map((name, index) => (
                                <option key={index} value={index}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter a brief description of the subject..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="/admin/subjects"
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors mr-2"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}