import NewTestForm from "@/lib/customui/Upload/test_create_form";
import {isNumeric} from "@/lib/utils";
import {notFound} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {year_group_names} from "@/lib/consts";
import {currentUser} from "@clerk/nextjs/server";

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

    if (!record){
        return <h1>User not found</h1>;
    }

    if (!record.upload_permission){
        return <h1>You do not have permission to access this page</h1>;
    }

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
            notes: true
        }
    });

    if (!subject) {
        notFound();
    }

    return <div>
        <h1>{year_group_names[subject.level]} {subject.title} test scheduling</h1>
        <NewTestForm subject={subject.id}/>
    </div>;
}