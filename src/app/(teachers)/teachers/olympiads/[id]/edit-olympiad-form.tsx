// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';


// File: app/teachers/olympiads/[id]/edit-olympiad-form.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { olympiad_subjects } from "@/lib/consts";
import { toaster} from "@/lib/components/ui/toaster";
import MDEditor from '@uiw/react-md-editor';

type Olympiad = {
    id: number;
    title: string;
    desc: string;
    area: string;
    links: string[];
    link_descriptions: string[];
    _count: {
        resources: number;
    };
};

interface EditOlympiadFormProps {
    olympiad: Olympiad;
}

export default function EditOlympiadForm({ olympiad }: EditOlympiadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(olympiad.title);
    const [description, setDescription] = useState(olympiad.desc);
    const [area, setArea] = useState(olympiad.area);
    const [links, setLinks] = useState<string[]>(olympiad.links || []);
    const [linkDescriptions, setLinkDescriptions] = useState<string[]>(olympiad.link_descriptions || []);
    const [newLink, setNewLink] = useState('');
    const [newLinkDescription, setNewLinkDescription] = useState('');

    const router = useRouter();

    // Add a new link to the array
    const addLink = () => {
        if (!newLink.trim()) return;

        setLinks([...links, newLink.trim()]);
        setLinkDescriptions([...linkDescriptions, newLinkDescription.trim()]);
        setNewLink('');
        setNewLinkDescription('');
    };

    // Remove a link by index
    const removeLink = (indexToRemove: number) => {
        setLinks(links.filter((_, index) => index !== indexToRemove));
        setLinkDescriptions(linkDescriptions.filter((_, index) => index !== indexToRemove));
    };

    // Update link description at index
    const updateLinkDescription = (index: number, value: string) => {
        const newDescriptions = [...linkDescriptions];
        newDescriptions[index] = value;
        setLinkDescriptions(newDescriptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toaster.error({
                title: "Error",
                description: "Olympiad title is required"
            });
            return;
        }

        if (!area) {
            toaster.error({
                title: "Error",
                description: "Subject area is required"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/teachers/olympiads/${olympiad.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    desc: description.trim(),
                    area,
                    links,
                    link_descriptions: linkDescriptions,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update olympiad');
            }

            toaster.success({
                title: "Success",
                description: "Olympiad updated successfully"
            });

            // Navigate back to olympiads list after a short delay
            setTimeout(() => {
                router.push('/teachers/olympiads');
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error('Error updating olympiad:', error);
            toaster.error({
                title: "Error",
                description: "Failed to update olympiad. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Olympiad: {olympiad.title}</h1>
                <Link
                    href="/teachers/olympiads"
                    className="px-4 py-2 bg-muted rounded hover:bg-accent transition-colors"
                >
                    Cancel
                </Link>
            </div>

            <div className="bg-card shadow-md rounded-lg p-6">
                {olympiad._count.resources > 0 && (
                    <div className="mb-6 bg-primary/10 p-4 rounded-md border border-primary/20">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-primary/80">
                                    This olympiad has <strong>{olympiad._count.resources}</strong> resource{olympiad._count.resources !== 1 ? 's' : ''} associated with it.
                                    Changing the subject area may affect where these resources appear.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                            Olympiad Title <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                            placeholder="e.g., International Physics Olympiad, International Mathematical Olympiad"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="area" className="block text-sm font-medium text-foreground mb-1">
                            Subject Area <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                            required
                        >
                            {olympiad_subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
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

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-1">
                            External Links
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                            <div className="md:col-span-2">
                                <input
                                    type="url"
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                    className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    value={newLinkDescription}
                                    onChange={(e) => setNewLinkDescription(e.target.value)}
                                    className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                                    placeholder="Link description (optional)"
                                />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={addLink}
                                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {links.length > 0 && (
                            <div className="mt-3 bg-muted p-3 rounded-md border border-border">
                                <h3 className="text-sm font-medium text-foreground mb-2">Added Links</h3>
                                <ul className="divide-y divide-border">
                                    {links.map((link, index) => (
                                        <li key={index} className="py-3">
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                                <div className="md:col-span-2">
                                                    <a
                                                        href={link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary hover:underline block truncate"
                                                    >
                                                        {link}
                                                    </a>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <input
                                                        type="text"
                                                        value={linkDescriptions[index] || ''}
                                                        onChange={(e) => updateLinkDescription(index, e.target.value)}
                                                        className="w-full p-1 text-sm border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                                                        placeholder="Add description"
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLink(index)}
                                                        className="text-destructive hover:text-destructive/80 p-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="/teachers/olympiads"
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

