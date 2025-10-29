'use client';

import { useState } from 'react';
import { Course, UCASSubject, University } from '@prisma/client';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Textarea } from '@/lib/components/ui/textarea';
import MDEditor from "@uiw/react-md-editor";
import { useToast } from '@/lib/components/ui/use-toast';
import { Edit, Trash2, Plus, X } from 'lucide-react';
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

type CourseWithRelations = Course & {
  ucasSubject: UCASSubject;
  university: University;
};

interface CourseManagerProps {
  courses: CourseWithRelations[];
  ucasSubjects: UCASSubject[];
  universities: Array<{ id: string; name: string }>;
}

/**
 * Component for managing courses (specific degree programs at specific universities) in the teacher dashboard
 * Allows teachers to create, edit, and delete courses
 */
export function CourseManager({ courses, ucasSubjects, universities }: CourseManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New course form state
  const [newCourse, setNewCourse] = useState({
    universityId: '',
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
   * Filter courses based on search query
   */
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.ucasSubject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.ucascode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Handle course creation
   */
  async function handleCreateCourse() {
    if (!newCourse.universityId || !newCourse.ucasSubjectId || !newCourse.name || 
        !newCourse.ucascode || !newCourse.qualification) {
      toast({ 
        title: "Error", 
        description: "Please fill in all required fields.", 
        variant: "destructive" 
      });
      return;
    }

    const response = await fetch(`/api/teachers/universities/${newCourse.universityId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse),
    });

    if (response.ok) {
      toast({ title: "Success", description: "Course link created." });
      setIsCreating(false);
      setNewCourse({
        universityId: '',
        ucasSubjectId: '',
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
   * Handle course deletion
   */
  async function handleDeleteCourse(id: number) {
    const response = await fetch(`/api/teachers/courses/${id}`, {
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


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-muted-foreground">
            Manage specific courses at universities (e.g., Computer Science BA at Cambridge)
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isCreating ? 'Cancel' : 'Add Course'}
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

      {/* Create New Course Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Add a specific course offering at a university</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">University *</label>
                <Select 
                  value={newCourse.universityId} 
                  onValueChange={(value) => setNewCourse({...newCourse, universityId: value})}
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
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {searchQuery ? `No courses found for "${searchQuery}"` : 'No courses yet. Create one to get started.'}
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription className="mt-2">
                      <span className="font-medium">{course.university.name}</span> • {course.ucasSubject.name}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary">UCAS: {course.ucascode}</Badge>
                      <Badge variant="secondary">{course.qualification}</Badge>
                      <Badge variant="secondary">{course.duration} years</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                    <Link href={`/teachers/ucas/courses/${course.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
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
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

