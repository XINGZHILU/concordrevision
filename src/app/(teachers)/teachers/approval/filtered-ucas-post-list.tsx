'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

type UCASPostWithAuthor = {
    id: number;
    title: string;
    content: string;
    author: {
        firstname: string | null;
        lastname: string | null;
        email: string;
    };
    tags: string[];
    universities: string[];
    courses: string[];
    uploadedAt: Date;
};

type Tag = {
    id: string;
    name: string;
};

interface FilteredUCASPostListProps {
    posts: UCASPostWithAuthor[];
    tags: Tag[];
}

export default function FilteredUCASPostList({ posts, tags }: FilteredUCASPostListProps) {
    const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');

    const filteredPosts = useMemo(() => {
        if (selectedTag === 'all') {
            return posts;
        }
        return posts.filter(post => post.tags.includes(selectedTag));
    }, [posts, selectedTag]);

    return (
        <div>
            {/* Filter controls */}
            <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
                <h3 className="font-medium text-foreground mb-3">Filter Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="tagFilter" className="block text-sm font-medium text-foreground mb-1">
                            Tag
                        </label>
                        <select
                            id="tagFilter"
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                        >
                            <option value="all">All Tags</option>
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Posts list */}
            <h2 className="text-lg font-semibold mb-4">
                Pending Approvals ({filteredPosts.length})
                {filteredPosts.length !== posts.length && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                        (Filtered from {posts.length} total)
                    </span>
                )}
            </h2>

            {filteredPosts.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {posts.length === 0 ? (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">All caught up!</h3>
                            <p className="mt-1 text-muted-foreground">No UCAS posts are pending approval at this time.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No matching posts</h3>
                            <p className="mt-1 text-muted-foreground">Try changing your filters to see more posts.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-card shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Tags
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Uploaded At
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-accent">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-foreground">{post.title}</div>
                                        <div className="text-sm text-muted-foreground truncate max-w-xs">{post.content.substring(0, 50)}{post.content.length > 50 ? '...' : ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{`${post.author.firstname} ${post.author.lastname}` || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{post.author.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags.map(tagId => {
                                                const tag = tags.find(t => t.id === tagId);
                                                return tag ? <Badge key={tag.id} variant="secondary">{tag.name}</Badge> : null;
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {new Date(post.uploadedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={`/teachers/approval/ucas/${post.id}`}
                                            className="text-primary hover:text-primary/80 px-3 py-1 rounded border border-primary hover:bg-primary/10"
                                        >
                                            Review
                                        </Link>
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