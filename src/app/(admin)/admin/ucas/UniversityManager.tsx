'use client';

import { useState, useEffect } from 'react';
import { University, Course, CourseLink } from '@prisma/client';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { useToast } from '@/lib/components/ui/use-toast';
import { Trash2, Edit } from 'lucide-react';
import { Checkbox } from '@/lib/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/lib/components/ui/alert-dialog'
import Link from 'next/link';

type UniversityWithCourses = University & { courseLinks: (CourseLink & { course: Course })[] };

export function UniversityManager({ universities }: { universities: UniversityWithCourses[] }) {
  const [newUniversityName, setNewUniversityName] = useState('');
  const [newUniversityId, setNewUniversityId] = useState('');
  const [isUk, setIsUk] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const slug = newUniversityName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    setNewUniversityId(slug);
  }, [newUniversityName]);

  async function handleCreateUniversity() {
    if (!newUniversityName.trim() || !newUniversityId.trim()) {
      toast({ title: "Error", description: "University name and ID cannot be empty.", variant: "destructive" });
      return;
    }

    const response = await fetch('/api/admin/universities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newUniversityId, name: newUniversityName, uk: isUk, description: '' }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "University created." });
      setNewUniversityName('');
      setNewUniversityId('');
      window.location.reload();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  async function handleDeleteUniversity(universityId: string) {
    const response = await fetch(`/api/admin/universities/${universityId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast({ title: "Success", description: "University deleted." });
      window.location.reload();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <div className="p-6 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Manage Universities</h2>

      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Create New University</h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Input
                placeholder="New university name"
                value={newUniversityName}
                onChange={(e) => setNewUniversityName(e.target.value)}
                className="flex-grow"
            />
            <div className="flex items-center space-x-2">
                <Checkbox id="isUk" checked={isUk} onChange={(e) => setIsUk(e.target.checked)} />
                <label htmlFor="isUk">In UK</label>
            </div>
          </div>
          <Input
            placeholder="University ID"
            value={newUniversityId}
            onChange={(e) => setNewUniversityId(e.target.value)}
          />
          <Button onClick={handleCreateUniversity}>Create</Button>
        </div>
      </div>

      <div className="space-y-2">
        {universities.map((uni) => (
          <div key={uni.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="font-semibold">{uni.name} {uni.uk ? '' : '(International)'}</span>
            <div className="flex items-center gap-2">
              <Link href={`/admin/ucas/universities/${uni.id}`} passHref>
                <Button size="sm" variant="outline"><Edit className="h-4 w-4 mr-2" />Manage</Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the university and all its associated data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteUniversity(uni.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 