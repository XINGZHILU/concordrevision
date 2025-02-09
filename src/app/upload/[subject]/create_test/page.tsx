import NewTestForm from "@/lib/customui/test_create_form";
import {isNumeric} from "@/lib/utils";
import {notFound} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {year_group_names} from "@/lib/consts";

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
        <h1>{year_group_names[subject.level]} {subject.title} test scheduling</h1>
        <NewTestForm subject={subject.id}/>
    </div>;
}