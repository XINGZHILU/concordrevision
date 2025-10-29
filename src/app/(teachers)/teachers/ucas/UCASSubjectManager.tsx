'use client';

import { useState } from 'react';
import { UCASSubject, UCASSubjectType } from '@prisma/client';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { useToast } from '@/lib/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
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
} from '@/lib/components/ui/alert-dialog'
import MDEditor from "@uiw/react-md-editor";

/**
 * Component for managing UCAS subjects in the teacher dashboard
 * Allows teachers to create, edit, and delete UCAS subjects
 */
export function UCASSubjectManager({ ucasSubjects }: { ucasSubjects: UCASSubject[] }) {
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectType, setNewSubjectType] = useState<UCASSubjectType>(UCASSubjectType.STEM);
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedType, setEditedType] = useState<UCASSubjectType>(UCASSubjectType.STEM);
    const [editedDescription, setEditedDescription] = useState('');
    const { toast } = useToast();

    /**
     * Handle UCAS subject creation
     */
    async function handleCreateSubject() {
        if (!newSubjectName.trim()) {
            toast({ title: "Error", description: "Subject name cannot be empty.", variant: "destructive" });
            return;
        }

        const response = await fetch('/api/teachers/ucas-subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newSubjectName, type: newSubjectType }),
        });

        if (response.ok) {
            toast({ title: "Success", description: "UCAS subject created." });
            setNewSubjectName('');
            window.location.reload();
        } else {
            const error = await response.json();
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }

    /**
     * Handle UCAS subject update
     */
    async function handleUpdateSubject(subjectId: string) {
        if (!editedName.trim()) {
            toast({ title: "Error", description: "Subject name cannot be empty.", variant: "destructive" });
            return;
        }

        const response = await fetch('/api/teachers/ucas-subjects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: subjectId, name: editedName, type: editedType, description: editedDescription }),
        });

        if (response.ok) {
            toast({ title: "Success", description: "UCAS subject updated." });
            setEditingSubjectId(null);
            window.location.reload();
        } else {
            const error = await response.json();
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }

    /**
     * Handle UCAS subject deletion
     */
    async function handleDeleteSubject(subjectId: string) {
        const response = await fetch('/api/teachers/ucas-subjects', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: subjectId }),
        });

        if (response.ok) {
            toast({ title: "Success", description: "UCAS subject deleted." });
            window.location.reload();
        } else {
            const error = await response.json();
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }

    /**
     * Start editing a UCAS subject
     */
    function startEditing(subject: UCASSubject) {
        setEditingSubjectId(subject.id);
        setEditedName(subject.name);
        setEditedType(subject.type);
        setEditedDescription(subject.description || '');
    }

    /**
     * Cancel editing
     */
    function cancelEditing() {
        setEditingSubjectId(null);
        setEditedName('');
        setEditedType(UCASSubjectType.STEM);
        setEditedDescription('');
    }

    return (
        <div className="space-y-6">
            {/* Create new UCAS subject */}
            <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Create New UCAS Subject</h2>
                <div className="space-y-4">
                    <div>
                        <Input
                            placeholder="Subject Name (e.g., Computer Science)"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Select value={newSubjectType} onValueChange={(value) => setNewSubjectType(value as UCASSubjectType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select subject type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(UCASSubjectType).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleCreateSubject}>Create Subject</Button>
                </div>
            </div>

            {/* List existing UCAS subjects */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Existing UCAS Subjects</h2>
                {ucasSubjects.map((subject) => (
                    <div key={subject.id} className="p-4 border rounded-lg">
                        {editingSubjectId === subject.id ? (
                            <div className="space-y-4">
                                <Input
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                                <Select value={editedType} onValueChange={(value) => setEditedType(value as UCASSubjectType)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(UCASSubjectType).map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description (Markdown)</label>
                                    <MDEditor
                                        value={editedDescription}
                                        onChange={(value) => setEditedDescription(value || '')}
                                        height={300}
                                        data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleUpdateSubject(subject.id)} size="sm">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </Button>
                                    <Button onClick={cancelEditing} variant="outline" size="sm">
                                        <XIcon className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{subject.name}</h3>
                                    <p className="text-sm text-muted-foreground">Type: {subject.type}</p>
                                    {subject.description && (
                                        <p className="text-sm mt-2">{subject.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => startEditing(subject)} variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete UCAS Subject</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete &quot;{subject.name}&quot;? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteSubject(subject.id)}>
                                                    Delete
                                                </AlertDialogAction>
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

