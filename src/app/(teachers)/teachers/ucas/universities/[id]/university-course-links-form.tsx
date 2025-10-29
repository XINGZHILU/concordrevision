'use client';

import { useState } from 'react';
import { CourseLink, Course } from '@prisma/client';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Textarea } from '@/lib/components/ui/textarea';
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

type CourseLinkWithCourse = CourseLink & {
  course: Course;
};

interface UniversityCourseLinksFormProps {
  universityId: string;
  courseLinks: CourseLinkWithCourse[];
  courses: Course[];
}

/**
 * Form component for managing course links for a specific university
 * Allows teachers to add, edit, and delete course links
 */
export function UniversityCourseLinksForm({ universityId, courseLinks, courses }: UniversityCourseLinksFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // New course link form state
  const [newCourseLink, setNewCourseLink] = useState({
    courseId: '',
    name: '',
    description: '',
    entry_requirements: '',
    ucascode: '',
    duration: 3,
    qualification: '',
    url: '',
  });

  // Edit course link form state
  const [editedCourseLink, setEditedCourseLink] = useState({
    courseId: '',
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
   * Handle course link creation
   */
  async function handleCreateCourseLink() {
    if (!newCourseLink.courseId || !newCourseLink.name || 
        !newCourseLink.ucascode || !newCourseLink.qualification) {
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
      body: JSON.stringify({ ...newCourseLink, universityId }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "Course link created." });
      setIsCreating(false);
      setNewCourseLink({
        courseId: '',
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
   * Handle course link update
   */
  async function handleUpdateCourseLink(id: number) {
    if (!editedCourseLink.courseId || !editedCourseLink.name || 
        !editedCourseLink.ucascode || !editedCourseLink.qualification) {
      toast({ 
        title: "Error", 
        description: "Please fill in all required fields.", 
        variant: "destructive" 
      });
      return;
    }

    const response = await fetch(`/api/teachers/course-links/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedCourseLink),
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
   * Handle course link deletion
   */
  async function handleDeleteCourseLink(id: number) {
    const response = await fetch(`/api/teachers/course-links/${id}`, {
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
   * Start editing a course link
   */
  function startEditing(courseLink: CourseLinkWithCourse) {
    setEditingId(courseLink.id);
    setEditedCourseLink({
      courseId: courseLink.courseId,
      name: courseLink.name,
      description: courseLink.description || '',
      entry_requirements: courseLink.entry_requirements || '',
      ucascode: courseLink.ucascode,
      duration: courseLink.duration,
      qualification: courseLink.qualification,
      url: courseLink.url || '',
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Course Links</h2>
          <p className="text-muted-foreground">
            Manage specific courses offered at this university
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? <XIcon className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isCreating ? 'Cancel' : 'Add Course Link'}
        </Button>
      </div>

      {/* Create New Course Link Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Course Link</CardTitle>
            <CardDescription>Add a specific course offering at this university</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Course *</label>
                <Select 
                  value={newCourseLink.courseId} 
                  onValueChange={(value) => setNewCourseLink({...newCourseLink, courseId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Course Title *</label>
                <Input
                  placeholder="e.g., Computer Science BA"
                  value={newCourseLink.name}
                  onChange={(e) => setNewCourseLink({...newCourseLink, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">UCAS Code *</label>
                <Input
                  placeholder="e.g., G400"
                  value={newCourseLink.ucascode}
                  onChange={(e) => setNewCourseLink({...newCourseLink, ucascode: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration (years) *</label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={newCourseLink.duration}
                  onChange={(e) => setNewCourseLink({...newCourseLink, duration: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Qualification *</label>
                <Input
                  placeholder="e.g., BA, BSc, MEng"
                  value={newCourseLink.qualification}
                  onChange={(e) => setNewCourseLink({...newCourseLink, qualification: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Course description"
                value={newCourseLink.description}
                onChange={(e) => setNewCourseLink({...newCourseLink, description: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Entry Requirements</label>
              <Textarea
                placeholder="e.g., A*AA including Mathematics"
                value={newCourseLink.entry_requirements}
                onChange={(e) => setNewCourseLink({...newCourseLink, entry_requirements: e.target.value})}
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Course URL</label>
              <Input
                type="url"
                placeholder="https://..."
                value={newCourseLink.url}
                onChange={(e) => setNewCourseLink({...newCourseLink, url: e.target.value})}
              />
            </div>

            <Button onClick={handleCreateCourseLink}>Create Course Link</Button>
          </CardContent>
        </Card>
      )}

      {/* Course Links List */}
      <div className="space-y-4">
        {courseLinks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No course links yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          courseLinks.map((courseLink) => (
            <Card key={courseLink.id}>
              {editingId === courseLink.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Course *</label>
                      <Select 
                        value={editedCourseLink.courseId} 
                        onValueChange={(value) => setEditedCourseLink({...editedCourseLink, courseId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Course Title *</label>
                      <Input
                        value={editedCourseLink.name}
                        onChange={(e) => setEditedCourseLink({...editedCourseLink, name: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">UCAS Code *</label>
                      <Input
                        value={editedCourseLink.ucascode}
                        onChange={(e) => setEditedCourseLink({...editedCourseLink, ucascode: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration (years) *</label>
                      <Input
                        type="number"
                        min="1"
                        max="7"
                        value={editedCourseLink.duration}
                        onChange={(e) => setEditedCourseLink({...editedCourseLink, duration: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Qualification *</label>
                      <Input
                        value={editedCourseLink.qualification}
                        onChange={(e) => setEditedCourseLink({...editedCourseLink, qualification: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={editedCourseLink.description}
                      onChange={(e) => setEditedCourseLink({...editedCourseLink, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Entry Requirements</label>
                    <Textarea
                      value={editedCourseLink.entry_requirements}
                      onChange={(e) => setEditedCourseLink({...editedCourseLink, entry_requirements: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Course URL</label>
                    <Input
                      type="url"
                      value={editedCourseLink.url}
                      onChange={(e) => setEditedCourseLink({...editedCourseLink, url: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdateCourseLink(courseLink.id)}>
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
                      <CardTitle className="text-lg">{courseLink.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {courseLink.course.name}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary">UCAS: {courseLink.ucascode}</Badge>
                        <Badge variant="secondary">{courseLink.qualification}</Badge>
                        <Badge variant="secondary">{courseLink.duration} years</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/ucas/schools/${universityId}/${courseLink.id}`} target="_blank">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => startEditing(courseLink)}>
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
                              This will permanently delete this course link. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCourseLink(courseLink.id)}>
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

