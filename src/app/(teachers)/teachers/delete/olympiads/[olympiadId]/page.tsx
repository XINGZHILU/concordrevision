import { prisma } from "@/lib/prisma";
import { TeacherOlympiadResourceList } from "../../olympiad-resource-list";
import { Olympiad_Resource } from "@prisma/client";

export default async function TeacherDeleteOlympiadPage({ params }: { params: { olympiadId: string } }) {
    const page_params = await params;
    const olympiad = await prisma.olympiad.findUnique({
        where: { id: parseInt(page_params.olympiadId) },
    });
    const resources = await prisma.olympiad_Resource.findMany({
        where: { olympiadId: parseInt(page_params.olympiadId) },
        include: {
            author: true,
        },
    });

    if (!olympiad) {
        return <h1>Olympiad not found</h1>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-2">Delete Resources for {olympiad.title}</h1>
            <p className="text-muted-foreground mb-8">
                View and delete resources for this olympiad.
            </p>
            <TeacherOlympiadResourceList resources={resources as (Olympiad_Resource & { author: { id: string, firstname: string | null, lastname: string | null } })[]} />
        </div>
    );
}

