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
 * Component for managing UCAS subjects in the admin dashboard
 * Allows admins to create, edit, and delete UCAS subjects
 */
export function UCASSubjectManager({ ucasSubjects }: { ucasSubjects: UCASSubject[] }) {
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectType, setNewSubjectType] = useState<UCASSubjectType>(UCASSubjectType.STEM);
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedType, setEditedType] = useState<UCASSubjectType>(UCASSubjectType.STEM);
    const [editedDescription, setEditedDescription] = useState('');
    const { toast } = useToast();

    async function handleCreateSubject() {
        if (!newSubjectName.trim()) {
            toast({ title: "Error", description: "Subject name cannot be empty.", variant: "destructive" });
            return;
        }

        const response = await fetch('/api/admin/ucas-subjects', {
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

    async function handleUpdateSubject(subjectId: string) {
        if (!editedName.trim()) {
            toast({ title: "Error", description: "Subject name cannot be empty.", variant: "destructive" });
            return;
        }

        const response = await fetch('/api/admin/ucas-subjects', {
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

    async function handleDeleteSubject(subjectId: string) {
        const response = await fetch('/api/admin/ucas-subjects', {
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

    const startEditing = (subject: UCASSubject) => {
        setEditingSubjectId(subject.id);
        setEditedName(subject.name);
        setEditedType(subject.type);
        setEditedDescription(subject.description || '');
    };

    const cancelEditing = () => {
        setEditingSubjectId(null);
        setEditedName('');
    };

    return (
        <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Manage UCAS Subjects</h2>

            <div className="mb-8 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Create New UCAS Subject</h3>
                <div className="flex gap-4">
                    <Input
                        placeholder="New subject name (e.g., Computer Science)"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className="flex-grow"
                    />
                    <Select onValueChange={(value: UCASSubjectType) => setNewSubjectType(value)} defaultValue={UCASSubjectType.STEM}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select subject type" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(UCASSubjectType).map(type => (
                                <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleCreateSubject}>Create</Button>
                </div>
            </div>

            <div className="space-y-2">
                {ucasSubjects.map(subject => (
                    <div key={subject.id} className="p-3 bg-muted/50 rounded-lg flex flex-col items-start">
                        {editingSubjectId === subject.id ? (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="flex-grow mr-2" />
                                    <Select onValueChange={(value: UCASSubjectType) => setEditedType(value)} defaultValue={editedType}>
                                        <SelectTrigger className="w-[280px]">
                                            <SelectValue placeholder="Select subject type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(UCASSubjectType).map(type => (
                                                <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button size="sm" onClick={() => handleUpdateSubject(subject.id)}><Save className="h-4 w-4" /></Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEditing}><XIcon className="h-4 w-4" /></Button>
                                </div>
                                <Textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    placeholder="Subject Description"
                                    className="w-full"
                                />
                            </div>
                        ) : (
                            <div className="w-full flex justify-between items-center">
                                <div className="flex-grow">
                                    <span className="font-medium">{subject.name}</span>
                                    <span className="text-sm text-muted-foreground ml-4">{subject.type.replace(/_/g, ' ')}</span>
                                    <p className="text-sm text-muted-foreground mt-1">{subject.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => startEditing(subject)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the UCAS subject and remove it from all courses. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteSubject(subject.id)}>Delete</AlertDialogAction>
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

