import { prisma } from "@/lib/prisma";
import { PostCard } from "@/lib/customui/EC/EC_card";
import Link from "next/link";

export default async function Page() {
    const posts = await prisma.post.findMany();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header section */}
            <div className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Extracurricular Activities</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Discover and share extracurricular opportunities and experiences
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Link
                            href="/ec/new"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create New Post
                        </Link>
                    </div>
                </div>

                {/* Info card */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <div className="bg-indigo-100 rounded-full p-2 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-indigo-900 mb-1">Share Your Extracurricular Experiences</h3>
                            <p className="text-indigo-700 text-sm">
                                Engage with fellow students, share opportunities, and learn about extracurricular activities that can enhance your academic journey.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts grid */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                    Browse Activities ({posts.length})
                </h2>

                {/* This could be expanded to include actual search/filter functionality */}
                <div className="flex space-x-2">
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option>All Categories</option>
                        <option>Sports</option>
                        <option>Academic</option>
                        <option>Arts</option>
                        <option>Community Service</option>
                    </select>

                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        Sort
                    </button>
                </div>
            </div>

            {posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard post={post} key={post.id} />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Posts Available</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-4">
                        There are currently no extracurricular posts. Be the first to share an opportunity!
                    </p>
                    <Link
                        href="/ec/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Create New Post
                    </Link>
                </div>
            )}
        </div>
    );
}