import Link from "next/link";
import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
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
    });

    if (!subject) {
        notFound();
    }


    return <div>
        <Link href={`/upload/revision/${subject.id}/resources`}>Upload resources</Link><br/>
        <Link href={`/upload/revision/${subject.id}/test-revision`}>Upload test revision materials</Link><br/>
        <Link href={`/upload/revision/${subject.id}/create_test`}>Schedule a new test</Link>
    </div>;
}