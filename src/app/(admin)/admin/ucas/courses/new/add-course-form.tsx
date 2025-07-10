'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';
import { University } from '@prisma/client';

interface AddCourseFormProps {
  universities: University[];
}

export default function AddCourseForm({ universities }: AddCourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    universityId: '',
    qualification: '',
    duration_years: 3,
    summary: '',
    entry_requirements_text: '',
    alevel_requirements: '',
    ib_requirements: '',
    required_subjects: '',
    recommended_subjects: '',
    url: '',
  });

  const generateCourseId = (uniId: string, courseName: string) => {
    if (!uniId || !courseName) return '';
    const courseSlug = courseName
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return `${uniId}-${courseSlug}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const courseId = generateCourseId(formData.universityId, formData.name);
    if (!courseId) {
      toaster.error({
        title: 'Error',
        description: 'University and Course Name must be filled to generate an ID.',
      });
      setIsSubmitting(false);
      return;
    }

    const courseSlug = formData.name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const courseData = {
      id: courseId,
      ...formData,
      duration_years: Number(formData.duration_years),
      required_subjects: formData.required_subjects.split(',').map(s => s.trim()).filter(Boolean),
      recommended_subjects: formData.recommended_subjects.split(',').map(s => s.trim()).filter(Boolean),
      slug: courseSlug
    };

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      toaster.success({
        title: 'Course Created',
        description: `Successfully added ${formData.name}.`,
      });

      router.push('/admin/ucas');
      router.refresh();

    } catch (error) {
      console.error(error);
      toaster.error({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="universityId">University</Label>
          <Select name="universityId" onValueChange={(value) => handleSelectChange('universityId', value)} value={formData.universityId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map(uni => (
                <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="name">Course Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Computer Science" required />
        </div>
        <div>
          <Label>Course ID</Label>
          <Input value={generateCourseId(formData.universityId, formData.name)} disabled />
        </div>
        <div>
          <Label htmlFor="qualification">Qualification</Label>
          <Input id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g., BSc" required />
        </div>
        <div>
          <Label htmlFor="duration_years">Duration (Years)</Label>
          <Input id="duration_years" name="duration_years" type="number" value={formData.duration_years} onChange={handleChange} required />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="A brief summary of the course." required />
      </div>

      <div>
        <Label htmlFor="entry_requirements_text">Entry Requirements</Label>
        <Textarea id="entry_requirements_text" name="entry_requirements_text" value={formData.entry_requirements_text} onChange={handleChange} placeholder="Detailed entry requirements." required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="alevel_requirements">A-Level Requirements</Label>
          <Input id="alevel_requirements" name="alevel_requirements" value={formData.alevel_requirements || ''} onChange={handleChange} placeholder="e.g., A*AA" />
        </div>
        <div>
          <Label htmlFor="ib_requirements">IB Requirements</Label>
          <Input id="ib_requirements" name="ib_requirements" value={formData.ib_requirements || ''} onChange={handleChange} placeholder="e.g., 42 with 776 at HL" />
        </div>
      </div>

      <div>
        <Label htmlFor="required_subjects">Required Subjects</Label>
        <Input id="required_subjects" name="required_subjects" value={formData.required_subjects} onChange={handleChange} placeholder="Comma-separated, e.g., Mathematics, Physics" />
      </div>

      <div>
        <Label htmlFor="recommended_subjects">Recommended Subjects</Label>
        <Input id="recommended_subjects" name="recommended_subjects" value={formData.recommended_subjects} onChange={handleChange} placeholder="Comma-separated, e.g., Further Mathematics" />
      </div>

      <div>
        <Label htmlFor="url">Course URL</Label>
        <Input id="url" name="url" type="url" value={formData.url || ''} onChange={handleChange} placeholder="https://www.cam.ac.uk/..." />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Course
      </Button>
    </form>
  );
} 