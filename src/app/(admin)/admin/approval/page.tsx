// File: app/admin/approval/page.tsx

import { prisma } from "@/lib/prisma";
import { Tabs } from "@chakra-ui/react";
import FilteredNoteList from "./filtered-note-list";
import FilteredOlympiadResourceList from "./filtered-olympiad-resource-list";
import { LuFolder, LuFlaskConical } from "react-icons/lu"

export default async function AdminApprovalPage() {

    // Fetch unapproved notes
    const unapprovedNotes = await prisma.note.findMany({
        where: {
            approved: false,
        },
        include: {
            subject: {
                select: {
                    id: true,
                    title: true,
                    level: true,
                },
            },
            author: {
                select: {
                    firstname: true,
                    lastname: true,
                    email: true,
                },
            },
            files: true,
        },
        orderBy: {
            id: 'desc',
        },
    });

    // Fetch unapproved olympiad resources
    const unapprovedResources = await prisma.olympiad_Resource.findMany({
        where: {
            approved: false,
        },
        include: {
            olympiad: {
                select: {
                    id: true,
                    title: true,
                    area: true,
                },
            },
            author: {
                select: {
                    firstname: true,
                    lastname: true,
                    email: true,
                },
            },
            files: true,
        },
        orderBy: {
            id: 'desc',
        },
    });

    const totalPendingApprovals = unapprovedNotes.length + unapprovedResources.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Content Approval Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        {totalPendingApprovals} item{totalPendingApprovals !== 1 ? 's' : ''} pending approval
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <Tabs.Root defaultValue="notes" variant="enclosed">
                    <Tabs.List mb="4" bg="bg.muted" rounded="l3" p='1'>
                        <Tabs.Trigger value="notes" p="2">
                            <LuFolder />
                            Notes & Resources ({unapprovedNotes.length})
                        </Tabs.Trigger>
                        <Tabs.Trigger value="olympiads" p="2">
                            <LuFlaskConical />
                            Olympiad Resources ({unapprovedResources.length})
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="notes">
                        <FilteredNoteList notes={unapprovedNotes} />
                    </Tabs.Content>
                    <Tabs.Content value="olympiads">
                        <FilteredOlympiadResourceList resources={unapprovedResources} />
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
}