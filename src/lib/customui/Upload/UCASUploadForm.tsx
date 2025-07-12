'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { StorageURLNotes } from "@/lib/utils";
import cuid from "cuid";
import MDEditor from "@uiw/react-md-editor";
import { ImageUploader } from "./upload_image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Course, Tag, University } from '@prisma/client';
import { toaster } from '@/components/ui/toaster';

type UniversityWithCourses = University & { courses: Course[] };

export default function UCASUploadForm({ universities, author, tags, courses }: {
  universities: UniversityWithCourses[],
  author: string,
  tags: Tag[],
  courses: Course[]
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [cantUpload, setCantUpload] = useState<boolean>(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const supabase = createClient();
  const storageKey = `ucas-post-form`;
  const { toast } = useToast();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [universitySearch, setUniversitySearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      const { title, content, selectedTags, selectedUniversities, selectedCourses } = JSON.parse(saved);
      setTitle(title || "");
      setContent(content || "");
      setSelectedTags(selectedTags || []);
      setSelectedUniversities(selectedUniversities || []);
      setSelectedCourses(selectedCourses || []);
    }
  }, [storageKey]);

  useEffect(() => {
    const data = JSON.stringify({ title, content, selectedTags, selectedUniversities, selectedCourses });
    sessionStorage.setItem(storageKey, data);
  }, [title, content, storageKey, selectedTags, selectedUniversities, selectedCourses]);

  async function upload(files: File[], title: string, desc: string) {
    setCantUpload(true);
    toast({ title: "Uploading...", description: "Please do not leave the page" });

    const uploadedFiles: { url: string, name: string }[] = [];
    try {
      for (const file of files) {
        const response = await supabase.storage.from('notes-storage').upload(cuid() + file.name,
          file, {
          cacheControl: '3600',
          upsert: false
        });

        if (response.error) {
          throw new Error("Failed to upload files, there is probably a file with the same name");
        }

        uploadedFiles.push({ url: StorageURLNotes(response.data.path), name: file.name });
      }

      const response2 = await fetch('/api/ucas/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          content: desc,
          author: author,
          files: uploadedFiles,
          tags: selectedTags,
          universities: selectedUniversities,
          courses: selectedCourses // typo
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response2.ok) {
        throw new Error("Failed to create post");
      }

      if (titleRef.current) titleRef.current.value = '';
      if (inputFileRef.current) inputFileRef.current.value = '';
      setStagedFiles([]);
      setContent("");
      setTitle("");
      setSelectedTags([]);
      setSelectedUniversities([]);
      setSelectedCourses([]);
      sessionStorage.removeItem(storageKey);

    } catch (error: unknown) {
      let message = "Something went wrong with the upload";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setCantUpload(false);
    }
  }

  async function store(event: React.FormEvent) {
    event.preventDefault();
    toaster.promise(upload(stagedFiles, title, content), {
      success: {
        title: "Successfully uploaded!",
        description: "The resource will be available for view after being approved by teachers",
      },
      error: {
        title: "Upload failed",
        description: "Something went wrong with the upload",
      },
      loading: { title: "Uploading...", description: "Please do not leave the page" },
    })
  }

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

  const handleInsertImage = (url: string) => {
    const newContent = `${content || ''}\n![Image](${url})\n`;
    setContent(newContent);
    setImageDialogOpen(false);
  }

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  }

  return (
    <>
      <div className="w-full mx-auto bg-card rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">Create a UCAS Post</h2>
          <p className="text-muted-foreground mt-1">Share advice, ask questions, and connect with others.</p>
        </div>

        <form className="space-y-6" onSubmit={store}>
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

          <Accordion type="multiple" className="w-full">
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
              <Button variant="outline" type="button" onClick={() => setImageDialogOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6 4H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2z" />
                </svg>
                Add Image
              </Button>
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
            <Dialog open={isImageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload an Image</DialogTitle>
                </DialogHeader>
                <ImageUploader onUploadFinished={handleInsertImage} />
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-foreground mb-1">
              Attach Files (Optional)
            </label>
            {stagedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
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
                    <span>Upload files</span>
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
                {stagedFiles.length > 0 && (
                  <p className="text-sm text-primary font-medium">
                    {stagedFiles.length} file{stagedFiles.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="mr-4 px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              onClick={() => {
                if (titleRef.current) titleRef.current.value = '';
                if (inputFileRef.current) inputFileRef.current.value = '';
                setStagedFiles([]);
                setContent("");
                setTitle("");
                setSelectedTags([]);
                setSelectedUniversities([]);
                setSelectedCourses([]);
                sessionStorage.removeItem(storageKey);
              }}
            >
              Reset
            </button>
            <button
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
              {cantUpload ? 'Submitting...' : 'Submit Post'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 