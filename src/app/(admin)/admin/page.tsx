// File: app/admin/page.tsx

import React from 'react';
import Link from 'next/link';
import { prisma } from "@/lib/prisma";

// Admin dashboard card component
function AdminCard({ title, description, icon, href, count, variant = "primary" }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    count?: number;
    variant?: "primary" | "secondary" | "warning" | "success";
}) {
    // Define color variants
    const variants = {
        primary: "bg-indigo-50 border-indigo-200 text-indigo-700",
        secondary: "bg-purple-50 border-purple-200 text-purple-700",
        warning: "bg-amber-50 border-amber-200 text-amber-700",
        success: "bg-green-50 border-green-200 text-green-700"
    };

    const colorClass = variants[variant];

    return (
        <Link href={href} className="block">
            <div className={`border rounded-lg p-6 transition-all hover:shadow-md ${colorClass}`}>
                <div className="flex justify-between items-start">
                    <div className="flex-shrink-0">
                        {icon}
                    </div>
                    {count !== undefined && (
                        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-white">
                            {count}
                        </span>
                    )}
                </div>
                <h3 className="mt-4 text-lg font-medium">{title}</h3>
                <p className="mt-1 text-sm opacity-80">{description}</p>
            </div>
        </Link>
    );
}

export default async function AdminHomePage() {

    // Fetch some stats for the dashboard
    const unapprovedNotesCount = await prisma.note.count({
        where: {
            approved: false,
        },
    });

    const olympiadResourcesCount = await prisma.olympiad_Resource.count();

    const unapprovedOlympiadResourcesCount = await prisma.olympiad_Resource.count({
        where: {
            approved: false,
        },
    });

    const totalNotesCount = await prisma.note.count();
    const totalResourcesCount = totalNotesCount - unapprovedNotesCount + olympiadResourcesCount - unapprovedOlympiadResourcesCount;

    const unapprovedCount = unapprovedNotesCount + unapprovedOlympiadResourcesCount;

    const totalSubjectsCount = await prisma.subject.count();

    const totalUsersCount = await prisma.user.count();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-lg text-gray-600">
                    Manage content, users, and system settings
                </p>
            </div>

            {/* Quick stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Pending Approvals</h2>
                            <p className="text-2xl font-semibold text-gray-900">{unapprovedCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Total Resources</h2>
                            <p className="text-2xl font-semibold text-gray-900">{totalResourcesCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Subjects</h2>
                            <p className="text-2xl font-semibold text-gray-900">{totalSubjectsCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Users</h2>
                            <p className="text-2xl font-semibold text-gray-900">{totalUsersCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin functions */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Functions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <AdminCard
                    title="Resource Approval"
                    description="Review and approve submitted notes and resources"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    href="/admin/approval"
                    count={unapprovedCount}
                    variant={unapprovedCount > 0 ? "warning" : "primary"}
                />

                <AdminCard
                    title="User Management"
                    description="Manage user accounts and permissions"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                    href="/admin/users"
                    variant="secondary"
                />

                <AdminCard
                    title="Subject Management"
                    description="Add, edit, or remove subjects and categories"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    }
                    href="/admin/subjects"
                    variant="success"
                />

                <AdminCard
                    title="System Settings"
                    description="Configure system-wide settings and preferences"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                    href="/admin/settings"
                    variant="secondary"
                />

                <AdminCard
                    title="Olympiad Management"
                    description="Manage olympiad resources and categories"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    }
                    href="/admin/olympiads"
                    variant="primary"
                />

                <AdminCard
                    title="Return to Site"
                    description="Go back to the main student portal"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    }
                    href="/"
                    variant="success"
                />
            </div>

            {/* Recent activity section - could be implemented later */}
            {/*
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <p className="text-gray-600 text-center py-4">
                        Recent activity tracking will be implemented in a future update.
                    </p>
                </div>
            </div>
            */}
        </div>
    );
}