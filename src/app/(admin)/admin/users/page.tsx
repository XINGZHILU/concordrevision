// File: app/admin/users/page.tsx

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserList from "./user-list";

export default async function UserManagementPage() {
    // Check if user is authenticated
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    // Fetch all users with counts
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: {
                    notes: true,
                },
            },
        },
        orderBy: [
            { name: 'asc' },
        ],
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <UserList users={users} />
            </div>
        </div>
    );
}