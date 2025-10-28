'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/lib/components/ui/button';
import { UCASPost } from '@prisma/client';
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
 * Pagination component for UCAS post lists
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
 * Teacher UCAS post list component for deleting posts
 */
export function TeacherUCASPostList({ posts: initialPosts }: { posts: (UCASPost & { author: { id: string, firstname: string | null, lastname: string | null } })[] }) {
    const [posts, setPosts] = useState(initialPosts);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmText, setConfirmText] = useState<Record<number, string>>({});
    const itemsPerPage = 10;

    const filteredPosts = useMemo(() => {
        return posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [posts, searchQuery]);

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const paginatedPosts = useMemo(() => {
        return filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredPosts, currentPage, itemsPerPage]);

    const handleDelete = async (id: number) => {
        if (confirmText[id]?.toLowerCase() !== 'delete') {
            toaster.error({ title: 'Error', description: 'Please type "delete" to confirm.' });
            return;
        }

        const response = await fetch(`/api/admin/ucas/posts/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setPosts(posts.filter(post => post.id !== id));
            setConfirmText(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            toaster.success({ title: 'Success', description: 'Post deleted.' });
        } else {
            const error = await response.json();
            toaster.error({ title: 'Error', description: error.message });
        }
    };

    return (
        <div>
            <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
            />
            <div className="space-y-4">
                {paginatedPosts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-semibold">{post.title}</p>
                            <p className="text-sm text-muted-foreground">
                                By {post.author.firstname} {post.author.lastname}
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
                                        This action cannot be undone. This will permanently delete the post.
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium mb-2">
                                                Type <span className="font-bold text-foreground">delete</span> to confirm:
                                            </label>
                                            <Input
                                                value={confirmText[post.id] || ''}
                                                onChange={(e) => setConfirmText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                placeholder="Type delete"
                                                className="w-full"
                                            />
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setConfirmText(prev => {
                                        const newState = { ...prev };
                                        delete newState[post.id];
                                        return newState;
                                    })}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => handleDelete(post.id)}
                                        disabled={confirmText[post.id]?.toLowerCase() !== 'delete'}
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

