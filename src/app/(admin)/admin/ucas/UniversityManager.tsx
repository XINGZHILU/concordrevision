'use client';

import { useState, useEffect } from 'react';
import { University, Course, CourseLink } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { XIcon, Edit, Trash2, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
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
} from "@/components/ui/alert-dialog"
import { CourseLinkForm } from '@/lib/customui/UCAS/CourseLinkForm';


type UniversityWithCourses = University & { courseLinks: (CourseLink & { course: Course })[] };

export function UniversityManager({ universities, courses }: { universities: UniversityWithCourses[], courses: Course[] }) {
  const [newUniversityName, setNewUniversityName] = useState('');
  const [newUniversityId, setNewUniversityId] = useState('');
  const [isUk, setIsUk] = useState(true);
  const [editingUniversityId, setEditingUniversityId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedIsUk, setEditedIsUk] = useState(true);
  const [editedDescription, setEditedDescription] = useState('');
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
      body: JSON.stringify({ id: newUniversityId, name: newUniversityName, uk: isUk }),
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

  async function handleUpdateUniversity(universityId: string) {
    if (!editedName.trim()) {
      toast({ title: "Error", description: "University name cannot be empty.", variant: "destructive" });
      return;
    }

    const response = await fetch(`/api/admin/universities/${universityId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editedName, uk: editedIsUk, description: editedDescription }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "University updated." });
      setEditingUniversityId(null);
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

  async function handleRemoveCourseLink(courseLinkId: number) {
    const response = await fetch(`/api/admin/course-links/${courseLinkId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast({ title: "Success", description: "Course link removed." });
      window.location.reload();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  const startEditing = (uni: UniversityWithCourses) => {
    setEditingUniversityId(uni.id);
    setEditedName(uni.name);
    setEditedIsUk(uni.uk);
    setEditedDescription(uni.description || '');
  };

  const cancelEditing = () => {
    setEditingUniversityId(null);
    setEditedName('');
  };


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
                <Checkbox id="isUk" checked={isUk} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsUk(e.target.checked)} />
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

      <Accordion type="multiple" className="w-full">
        {universities.map((uni) => (
          <AccordionItem key={uni.id} value={uni.id}>
            <AccordionTrigger>
              <div className="flex justify-between items-center w-full">
                {editingUniversityId === uni.id ? (
                  <div className="flex-grow flex flex-col gap-2 items-start">
                    <div className="flex gap-2 w-full">
                      <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="h-8" />
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`edit-uk-${uni.id}`} checked={editedIsUk} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedIsUk(e.target.checked)} />
                        <label htmlFor={`edit-uk-${uni.id}`}>In UK</label>
                      </div>
                    </div>
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="University Description"
                        className="w-full p-2 border rounded"
                    />
                  </div>
                ) : (
                  <span>{uni.name} {uni.uk ? '' : '(International)'}</span>
                )}
                <div className="flex items-center gap-2 mr-4" onClick={(e) => e.stopPropagation()}>
                  {editingUniversityId === uni.id ? (
                    <>
                      <Button size="sm" onClick={() => handleUpdateUniversity(uni.id)}><Save className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={cancelEditing}><XIcon className="h-4 w-4" /></Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => startEditing(uni)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the university and all its associated course links. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUniversity(uni.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">{uni.description}</p>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Courses offered:</h4>
                    <CourseLinkForm
                        universityId={uni.id}
                        courses={courses}
                        onSuccess={() => window.location.reload()}
                    >
                        <Button size="sm">Add Course Link</Button>
                    </CourseLinkForm>
                </div>
                <div className="space-y-2">
                  {uni.courseLinks.map(link => (
                    <div key={link.id} className="flex justify-between items-center p-2 rounded-md bg-background">
                      <div>
                        <p className="font-semibold">{link.name}</p>
                        <p className="text-sm text-muted-foreground">{link.course.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CourseLinkForm
                            universityId={uni.id}
                            courses={courses}
                            courseLink={link}
                            onSuccess={() => window.location.reload()}
                        >
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        </CourseLinkForm>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the course link. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveCourseLink(link.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
} 