'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';
import { University } from '@prisma/client';

interface EditUniversityFormProps {
    university: University;
}

export default function EditUniversityForm({ university }: EditUniversityFormProps) {
    const [name, setName] = useState(university.name);
    const [isUk, setIsUk] = useState(university.uk);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/universities/${university.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, uk: isUk }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update university');
            }
            
            toaster.success({
                title: 'University Updated',
                description: `Successfully updated ${name}.`,
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
            <div>
                <Label htmlFor="uni-name">University Name</Label>
                <Input
                    id="uni-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., University of Cambridge"
                    required
                />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is-uk"
                    checked={isUk}
                    onChange={(e) => setIsUk(e.target.checked)}
                />
                <Label htmlFor="is-uk">Is this a UK university?</Label>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update University
            </Button>
        </form>
    );
} 