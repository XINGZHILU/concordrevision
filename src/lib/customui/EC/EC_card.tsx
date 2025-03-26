'use client';

import Link from "next/link";

export function PostCard({ post }: {
    post: {
        title: string,
        id: number
    }
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900">
                {post.title}
            </h3>
            <div className="mt-2">
                <Link
                    href={`/ec/${post.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                    View
                </Link>
            </div>
        </div>
    );
}