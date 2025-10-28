// File: app/admin/olympiads/[id]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditOlympiadForm from "@/app/(admin)/admin/olympiads/[id]/edit-olympiad-form";

export default async function EditOlympiadPage({ params }: { params: { id: string } }) {

    const olympiadId = parseInt(params.id);

    if (isNaN(olympiadId)) {
        notFound();
    }

    // Fetch olympiad
    const olympiad = await prisma.olympiad.findUnique({
        where: { id: olympiadId },
        include: {
            _count: {
                select: { resources: true }
            }
        }
    });

    if (!olympiad) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <EditOlympiadForm olympiad={olympiad} />
        </div>
    );
}