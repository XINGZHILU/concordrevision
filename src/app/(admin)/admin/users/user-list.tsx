'use client';

// File: app/admin/users/user-list.tsx

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/lib/components/ui/badge';
import { year_group_names } from "@/lib/consts";

// Define user type with notes count
type UserWithCount = {
    id: string;
    email: string;
    firstname: string | null;
    lastname: string | null;
    year: number;
    teacher: boolean;
    upload_permission: boolean;
    check_waiver: boolean;
    _count: {
        notes: number;
    };
};

interface UserListProps {
    users: UserWithCount[];
}

export default function UserList({ users }: UserListProps) {
    // State for search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [showTeachers, setShowTeachers] = useState<boolean | 'all'>('all');
    const [showUploadPermission, setShowUploadPermission] = useState<boolean | 'all'>('all');

    // Filter users based on search and filters
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.firstname && user.firstname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.lastname && user.lastname.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesTeacher =
                showTeachers === 'all' ||
                (showTeachers === true && user.teacher) ||
                (showTeachers === false && !user.teacher);

            const matchesUploadPermission =
                showUploadPermission === 'all' ||
                (showUploadPermission === true && user.upload_permission) ||
                (showUploadPermission === false && !user.upload_permission);

            return matchesSearch && matchesTeacher && matchesUploadPermission;
        });
    }, [users, searchTerm, showTeachers, showUploadPermission]);

    return (
        <div>

            {/* Search and Filters */}
            <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">
                            Search Users
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="teacherFilter" className="block text-sm font-medium text-foreground mb-1">
                            Role
                        </label>
                        <select
                            id="teacherFilter"
                            value={showTeachers === 'all' ? 'all' : showTeachers ? 'true' : 'false'}
                            onChange={(e) => {
                                const value = e.target.value;
                                setShowTeachers(value === 'all' ? 'all' : value === 'true');
                            }}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                        >
                            <option value="all">All Users</option>
                            <option value="true">Teachers</option>
                            <option value="false">Students</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="permissionFilter" className="block text-sm font-medium text-foreground mb-1">
                            Upload Permission
                        </label>
                        <select
                            id="permissionFilter"
                            value={showUploadPermission === 'all' ? 'all' : showUploadPermission ? 'true' : 'false'}
                            onChange={(e) => {
                                const value = e.target.value;
                                setShowUploadPermission(value === 'all' ? 'all' : value === 'true');
                            }}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                        >
                            <option value="all">All Users</option>
                            <option value="true">With Upload Permission</option>
                            <option value="false">Without Upload Permission</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Count */}
            <h2 className="text-lg font-semibold mb-4">
                Users ({filteredUsers.length})
                {filteredUsers.length !== users.length && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                        (Filtered from {users.length} total)
                    </span>
                )}
            </h2>

            {/* Users List */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {users.length === 0 ? (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No users found</h3>
                            <p className="mt-1 text-muted-foreground">There are no users in the system yet.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No matching users</h3>
                            <p className="mt-1 text-muted-foreground">Try adjusting your search or filter criteria.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Name/Email
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Year Group
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Upload Permission
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Contributions
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-accent">
                                    <td className="px-6 py-4">
                                        <div
                                            className="text-sm font-medium text-foreground">{`${user.firstname} ${user.lastname}` || 'Anonymous User'}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={user.teacher ? 'default' : 'secondary'}>
                                            {user.teacher ? 'Teacher' : 'Student'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {user.year !== -1 ? `${year_group_names[user.year]}` : 'Not specified'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={user.upload_permission ? 'default' : 'destructive'}>
                                            {user.upload_permission ? 'Granted' : 'Not Granted'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {user._count.notes} notes
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="text-primary hover:text-primary/80"
                                            >
                                                View Details
                                            </Link>
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