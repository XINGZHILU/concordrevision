'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { toaster, Toaster } from "@/components/ui/toaster";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { olympiad_subjects } from "@/lib/consts";

type OlympiadWithCount = {
    id: number;
    title: string;
    desc: string;
    area: string;
    links: string[];
    _count: {
        resources: number;
    };
};

interface OlympiadListProps {
    olympiads: OlympiadWithCount[];
}

export default function OlympiadList({ olympiads }: OlympiadListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArea, setSelectedArea] = useState<string | 'all'>('all');
    const [isDeleting, setIsDeleting] = useState(false);

    const uniqueAreas = useMemo(() => {
        return olympiad_subjects;
    }, []);

    const filteredOlympiads = useMemo(() => {
        return olympiads.filter(olympiad => {
            const matchesSearch = olympiad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                olympiad.desc.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesArea = selectedArea === 'all' || olympiad.area === selectedArea;
            return matchesSearch && matchesArea;
        });
    }, [olympiads, searchTerm, selectedArea]);

    const handleDeleteOlympiad = async (olympiadId: number) => {
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/olympiads/${olympiadId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete olympiad');
            }

            window.location.reload();
        } catch (error) {
            console.error('Error deleting olympiad:', error);
            toaster.error({
                title: "Error",
                description: "Failed to delete olympiad. Please try again."
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <Toaster />
            <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">
                            Search Olympiads
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                id="search"
                                placeholder="Search by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="areaFilter" className="block text-sm font-medium text-foreground mb-1">
                            Subject Area
                        </label>
                        <Select onValueChange={(value) => setSelectedArea(value === 'all' ? 'all' : value)} defaultValue="all">
                            <SelectTrigger id="areaFilter">
                                <SelectValue placeholder="All Areas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Areas</SelectItem>
                                {uniqueAreas.map((area) => (
                                    <SelectItem key={area} value={area}>
                                        {area}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-4 text-foreground">
                Olympiads ({filteredOlympiads.length})
                {filteredOlympiads.length !== olympiads.length && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                        (Filtered from {olympiads.length} total)
                    </span>
                )}
            </h2>

            {filteredOlympiads.length === 0 ? (
                 <div className="text-center py-10 bg-card rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    {olympiads.length === 0 ? (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No olympiads found</h3>
                            <p className="mt-1 text-muted-foreground">Get started by adding your first olympiad.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No matching olympiads</h3>
                            <p className="mt-1 text-muted-foreground">Try adjusting your search or filter criteria.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Subject Area
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Resources
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredOlympiads.map((olympiad) => (
                                <tr key={olympiad.id} className="hover:bg-accent">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-foreground">{olympiad.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge>
                                            {olympiad.area}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-muted-foreground line-clamp-2">{olympiad.desc}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {olympiad._count.resources}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Button variant="link" asChild>
                                                <Link
                                                    href={`/admin/olympiads/${olympiad.id}`}
                                                >
                                                    Edit
                                                </Link>
                                            </Button>
                                            <DialogRoot>
                                                <DialogTrigger asChild>
                                                    <Button variant="link" className="text-red-600" disabled={olympiad._count.resources > 0}>
                                                        Delete
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Olympiad</DialogTitle>
                                                    </DialogHeader>
                                                    <DialogDescription>
                                                        Are you sure you want to delete the olympiad <strong>{olympiad.title}</strong>?
                                                        {olympiad._count.resources > 0 ? (
                                                            <div className="bg-amber-500/10 text-amber-500 p-3 rounded border border-amber-500/20 text-sm mt-2">
                                                                <strong>Warning:</strong> This olympiad has {olympiad._count.resources} resources associated with it. Please reassign or delete these resources before deleting the olympiad.
                                                            </div>
                                                        ) : (
                                                            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
                                                        )}
                                                    </DialogDescription>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="ghost">Cancel</Button>
                                                        </DialogClose>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleDeleteOlympiad(olympiad.id)}
                                                            disabled={olympiad._count.resources > 0 || isDeleting}
                                                        >
                                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </DialogRoot>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}