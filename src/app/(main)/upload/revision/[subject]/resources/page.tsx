import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import { year_group_names } from "@/lib/consts";
import ResourceUploadForm from "@/lib/customui/Upload/ResourceUploadForm";
import { currentUser } from '@clerk/nextjs/server'
import { MaxSizeAlert } from "@/lib/customui/Upload/Alert";


// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export default async function Page(req: any, res: any) {
    const params = await req.params;
    const sid = params.subject;
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

    if (!isNumeric(sid)) {
        notFound();
    }

    const subject = await prisma.subject.findUnique({
        where: {
            id: +sid
        },
        include: {
            notes: true
        }
    });

    if (!subject) {
        notFound();
    }


    return (<div>
        <h1>{year_group_names[subject.level]} {subject.title} revision resources upload</h1>
        <MaxSizeAlert/>
        <ResourceUploadForm subject={subject.id} author={user.id}></ResourceUploadForm>
    </div>)

}