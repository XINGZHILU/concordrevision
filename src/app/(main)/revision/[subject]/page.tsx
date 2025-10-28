// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import { getYearGroupName, isYearGroupVisible } from "@/lib/year-group-config";
import { currentUser } from "@clerk/nextjs/server";
import SearchableSubjectContent from "@/lib/customui/Revision/SearchableSubjectContent";

 
export default async function Page(req: any, res: any) {

    const params = await req.params;
    const sid = params.subject;

    if (!isNumeric(sid)) {
        notFound();
    }

    const subject = await prisma.subject.findUnique({
        where: {
            id: +sid
        },
        include: {
            notes: {
                where: {
                    approved: true
                },
                orderBy: [
                    {
                        pinned: 'desc'
                    },
                    {
                        uploadedAt: 'desc'
                    }
                ],
                include: {
                    author: {
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true
                        }
                    }
                }
            },
            tests: true
        }
    });

    if (!subject) {
        notFound();
    }

    // Check if the year group is visible
    if (!isYearGroupVisible(subject.level)) {
        notFound();
    }

    // Get user data for color preferences and role information
    const user = await currentUser();
    const colourLinks = user ? await prisma.colourLink.findMany({
        where: {
            userId: user.id,
            subjectId: +sid,
        }
    }) : [];

    // Get user role information for filtering tests
    const dbUser = user ? await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            teacher: true,
            admin: true
        }
    }) : null;

    const yearGroupName = getYearGroupName(subject.level);

    return (
        <SearchableSubjectContent
            subject={subject}
            notes={subject.notes}
            tests={subject.tests}
            userColours={colourLinks}
            yearGroupName={yearGroupName}
            currentUserId={user?.id}
            isTeacherOrAdmin={dbUser?.teacher || dbUser?.admin || false}
        />
    )

}