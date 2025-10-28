'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/lib/components/ui/button';
import { Olympiad_Resource } from '@prisma/client';
import { toaster } from '@/lib/components/ui/toaster';
import { Input } from '@/lib/components/ui/input';
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

/**
 * Pagination component for resource lists
 */
function Pagination({ totalPages, currentPage, onPageChange }: { totalPages: number, currentPage: number, onPageChange: (page: number) => void }) {
    return (
        <div className="flex justify-center items-center space-x-2 mt-10">
            {currentPage > 1 && (
                <Button onClick={() => onPageChange(currentPage - 1)} variant="outline">
                    Previous
                </Button>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                    variant={currentPage === page ? 'default' : 'outline'}
                >
                    {page}
                </Button>
            ))}

            {currentPage < totalPages && (
                <Button onClick={() => onPageChange(currentPage + 1)} variant="outline">
                    Next
                </Button>
            )}
        </div>
    );
}

/**
 * Teacher olympiad resource list component for deleting resources
 */
export function TeacherOlympiadResourceList({ resources: initialResources }: { resources: (Olympiad_Resource & { author: { id: string, firstname: string | null, lastname: string | null } })[] }) {
    const [resources, setResources] = useState(initialResources);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmText, setConfirmText] = useState<Record<number, string>>({});
    const itemsPerPage = 10;

    const filteredResources = useMemo(() => {
        return resources.filter(resource =>
            resource.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [resources, searchQuery]);

    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const paginatedResources = useMemo(() => {
        return filteredResources.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredResources, currentPage, itemsPerPage]);

    const handleDelete = async (id: number) => {
        if (confirmText[id]?.toLowerCase() !== 'delete') {
            toaster.error({ title: 'Error', description: 'Please type "delete" to confirm.' });
            return;
        }

        const response = await fetch(`/api/admin/olympiads/resources/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setResources(resources.filter(resource => resource.id !== id));
            setConfirmText(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            toaster.success({ title: 'Success', description: 'Resource deleted.' });
        } else {
            const error = await response.json();
            toaster.error({ title: 'Error', description: error.message });
        }
    };

    return (
        <div>
            <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
            />
            <div className="space-y-4">
                {paginatedResources.map(resource => (
                    <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-semibold">{resource.title}</p>
                            <p className="text-sm text-muted-foreground">
                                By {resource.author.firstname} {resource.author.lastname}
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the resource.
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium mb-2">
                                                Type <span className="font-bold text-foreground">delete</span> to confirm:
                                            </label>
                                            <Input
                                                value={confirmText[resource.id] || ''}
                                                onChange={(e) => setConfirmText(prev => ({ ...prev, [resource.id]: e.target.value }))}
                                                placeholder="Type delete"
                                                className="w-full"
                                            />
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setConfirmText(prev => {
                                        const newState = { ...prev };
                                        delete newState[resource.id];
                                        return newState;
                                    })}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => handleDelete(resource.id)}
                                        disabled={confirmText[resource.id]?.toLowerCase() !== 'delete'}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}

