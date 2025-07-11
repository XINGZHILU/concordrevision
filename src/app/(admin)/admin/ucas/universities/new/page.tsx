'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toaster, Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};


export default function AddUniversityPage() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [isUk, setIsUk] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setId(generateSlug(newName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, uk: isUk }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create university');
      }

      toaster.success({
        title: 'University Created',
        description: `Successfully added ${name}.`,
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
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New University</h1>
          <Link href="/admin/ucas" className="text-primary hover:underline">
            &larr; Back to UCAS Admin
          </Link>
        </div>
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-4">
            <div>
              <Label htmlFor="uni-name">University Name</Label>
              <Input
                id="uni-name"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g., University of Cambridge"
                required
              />
            </div>
            <div>
              <Label htmlFor="uni-id">University ID</Label>
              <Input
                id="uni-id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g., cambridge"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">This should be a unique, URL-friendly identifier.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-uk"
                checked={isUk}
                onChange={(e) => setIsUk(e.target.checked)}
              />
              <Label htmlFor="is-uk">Is this a UK university?</Label>
            </div>
            <Button type="submit" disabled={isSubmitting || !id} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add University
            </Button>
          </form>
        </div>
      </div>
      <Toaster /></>
  );
} 