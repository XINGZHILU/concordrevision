'use client';

import { useState } from 'react';
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


type UniversityWithCourses = University & { courseLinks: (CourseLink & { course: Course })[] };

export function UniversityManager({ universities, courses }: { universities: UniversityWithCourses[], courses: Course[] }) {
  const [newUniversityName, setNewUniversityName] = useState('');
  const [isUk, setIsUk] = useState(true);
  const [editingUniversityId, setEditingUniversityId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedIsUk, setEditedIsUk] = useState(true);
  const { toast } = useToast();

  async function handleCreateUniversity() {
    if (!newUniversityName.trim()) {
      toast({ title: "Error", description: "University name cannot be empty.", variant: "destructive" });
      return;
    }

    const response = await fetch('/api/admin/universities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUniversityName, uk: isUk }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "University created." });
      setNewUniversityName('');
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
      body: JSON.stringify({ name: editedName, uk: editedIsUk }),
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

  async function handleRemoveCourseFromUniversity(universityId: string, courseId: string) {
    const response = await fetch(`/api/admin/universities/${universityId}/courses`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "Course removed from university." });
      window.location.reload();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  async function handleAddCoursesToUniversity(universityId: string, courseIds: string[]) {
    const response = await fetch(`/api/admin/universities/${universityId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseIds }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "Courses added to university." });
      window.location.reload();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  const startEditing = (uni: University) => {
    setEditingUniversityId(uni.id);
    setEditedName(uni.name);
    setEditedIsUk(uni.uk);
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
          <Button onClick={handleCreateUniversity}>Create</Button>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {universities.map((uni) => (
          <AccordionItem key={uni.id} value={uni.id}>
            <AccordionTrigger>
              <div className="flex justify-between items-center w-full">
                {editingUniversityId === uni.id ? (
                  <div className="flex-grow flex gap-2 items-center">
                    <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="h-8" />
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`edit-uk-${uni.id}`} checked={editedIsUk} onChange={(e) => setEditedIsUk(e.target.checked)} />
                      <label htmlFor={`edit-uk-${uni.id}`}>In UK</label>
                    </div>
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
                <h4 className="font-semibold mb-2">Courses offered:</h4>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  {uni.courseLinks.map(link => (
                    <li key={link.course.id} className="flex justify-between items-center">
                      <span>{link.course.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveCourseFromUniversity(uni.id, link.course.id)}>
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <AddCoursesForm universityId={uni.id} allCourses={courses} existingCourses={uni.courseLinks.map(l => l.course)} onAddCourses={handleAddCoursesToUniversity} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function AddCoursesForm({ universityId, allCourses, existingCourses, onAddCourses }: {
  universityId: string,
  allCourses: Course[],
  existingCourses: Course[],
  onAddCourses: (universityId: string, courseIds: string[]) => void
}) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const availableCourses = allCourses.filter(c => !existingCourses.find(ec => ec.id === c.id));

  function handleCheckboxChange(courseId: string) {
    setSelectedCourses(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
  }

  function handleSubmit() {
    if (selectedCourses.length > 0) {
      onAddCourses(universityId, selectedCourses);
      setSelectedCourses([]);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <h5 className="font-semibold mb-2">Add courses:</h5>
      <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
        {availableCourses.map(course => (
          <div key={course.id} className="flex items-center space-x-2">
            <Checkbox
              id={`add-${universityId}-${course.id}`}
              onChange={() => handleCheckboxChange(course.id)}
              checked={selectedCourses.includes(course.id)}
            />
            <label htmlFor={`add-${universityId}-${course.id}`}>{course.name}</label>
          </div>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={selectedCourses.length === 0}>Add Selected Courses</Button>
    </div>
  )
} 