'use client';

import { useState } from 'react';
import { CourseLink, Course, University } from '@prisma/client';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Textarea } from '@/lib/components/ui/textarea';
import { useToast } from '@/lib/components/ui/use-toast';
import { Edit, Trash2, Save, XIcon, Plus } from 'lucide-react';
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

type CourseLinkWithRelations = CourseLink & {
  course: Course;
  university: University;
};

interface CourseLinkManagerProps {
  courseLinks: CourseLinkWithRelations[];
  courses: Course[];
  universities: Array<{ id: string; name: string }>;
}

/**
 * Component for managing course links (specific courses at specific universities) in the teacher dashboard
 * Allows teachers to create, edit, and delete course links
 */
export function CourseLinkManager({ courseLinks, courses, universities }: CourseLinkManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New course link form state
  const [newCourseLink, setNewCourseLink] = useState({
    universityId: '',
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
   * Filter course links based on search query
   */
  const filteredCourseLinks = courseLinks.filter(link => 
    link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.ucascode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Handle course link creation
   */
  async function handleCreateCourseLink() {
    if (!newCourseLink.universityId || !newCourseLink.courseId || !newCourseLink.name || 
        !newCourseLink.ucascode || !newCourseLink.qualification) {
      toast({ 
        title: "Error", 
        description: "Please fill in all required fields.", 
        variant: "destructive" 
      });
      return;
    }

    const response = await fetch(`/api/teachers/universities/${newCourseLink.universityId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourseLink),
    });

    if (response.ok) {
      toast({ title: "Success", description: "Course link created." });
      setIsCreating(false);
      setNewCourseLink({
        universityId: '',
        courseId: '',
        name: '',
        description: '',
        entry_requirements: '',
        ucascode: '',
        duration: 3,
        qualification: '',
        url: '',
      });
      window.location.reload();
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
      window.location.reload();
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
      window.location.reload();
    } else {
      const error = await response.json();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  /**
   * Start editing a course link
   */
  function startEditing(courseLink: CourseLinkWithRelations) {
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
            Manage specific courses at universities (e.g., Computer Science BA at Cambridge)
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? <XIcon className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isCreating ? 'Cancel' : 'Add Course Link'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by course name, university, UCAS code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Create New Course Link Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Course Link</CardTitle>
            <CardDescription>Add a specific course offering at a university</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">University *</label>
                <Select 
                  value={newCourseLink.universityId} 
                  onValueChange={(value) => setNewCourseLink({...newCourseLink, universityId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map(uni => (
                      <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
        {filteredCourseLinks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {searchQuery ? `No course links found for "${searchQuery}"` : 'No course links yet. Create one to get started.'}
            </CardContent>
          </Card>
        ) : (
          filteredCourseLinks.map((courseLink) => (
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
                        <span className="font-medium">{courseLink.university.name}</span> • {courseLink.course.name}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary">UCAS: {courseLink.ucascode}</Badge>
                        <Badge variant="secondary">{courseLink.qualification}</Badge>
                        <Badge variant="secondary">{courseLink.duration} years</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
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

