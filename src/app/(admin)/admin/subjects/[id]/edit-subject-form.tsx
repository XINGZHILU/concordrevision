'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { year_group_names } from "@/lib/consts";
import { toaster} from "@/components/ui/toaster";
import MDEditor from '@uiw/react-md-editor';

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
    const [description, setDescription] = useState(subject.desc);

    // const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/admin/subjects', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    desc: description.trim(),
                    id: subject.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save subject');
            }

            toaster.success({
                title: 'Subject Saved',
                description: `The description for ${subject.title} has been updated.`,
            });
            // router.push('/admin/subjects');
        } catch (error) {
            toaster.error({
                title: 'Save Failed',
                description: (error as Error).message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Subject: {year_group_names[subject.level]} {subject.title}</h1>
                <Link
                    href="/admin/subjects"
                    className="px-4 py-2 bg-muted rounded hover:bg-accent transition-colors"
                >
                    Back to subjects page
                </Link>
            </div>

            <div className="bg-card shadow-md rounded-lg p-6">
                {subject._count.notes > 0 && (
                    <div className="mb-6 bg-primary/10 p-4 rounded-md border border-primary/20">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-primary/80">
                                    This subject is associated with <strong>{subject._count.notes}</strong> note{subject._count.notes !== 1 ? 's' : ''}.
                                    Changing the year group may affect where these notes appear.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>


                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                            Description
                        </label>
                        <MDEditor
                            textareaProps={{
                                placeholder: "Please enter Markdown text"
                            }}
                            value={description}
                            height={450}
                            onChange={setDescription}
                            data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="/admin/subjects"
                            className="px-4 py-2 bg-muted rounded hover:bg-accent transition-colors mr-2"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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