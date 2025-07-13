import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditOlympiadResourceForm from "@/lib/customui/Upload/EditOlympiadResourceForm";
import { currentUser } from "@clerk/nextjs/server";
import { isNumeric } from "@/lib/utils";

export default async function EditOlympiadResourcePage({ params }: { params: { oid: string, rid: string } }) {
    const user = await currentUser();
    if (!user) {
        return <p>Please sign in to edit resources.</p>;
    }

    if (!isNumeric(params.oid) || !isNumeric(params.rid)) {
        notFound();
    }

    const resourceId = parseInt(params.rid, 10);
    const olympiadId = parseInt(params.oid, 10);

    const resource = await prisma.olympiad_Resource.findUnique({
        where: { id: resourceId },
        include: { files: true, author: true }
    });

    if (!resource) {
        notFound();
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

    if (!dbUser) {
      notFound();
  }

    if ((resource.author.id !== user.id) && !dbUser.admin) {
        return <p>You do not have permission to edit this resource.</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Olympiad Resource</h1>
            <EditOlympiadResourceForm
                resourceId={resourceId}
                olympiadId={olympiadId}
                initialData={{
                    title: resource.title,
                    description: resource.desc,
                    files: resource.files,
                }}
            />
        </div>
    );
} 