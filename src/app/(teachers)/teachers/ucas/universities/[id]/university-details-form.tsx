'use client';

import { University } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { useToast } from "@/lib/components/ui/use-toast";
import MDEditor from "@uiw/react-md-editor";

/**
 * Form component for editing university details
 * Allows teachers to update university name, description (markdown), and UK status
 */
export function UniversityDetailsForm({ university }: { university: University }) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(university.name);
  const [description, setDescription] = useState(university.description);
  const [uk, setUk] = useState(university.uk);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await fetch(`/api/teachers/universities/${university.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, uk }),
    });

    if (response.ok) {
      toast({ title: 'University updated successfully' });
      router.refresh();
    } else {
      toast({ title: 'Failed to update university', variant: 'destructive' });
    }
    
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description (Markdown)</label>
        <MDEditor
          value={description}
          onChange={(value) => setDescription(value || '')}
          height={400}
          data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
        />
      </div>
      
      <div className="flex items-center space-x-3 rounded-md border p-4">
        <Checkbox
          id="uk-checkbox"
          checked={uk}
          onChange={() => setUk(!uk)}
        />
        <label htmlFor="uk-checkbox" className="text-sm font-medium leading-none cursor-pointer">
          UK based
        </label>
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

