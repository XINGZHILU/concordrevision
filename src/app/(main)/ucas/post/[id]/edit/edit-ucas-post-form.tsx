'use client';

import { useState } from 'react';
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Course, Tag, University, UCASPost } from '@prisma/client';
import { useRouter } from 'next/navigation';

export function EditUCASPostForm({ post, tags, universities, courses }: { 
    post: UCASPost,
    tags: Tag[],
    universities: University[], 
    courses: Course[] 
}) {
    const router = useRouter();
    const [content, setContent] = useState<string>(post.content);
    const [title, setTitle] = useState<string>(post.title);
    const { toast } = useToast();
    const [cantUpload, setCantUpload] = useState<boolean>(false);

    const [selectedTags, setSelectedTags] = useState<string[]>(post.tags);
    const [selectedUniversities, setSelectedUniversities] = useState<string[]>(post.universities);
    const [selectedCourses, setSelectedCourses] = useState<string[]>(post.courses);
    const [universitySearch, setUniversitySearch] = useState('');
    const [courseSearch, setCourseSearch] = useState('');

    async function handleUpdate(event: React.FormEvent) {
        event.preventDefault();
        setCantUpload(true);
        toast({ title: "Updating...", description: "Please do not leave the page" });

        try {
            const response = await fetch(`/api/ucas/posts/${post.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: title,
                    content: content,
                    tags: selectedTags,
                    universities: selectedUniversities,
                    courses: selectedCourses // typo
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
            
            router.push(`/ucas/post/${post.id}`);
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

            <Accordion type="multiple" className="w-full" defaultValue={['tags', 'universities', 'courses']}>
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
                                    checked={selectedUniversities.includes(uni.name)}
                                    onChange={() => handleCheckboxChange(setSelectedUniversities, uni.name)}
                                />
                                <span>{uni.name}</span>
                            </label>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="courses">
                    <AccordionTrigger>Courses (Optional)</AccordionTrigger>
                    <AccordionContent className="max-h-60 overflow-y-auto">
                        <Input
                            placeholder="Search courses..."
                            value={courseSearch}
                            onChange={(e) => setCourseSearch(e.target.value)}
                            className="mb-4"
                        />
                        {courses.filter(course => course.name.toLowerCase().includes(courseSearch.toLowerCase())).map(course => (
                            <label key={course.id} className="flex items-center space-x-2 my-2 cursor-pointer">
                                <Checkbox
                                    id={`course-${course.id}`}
                                    checked={selectedCourses.includes(course.name)}
                                    onChange={() => handleCheckboxChange(setSelectedCourses, course.name)}
                                />
                                <span>{course.name}</span>
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