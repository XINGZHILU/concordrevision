'use client';

import { useState } from 'react';
import { Course, UCASSubject } from '@prisma/client';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Textarea } from '@/lib/components/ui/textarea';
import { useToast } from '@/lib/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type CourseWithRelations = Course & {
  university: { id: string; name: string; };
  ucasSubject: { id: string; name: string; };
};

interface EditCourseFormProps {
  course: CourseWithRelations;
  ucasSubjects: UCASSubject[];
}

/**
 * Form component for editing course details
 * Allows teachers to update all course information including markdown description
 */
export function EditCourseForm({ course, ucasSubjects }: EditCourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    ucasSubjectId: course.ucasSubjectId,
    name: course.name,
    description: course.description,
    entry_requirements: course.entry_requirements,
    ucascode: course.ucascode,
    duration: course.duration,
    qualification: course.qualification,
    url: course.url || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'duration' ? (parseInt(value) || 3) : value 
    }));
  };

  const handleDescriptionChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, description: value || '' }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await fetch(`/api/teachers/courses/${course.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast({ title: 'Success', description: 'Course updated successfully' });
      router.push(`/teachers/ucas/universities/${course.universityId}`);
      router.refresh();
    } else {
      const error = await response.json();
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href={`/teachers/ucas/universities/${course.universityId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {course.university.name}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">UCAS Subject *</label>
                <Select 
                  value={formData.ucasSubjectId} 
                  onValueChange={(value) => setFormData({...formData, ucasSubjectId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select UCAS subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {ucasSubjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Course Title *</label>
                <Input
                  name="name"
                  placeholder="e.g., BSc Computer Science"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">UCAS Code *</label>
                <Input
                  name="ucascode"
                  placeholder="e.g., G400"
                  value={formData.ucascode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qualification *</label>
                <Input
                  name="qualification"
                  placeholder="e.g., BSc, BA, MEng"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (years) *</label>
                <Input
                  name="duration"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.duration || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Course URL</label>
                <Input
                  name="url"
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description (Markdown)</label>
              <MDEditor
                value={formData.description}
                onChange={handleDescriptionChange}
                height={300}
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
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push(`/teachers/ucas/universities/${course.universityId}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

