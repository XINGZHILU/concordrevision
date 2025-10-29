'use client';

import { useState } from 'react';
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/lib/components/ui/button";
import { useToast } from "@/lib/components/ui/use-toast";
import { Input } from "@/lib/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/lib/components/ui/accordion";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { UCASSubject, Tag, University, UCASPost, StorageFile } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { XIcon } from 'lucide-react';
import { createClient } from "@/lib/utils/supabase/client";
import cuid from 'cuid';
import { StorageURLNotes } from '@/lib/utils';

type UCASPostWithFiles = UCASPost & { files: StorageFile[] };

export function EditUCASPostForm({ post, tags, universities, ucasSubjects }: { 
    post: UCASPostWithFiles,
    tags: Tag[],
    universities: University[], 
    ucasSubjects: UCASSubject[] 
}) {
    const router = useRouter();
    const [content, setContent] = useState<string>(post.content);
    const [title, setTitle] = useState<string>(post.title);
    const { toast } = useToast();
    const [cantUpload, setCantUpload] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<StorageFile[]>(post.files);

    const [selectedTags, setSelectedTags] = useState<string[]>(post.tags);
    const [selectedUniversities, setSelectedUniversities] = useState<string[]>(post.universities);
    const [selectedUCASSubjects, setSelectedUCASSubjects] = useState<string[]>(post.ucasSubjects);
    const [universitySearch, setUniversitySearch] = useState('');
    const [subjectSearch, setSubjectSearch] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const newFiles = Array.from(e.target.files);
          setStagedFiles(prevFiles => {
            const existingFileNames = prevFiles.map(f => f.name);
            const uniqueNewFiles = newFiles.filter(f => !existingFileNames.includes(f.name));
            return [...prevFiles, ...uniqueNewFiles];
          });
        }
    };
    
    const removeStagedFile = (fileName: string) => {
        setStagedFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
        if (inputFileRef.current) {
            inputFileRef.current.value = "";
        }
    }

    const removeExistingFile = (fileId: number) => {
        setExistingFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
    }


    async function handleUpdate(event: React.FormEvent) {
        event.preventDefault();
        setCantUpload(true);
        toast({ title: "Updating...", description: "Please do not leave the page" });

        try {
            const supabase = createClient();
            const uploadedFiles: { url: string, name: string, type: string }[] = [];
            for (const file of stagedFiles) {
                const response = await supabase.storage.from('notes-storage').upload(cuid() + file.name,
                  file, {
                  cacheControl: '3600',
                  upsert: false
                });
        
                if (response.error) {
                  throw new Error("Failed to upload files, there is probably a file with the same name");
                }
        
                uploadedFiles.push({ url: StorageURLNotes(response.data.path), name: file.name, type: file.type });
            }

            const response = await fetch(`/api/ucas/posts/${post.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: title,
                    content: content,
                    tags: selectedTags,
                    universities: selectedUniversities,
                    ucasSubjects: selectedUCASSubjects,
                    newFiles: uploadedFiles,
                    deletedFiles: post.files.filter(f => !existingFiles.some(ef => ef.id === f.id)).map(f => f.id)
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Failed to update post");
            }

            toast({
                title: "Successfully updated!",
                description: "The post has been updated.",
            });
            
            router.push(`/ucas/posts/${post.id}`);
            router.refresh();

        } catch (error: unknown) {
            let message = "Something went wrong with the update";
            if (error instanceof Error) {
                message = error.message;
            }
            toast({
                title: "Update failed",
                description: message,
                variant: "destructive"
            });
        } finally {
            setCantUpload(false);
        }
    }

    /**
     * Handle checkbox change for selecting tags, universities, or subjects
     * @param setter - State setter function
     * @param value - Value to add or remove
     */
    const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
    }

    return (
        <form className="space-y-6" onSubmit={handleUpdate}>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                    Post Title
                </label>
                <Input
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="Enter a descriptive title"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md shadow-sm focus:ring-2 focus:ring-ring"
                    required
                />
            </div>

            <Accordion type="multiple" className="w-full" defaultValue={['tags', 'universities', 'ucasSubjects']}>
                <AccordionItem value="tags">
                    <AccordionTrigger>Tags (Optional)</AccordionTrigger>
                    <AccordionContent className="max-h-60 overflow-y-auto">
                        {tags.map(tag => (
                            <label key={tag.id} className="flex items-center space-x-2 my-2 cursor-pointer">
                                <Checkbox
                                    id={`tag-${tag.id}`}
                                    checked={selectedTags.includes(tag.name)}
                                    onChange={() => handleCheckboxChange(setSelectedTags, tag.name)}
                                />
                                <span>{tag.name}</span>
                            </label>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="universities">
                    <AccordionTrigger>Universities (Optional)</AccordionTrigger>
                    <AccordionContent className="max-h-60 overflow-y-auto">
                        <Input
                            placeholder="Search universities..."
                            value={universitySearch}
                            onChange={(e) => setUniversitySearch(e.target.value)}
                            className="mb-4"
                        />
                        {universities.filter(uni => uni.name.toLowerCase().includes(universitySearch.toLowerCase())).map(uni => (
                            <label key={uni.id} className="flex items-center space-x-2 my-2 cursor-pointer">
                                <Checkbox
                                    id={`uni-${uni.id}`}
                                    checked={selectedUniversities.includes(uni.id)}
                                    onChange={() => handleCheckboxChange(setSelectedUniversities, uni.id)}
                                />
                                <span>{uni.name}</span>
                            </label>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ucasSubjects">
                    <AccordionTrigger>UCAS Subjects (Optional)</AccordionTrigger>
                    <AccordionContent className="max-h-60 overflow-y-auto">
                        <Input
                            placeholder="Search UCAS subjects..."
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                            className="mb-4"
                        />
                        {ucasSubjects.filter(subject => subject.name.toLowerCase().includes(subjectSearch.toLowerCase())).map(subject => (
                            <label key={subject.id} className="flex items-center space-x-2 my-2 cursor-pointer">
                                <Checkbox
                                    id={`ucasSubject-${subject.id}`}
                                    checked={selectedUCASSubjects.includes(subject.id)}
                                    onChange={() => handleCheckboxChange(setSelectedUCASSubjects, subject.id)}
                                />
                                <span>{subject.name}</span>
                            </label>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="content" className="block text-sm font-medium text-foreground">
                        Post Content
                    </label>
                </div>
                <MDEditor
                    textareaProps={{
                        placeholder: "Share your thoughts, advice, or questions..."
                    }}
                    value={content}
                    height={450}
                    onChange={(value) => setContent(value || "")}
                    data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                />
            </div>

            <div>
                <label htmlFor="file" className="block text-sm font-medium text-foreground mb-1">
                    Attach Files
                </label>
                {existingFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-foreground">Existing files:</p>
                        {existingFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <a href={file.path} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground truncate hover:underline">{file.filename}</a>
                            <Button variant="ghost" size="icon" onClick={() => removeExistingFile(file.id)}>
                            <XIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        ))}
                    </div>
                )}

                {stagedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">New files to upload:</p>
                    {stagedFiles.map(file => (
                    <div key={file.name} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm text-muted-foreground truncate">{file.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeStagedFile(file.name)}>
                        <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    ))}
                </div>
                )}
                <div className="mt-4 flex justify-center px-6 py-4 border-2 border-border border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg
                    className="mx-auto h-12 w-12 text-muted-foreground"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                    >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-4h-4m4 0v-8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    <div className="flex text-sm text-muted-foreground">
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-card rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                    >
                        <span>Upload new files</span>
                        <input
                        id="file-upload"
                        name="file"
                        type="file"
                        className="sr-only"
                        ref={inputFileRef}
                        onChange={handleFileChange}
                        multiple
                        />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Any file type</p>
                </div>
                </div>
            </div>

            <div className="flex items-center justify-end">
                <Button
                    type="submit"
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring ${cantUpload
                            ? 'bg-primary/50 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary/90'
                        }`}
                    disabled={cantUpload}
                >
                    {cantUpload ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : null}
                    {cantUpload ? 'Updating...' : 'Update Post'}
                </Button>
            </div>
        </form>
    );
} 