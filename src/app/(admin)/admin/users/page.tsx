// File: app/admin/users/page.tsx

import { prisma } from "@/lib/prisma";
import UserList from "./user-list";

export default async function UserManagementPage() {

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
            {
                lastname: 'asc',
            },
            {
                firstname: 'asc'
            }
        ],
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
            </div>

            <div className="bg-card shadow-md rounded-lg p-6">
                <UserList users={users} />
            </div>
        </div>
    );
}