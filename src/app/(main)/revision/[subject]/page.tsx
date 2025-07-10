// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import { year_group_names } from "@/lib/consts";
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

    // Get user data for color preferences
    const user = await currentUser();
    let userColours: { red: number[]; amber: number[]; green: number[] } | undefined;

    if (user) {
        const record = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (record) {
            userColours = {
                red: record.red,
                amber: record.amber,
                green: record.green
            };
        }
    }

    return (
        <SearchableSubjectContent
            subject={subject}
            notes={subject.notes}
            tests={subject.tests}
            userColours={userColours}
            yearGroupName={year_group_names[subject.level]}
            currentUserId={user?.id}
        />
    )

}