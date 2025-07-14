'use client';

import { useState } from 'react';
import { Course, CourseType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Save, XIcon } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

export function CourseManager({ courses }: { courses: Course[] }) {
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseType, setNewCourseType] = useState<CourseType>(CourseType.STEM);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedType, setEditedType] = useState<CourseType>(CourseType.STEM);
    const [editedDescription, setEditedDescription] = useState('');
    const { toast } = useToast();

    async function handleCreateCourse() {
        if (!newCourseName.trim()) {
            toast({ title: "Error", description: "Course name cannot be empty.", variant: "destructive" });
            return;
        }

        const response = await fetch('/api/admin/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCourseName, type: newCourseType }),
        });

        if (response.ok) {
            toast({ title: "Success", description: "Course created." });
            setNewCourseName('');
            window.location.reload();
        } else {
            const error = await response.json();
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }

    async function handleUpdateCourse(courseId: string) {
        if (!editedName.trim()) {
            toast({ title: "Error", description: "Course name cannot be empty.", variant: "destructive" });
            return;
        }

        const response = await fetch('/api/admin/courses', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: courseId, name: editedName, type: editedType, description: editedDescription }),
        });

        if (response.ok) {
            toast({ title: "Success", description: "Course updated." });
            setEditingCourseId(null);
            window.location.reload();
        } else {
            const error = await response.json();
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }

    async function handleDeleteCourse(courseId: string) {
        const response = await fetch('/api/admin/courses', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: courseId }),
        });

        if (response.ok) {
            toast({ title: "Success", description: "Course deleted." });
            window.location.reload();
        } else {
            const error = await response.json();
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }

    const startEditing = (course: Course) => {
        setEditingCourseId(course.id);
        setEditedName(course.name);
        setEditedType(course.type);
        setEditedDescription(course.description || '');
    };

    const cancelEditing = () => {
        setEditingCourseId(null);
        setEditedName('');
    };

    return (
        <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Manage Courses</h2>

            <div className="mb-8 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Create New Course</h3>
                <div className="flex gap-4">
                    <Input
                        placeholder="New course name"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        className="flex-grow"
                    />
                    <Select onValueChange={(value: CourseType) => setNewCourseType(value)} defaultValue={CourseType.STEM}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select course type" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(CourseType).map(type => (
                                <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleCreateCourse}>Create</Button>
                </div>
            </div>

            <div className="space-y-2">
                {courses.map(course => (
                    <div key={course.id} className="p-3 bg-muted/50 rounded-lg flex flex-col items-start">
                        {editingCourseId === course.id ? (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="flex-grow mr-2" />
                                    <Select onValueChange={(value: CourseType) => setEditedType(value)} defaultValue={editedType}>
                                        <SelectTrigger className="w-[280px]">
                                            <SelectValue placeholder="Select course type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(CourseType).map(type => (
                                                <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button size="sm" onClick={() => handleUpdateCourse(course.id)}><Save className="h-4 w-4" /></Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEditing}><XIcon className="h-4 w-4" /></Button>
                                </div>
                                <Textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    placeholder="Course Description"
                                    className="w-full"
                                />
                            </div>
                        ) : (
                            <div className="w-full flex justify-between items-center">
                                <div className="flex-grow">
                                    <span className="font-medium">{course.name}</span>
                                    <span className="text-sm text-muted-foreground ml-4">{course.type.replace(/_/g, ' ')}</span>
                                    <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => startEditing(course)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the course and remove it from all universities. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 