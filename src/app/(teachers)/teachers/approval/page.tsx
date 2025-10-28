// File: app/teachers/approval/page.tsx

import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import FilteredNoteList from "@/app/(teachers)/teachers/approval/filtered-note-list";
import FilteredOlympiadResourceList from "@/app/(teachers)/teachers/approval/filtered-olympiad-resource-list";
import { LuFolder, LuFlaskConical, LuNewspaper } from "react-icons/lu"
import FilteredUCASPostList from "@/app/(teachers)/teachers/approval/filtered-ucas-post-list";

export default async function ApprovalPage() {

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

    const unapprovedUCASPosts = await prisma.uCASPost.findMany({
        where: {
            approved: false,
        },
        include: {
            author: {
                select: {
                    firstname: true,
                    lastname: true,
                    email: true,
                },
            },
        },
        orderBy: {
            uploadedAt: 'desc',
        },
    });

    const tags = await prisma.tag.findMany();

    const totalPendingApprovals = unapprovedNotes.length + unapprovedResources.length + unapprovedUCASPosts.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Content Approval Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        {totalPendingApprovals} item{totalPendingApprovals !== 1 ? 's' : ''} pending approval
                    </p>
                </div>
            </div>

            <div className="bg-card shadow-md rounded-lg p-6 mb-6">
                <Tabs defaultValue="notes">
                    <TabsList>
                        <TabsTrigger value="notes">
                            <LuFolder className="mr-2" />
                            Notes & Resources ({unapprovedNotes.length})
                        </TabsTrigger>
                        <TabsTrigger value="olympiads">
                            <LuFlaskConical className="mr-2" />
                            Olympiad Resources ({unapprovedResources.length})
                        </TabsTrigger>
                        <TabsTrigger value="ucas">
                            <LuNewspaper className="mr-2" />
                            UCAS Posts ({unapprovedUCASPosts.length})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="notes">
                        <FilteredNoteList notes={unapprovedNotes} />
                    </TabsContent>
                    <TabsContent value="olympiads">
                        <FilteredOlympiadResourceList resources={unapprovedResources} />
                    </TabsContent>
                    <TabsContent value="ucas">
                        <FilteredUCASPostList posts={unapprovedUCASPosts} tags={tags} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 