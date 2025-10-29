'use client';

import { UCASSubject, Course } from '@prisma/client';
import { Button } from '@/lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/lib/components/ui/dialog';
import { Input } from '@/lib/components/ui/input';
import { Textarea } from '@/lib/components/ui/textarea';
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select';
import { toaster } from '@/lib/components/ui/toaster';
import { useState, useEffect } from 'react';

interface CourseFormProps {
  universityId: string;
  ucasSubjects: UCASSubject[];
  course?: Course | null;
  onSuccess: () => void;
  children: React.ReactNode;
}

export function CourseForm({ universityId, ucasSubjects, course, onSuccess, children }: CourseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    ucasSubjectId: course?.ucasSubjectId || '',
    name: course?.name || '',
    entry_requirements: course?.entry_requirements || '',
    description: course?.description || '',
    ucascode: course?.ucascode || '',
    duration: course?.duration || 3,
    qualification: course?.qualification || '',
    url: course?.url || '',
  });


  useEffect(() => {
    if (isOpen) {
        setFormData({
            ucasSubjectId: course?.ucasSubjectId || '',
            name: course?.name || '',
            entry_requirements: course?.entry_requirements || '',
            description: course?.description || '',
            ucascode: course?.ucascode || '',
            duration: course?.duration || 3,
            qualification: course?.qualification || '',
            url: course?.url || '',
        });
    }
  }, [isOpen, course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration' ? (parseInt(value) || 3) : value }));
  };
  
  const handleDescriptionChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, description: value || '' }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, ucasSubjectId: value }));
  };

  const handleSubmit = async () => {
    const url = course
      ? `/api/teachers/courses/${course.id}`
      : `/api/teachers/universities/${universityId}/courses`;
    
    const method = course ? 'PUT' : 'POST';

    const body = course ? JSON.stringify(formData) : JSON.stringify({ ...formData, universityId });

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (response.ok) {
      toaster.success({ title: 'Success', description: `Course ${course ? 'updated' : 'created'}.` });
      setIsOpen(false);
      onSuccess();
    } else {
      const error = await response.json();
      toaster.error({ title: 'Error', description: error.message });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit' : 'Add'} Course</DialogTitle>
          <DialogDescription>
            {course ? 'Edit the' : 'Add a new'} course for this university. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">UCAS Subject *</label>
            <Select onValueChange={handleSelectChange} defaultValue={formData.ucasSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a UCAS subject" />
              </SelectTrigger>
              <SelectContent>
                {ucasSubjects.map(ucasSubject => (
                  <SelectItem key={ucasSubject.id} value={ucasSubject.id}>{ucasSubject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Input name="name" placeholder="Course Name (e.g. 'BSc Computer Science with Industrial Year')" value={formData.name} onChange={handleChange} />
          
          <div>
            <label className="block text-sm font-medium mb-2">Description (Markdown)</label>
            <MDEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              height={200}
              data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Entry Requirements</label>
            <Textarea 
              name="entry_requirements" 
              placeholder="e.g., A*AA including Mathematics" 
              value={formData.entry_requirements} 
              onChange={handleChange} 
              rows={3}
            />
          </div>
          
          <Input name="ucascode" placeholder="UCAS Code" value={formData.ucascode} onChange={handleChange} />
          <Input name="duration" placeholder="Duration (years)" type="number" value={formData.duration || ''} onChange={handleChange} />
          <Input name="qualification" placeholder="Qualification (e.g. 'BSc')" value={formData.qualification} onChange={handleChange} />
          <Input name="url" placeholder="URL (optional)" value={formData.url} onChange={handleChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 