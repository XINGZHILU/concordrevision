/* eslint-disable @typescript-eslint/no-unused-vars */

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OlympiadUploadForm from "@/lib/customui/Upload/OlympiadUploadForm";
import { currentUser } from "@clerk/nextjs/server";
import { MaxSizeAlert } from "@/lib/customui/Upload/Alert";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page(req: any, res: any) {
    const user = await currentUser();

    if (!user) {
        return <h1>You must login to access this page</h1>;
    }

    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!record) {
        return <h1>User not found</h1>;
    }

    if (!record.upload_permission) {
        return <h1>You do not have permission to access this page</h1>;
    }

    const params = await req.params;
    const oid = params.oid;

    const olympiad = await prisma.olympiad.findUnique({
        where: {
            id: +oid
        },
        include: {
            resources: true
        }
    });

    if (!olympiad) {
        notFound();
    }


    return <div>
        <h1>{olympiad.title} upload</h1>
        <MaxSizeAlert />
        <OlympiadUploadForm olympiad={olympiad.id} author={user.id} />
    </div>;
}