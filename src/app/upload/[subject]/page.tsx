import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";
import UploadForm from "@/lib/customui/UploadForm";
import { currentUser } from '@clerk/nextjs/server'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page(req: any, res: any) {
    const params = await req.params;
    const sid = params.subject;
    const user = await currentUser();

    if (!user) {
        return <h1>You must login to access this page</h1>;
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
    
    console.log(subject);

    return (<div>
        <h1>{year_group_names[subject.level]} {subject.title} upload</h1>

        <UploadForm subject={subject.id} author={user.id}></UploadForm>
    </div>)

}