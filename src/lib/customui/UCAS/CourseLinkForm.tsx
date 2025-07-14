'use client';

import { Course, CourseLink } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';

interface CourseLinkFormProps {
  universityId: string;
  courses: Course[];
  courseLink?: CourseLink | null;
  onSuccess: () => void;
  children: React.ReactNode;
}

export function CourseLinkForm({ universityId, courses, courseLink, onSuccess, children }: CourseLinkFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: courseLink?.courseId || '',
    name: courseLink?.name || '',
    entry_requirements: courseLink?.entry_requirements || '',
    description: courseLink?.description || '',
    ucascode: courseLink?.ucascode || '',
    duration: courseLink?.duration || 3,
    qualification: courseLink?.qualification || '',
    url: courseLink?.url || '',
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
        setFormData({
            courseId: courseLink?.courseId || '',
            name: courseLink?.name || '',
            entry_requirements: courseLink?.entry_requirements || '',
            description: courseLink?.description || '',
            ucascode: courseLink?.ucascode || '',
            duration: courseLink?.duration || 3,
            qualification: courseLink?.qualification || '',
            url: courseLink?.url || '',
        });
    }
  }, [isOpen, courseLink]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration' ? parseInt(value) : value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, courseId: value }));
  };

  const handleSubmit = async () => {
    const url = courseLink
      ? `/api/admin/course-links/${courseLink.id}`
      : `/api/admin/universities/${universityId}/courses`;
    
    const method = courseLink ? 'PUT' : 'POST';

    const body = courseLink ? JSON.stringify(formData) : JSON.stringify({ ...formData, universityId });

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (response.ok) {
      toast({ title: 'Success', description: `Course link ${courseLink ? 'updated' : 'created'}.` });
      setIsOpen(false);
      onSuccess();
    } else {
      const error = await response.json();
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{courseLink ? 'Edit' : 'Add'} Course Link</DialogTitle>
          <DialogDescription>
            {courseLink ? 'Edit the' : 'Add a new'} course link for this university. Click save when you’re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={handleSelectChange} defaultValue={formData.courseId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input name="name" placeholder="Course Link Name (e.g. 'with Industrial Year')" value={formData.name} onChange={handleChange} />
          <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <Textarea name="entry_requirements" placeholder="Entry Requirements" value={formData.entry_requirements} onChange={handleChange} />
          <Input name="ucascode" placeholder="UCAS Code" value={formData.ucascode} onChange={handleChange} />
          <Input name="duration" placeholder="Duration (years)" type="number" value={formData.duration} onChange={handleChange} />
          <Input name="qualification" placeholder="Qualification (e.g. 'BSc')" value={formData.qualification} onChange={handleChange} />
          <Input name="url" placeholder="URL" value={formData.url} onChange={handleChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 