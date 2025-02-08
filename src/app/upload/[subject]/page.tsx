import Link from "next/link";
import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";


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
            notes: true
        }
    });

    if (!subject) {
        notFound();
    }


    return <div>
        <Link href={`/upload/${subject.id}/resources`}>Upload resources</Link><br/>
        <Link href={`/upload/${subject.id}/test-revision`}>Upload test revision materials</Link>
    </div>;
}