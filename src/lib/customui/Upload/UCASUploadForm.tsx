'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { upload_image, ImageUploader } from "./upload_image";
import MDEditor from '@uiw/react-md-editor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type University = {
    id: string;
    name: string;
    courses: {
        id: string;
        name: string;
    }[];
}

export function UCASUploadForm({ universities }: { universities: University[] }) {
    const [postType, setPostType] = useState(0);
    const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<string | undefined>('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUploaderOpen, setImageUploaderOpen] = useState(false);

    const router = useRouter();
    const { toast } = useToast();

    const resetForm = () => {
        setPostType(0);
        setSelectedUniversity(null);
        setTitle('');
        setContent('');
        setFiles([]);
        // This is a bit of a hack to reset the uncontrolled file input
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleUniversityChange = (value: string) => {
        setSelectedUniversity(value);
    }

    const handleImageInsert = (url: string) => {
        setContent(prev => `${prev || ''}\n\n![image](${url})`);
        setImageUploaderOpen(false);
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let uploadedFiles: { url: string, name: string }[] = [];
        if (files.length > 0) {
            toast({ title: "Uploading Files", description: "Please wait..." });
            try {
                const uploadPromises = files.map(file => upload_image(file));
                const settledPromises = await Promise.allSettled(uploadPromises);
                
                const successfullyUploadedIndexes: number[] = [];
                settledPromises.forEach((p, index) => {
                    if (p.status === 'fulfilled') {
                        successfullyUploadedIndexes.push(index);
                    }
                });
                
                uploadedFiles = successfullyUploadedIndexes.map(index => {
                    const result = (settledPromises[index] as PromiseFulfilledResult<import("@vercel/blob").PutBlobResult>).value;
                    return {
                        url: result.url,
                        name: files[index].name
                    };
                });
                
                const failedUploads = settledPromises.length - successfullyUploadedIndexes.length;
                if (failedUploads > 0) {
                    toast({ title: "Some files failed to upload", description: `${failedUploads} out of ${files.length} files could not be uploaded.`, variant: "destructive" });
                } else {
                    toast({ title: "Success", description: "All files attached successfully." });
                }
            } catch (error) {
                console.error("File upload failed:", error);
                toast({ title: "Error", description: "File upload failed.", variant: "destructive" });
                setIsSubmitting(false);
                return;
            }
        }

        const university = universities.find(u => u.id === selectedUniversity);
        const courseId = postType === 2 ? university?.courses[0].id : undefined;

        const res = await fetch('/api/ucas/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                type: postType,
                universityId: selectedUniversity,
                courseId,
                files: uploadedFiles,
            })
        });

        if (res.ok) {
            toast({ title: "Success", description: "Post submitted for approval." });
            resetForm();
            router.refresh();
        } else {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        }
        setIsSubmitting(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label>What is this post about?</Label>
                <RadioGroup defaultValue="0" onValueChange={(v) => setPostType(parseInt(v))} className="mt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="r1" />
                        <Label htmlFor="r1">General Advice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="r2" />
                        <Label htmlFor="r2">University-Specific Advice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="r3" />
                        <Label htmlFor="r3">Course-Specific Advice</Label>
                    </div>
                </RadioGroup>
            </div>

            {(postType === 1 || postType === 2) && (
                <Select onValueChange={handleUniversityChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a University" />
                    </SelectTrigger>
                    <SelectContent>
                        {universities.map(uni => (
                            <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {postType === 2 && selectedUniversity && (
                 <Select name="courseId">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Course" />
                    </SelectTrigger>
                    <SelectContent>
                        {universities.find(uni => uni.id === selectedUniversity)?.courses.map(course => (
                            <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            
            <Input name="title" placeholder="Post Title" required onChange={e => setTitle(e.target.value)} value={title} />
            
            <div data-color-mode="light">
                <div className="flex justify-end mb-2">
                    <Dialog open={imageUploaderOpen} onOpenChange={setImageUploaderOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline">Add Image</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Image Uploader</DialogTitle>
                            </DialogHeader>
                            <ImageUploader onUploadFinished={handleImageInsert} />
                        </DialogContent>
                    </Dialog>
                </div>
                <MDEditor
                    value={content}
                    onChange={setContent}
                    preview="edit"
                    height={400}
                />
            </div>
            
            <div>
              <Label htmlFor="file">Attach files (optional)</Label>
              <Input id="file" type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Post"}
            </Button>
        </form>
    )
} 