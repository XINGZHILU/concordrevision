'use client';

import { useState } from 'react';
import { Course, UCASSubject } from '@prisma/client';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Textarea } from '@/lib/components/ui/textarea';
import MDEditor from "@uiw/react-md-editor";
import { useToast } from '@/lib/components/ui/use-toast';
import { Edit, Trash2, Save, XIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select';
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
} from '@/lib/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/lib/components/ui/card';
import { Badge } from '@/lib/components/ui/badge';

type CourseWithUCASSubject = Course & {
  ucasSubject: UCASSubject;
};

interface UniversityCoursesFormProps {
  universityId: string;
  courses: CourseWithUCASSubject[];
  ucasSubjects: UCASSubject[];
}

/**
 * Form component for managing courses for a specific university
 * Allows teachers to add, edit, and delete courses
 */
export function UniversityCoursesForm({ universityId, courses, ucasSubjects }: UniversityCoursesFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // New course form state
  const [newCourse, setNewCourse] = useState({
    ucasSubjectId: '',
    name: '',
    description: '',
    entry_requirements: '',
    ucascode: '',
    duration: 3,
    qualification: '',
    url: '',
  });

  // Edit course form state
  const [editedCourse, setEditedCourse] = useState({
    ucasSubjectId: '',
    name: '',
    description: '',
    entry_requirements: '',
    ucascode: '',
    duration: 3,
    qualification: '',
    url: '',
  });

  const { toast } = useToast();

  /**
   * Handle course creation
   */
  async function handleCreateCourse() {
    if (!newCourse.ucasSubjectId || !newCourse.name || 
        !newCourse.ucascode || !newCourse.qualification) {
      toast({ 
        title: "Error", 
        description: "Please fill in all required fields.", 
        variant: "destructive" 
      });
      return;
    }

    const response = await fetch(`/api/teachers/universities/${universityId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCourse, universityId }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "Course link created." });
      setIsCreating(false);
      setNewCourse({
        ucasSubjectId: '',
        name: '',
        description: '',
        entry_requirements: '',
        ucascode: '',
        duration: 3,
        qualification: '',
        url: '',
      });
      router.refresh();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  /**
   * Handle course update
   */
  async function handleUpdateCourse(id: number) {
    if (!editedCourse.ucasSubjectId || !editedCourse.name || 
        !editedCourse.ucascode || !editedCourse.qualification) {
      toast({ 
        title: "Error", 
        description: "Please fill in all required fields.", 
        variant: "destructive" 
      });
      return;
    }

    const response = await fetch(`/api/teachers/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedCourse),
    });

    if (response.ok) {
      toast({ title: "Success", description: "Course link updated." });
      setEditingId(null);
      router.refresh();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  /**
   * Handle course deletion
   */
  async function handleDeleteCourse(id: number) {
    const response = await fetch(`/api/teachers/courses/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast({ title: "Success", description: "Course link deleted." });
      router.refresh();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  /**
   * Start editing a course
   */
  function startEditing(course: CourseWithUCASSubject) {
    setEditingId(course.id);
    setEditedCourse({
      ucasSubjectId: course.ucasSubjectId,
      name: course.name,
      description: course.description || '',
      entry_requirements: course.entry_requirements || '',
      ucascode: course.ucascode,
      duration: course.duration,
      qualification: course.qualification,
      url: course.url || '',
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-muted-foreground">
            Manage specific courses offered at this university
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? <XIcon className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isCreating ? 'Cancel' : 'Add Course'}
        </Button>
      </div>

      {/* Create New Course Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Add a specific course offering at this university</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">UCAS Subject *</label>
                <Select 
                  value={newCourse.ucasSubjectId} 
                  onValueChange={(value) => setNewCourse({...newCourse, ucasSubjectId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select UCAS subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {ucasSubjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Course Title *</label>
                <Input
                  placeholder="e.g., Computer Science BA"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">UCAS Code *</label>
                <Input
                  placeholder="e.g., G400"
                  value={newCourse.ucascode}
                  onChange={(e) => setNewCourse({...newCourse, ucascode: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration (years) *</label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Qualification *</label>
                <Input
                  placeholder="e.g., BA, BSc, MEng"
                  value={newCourse.qualification}
                  onChange={(e) => setNewCourse({...newCourse, qualification: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description (Markdown)</label>
              <MDEditor
                value={newCourse.description}
                onChange={(value) => setNewCourse({...newCourse, description: value || ''})}
                height={200}
                data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Entry Requirements</label>
              <Textarea
                placeholder="e.g., A*AA including Mathematics"
                value={newCourse.entry_requirements}
                onChange={(e) => setNewCourse({...newCourse, entry_requirements: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Course URL</label>
              <Input
                type="url"
                placeholder="https://..."
                value={newCourse.url}
                onChange={(e) => setNewCourse({...newCourse, url: e.target.value})}
              />
            </div>

            <Button onClick={handleCreateCourse}>Create Course</Button>
          </CardContent>
        </Card>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No courses yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id}>
              {editingId === course.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">UCAS Subject *</label>
                      <Select 
                        value={editedCourse.ucasSubjectId} 
                        onValueChange={(value) => setEditedCourse({...editedCourse, ucasSubjectId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select UCAS subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {ucasSubjects.map(subject => (
                            <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Course Title *</label>
                      <Input
                        value={editedCourse.name}
                        onChange={(e) => setEditedCourse({...editedCourse, name: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">UCAS Code *</label>
                      <Input
                        value={editedCourse.ucascode}
                        onChange={(e) => setEditedCourse({...editedCourse, ucascode: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration (years) *</label>
                      <Input
                        type="number"
                        min="1"
                        max="7"
                        value={editedCourse.duration}
                        onChange={(e) => setEditedCourse({...editedCourse, duration: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Qualification *</label>
                      <Input
                        value={editedCourse.qualification}
                        onChange={(e) => setEditedCourse({...editedCourse, qualification: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description (Markdown)</label>
                    <MDEditor
                      value={editedCourse.description}
                      onChange={(value) => setEditedCourse({...editedCourse, description: value || ''})}
                      height={200}
                      data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Entry Requirements</label>
                    <Textarea
                      value={editedCourse.entry_requirements}
                      onChange={(e) => setEditedCourse({...editedCourse, entry_requirements: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Course URL</label>
                    <Input
                      type="url"
                      value={editedCourse.url}
                      onChange={(e) => setEditedCourse({...editedCourse, url: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdateCourse(course.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {course.ucasSubject.name}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary">UCAS: {course.ucascode}</Badge>
                        <Badge variant="secondary">{course.qualification}</Badge>
                        <Badge variant="secondary">{course.duration} years</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/ucas/schools/${universityId}/${course.id}`} target="_blank">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => startEditing(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this course. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

