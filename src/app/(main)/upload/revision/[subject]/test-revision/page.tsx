import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import { year_group_names } from "@/lib/consts";
import { currentUser } from '@clerk/nextjs/server'
import { TestLinkCard } from "@/lib/customui/Basic/cards";


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
            tests: true
        }
    });

    if (!subject) {
        notFound();
    }

    subject.tests.sort((a, b) => a.date.getTime() - b.date.getTime());

    const today = new Date();

    const test_list = subject.tests.filter((test) => ((test.date.getTime() - today.getTime()) >= (-86400000))).map((test) => (
        <div key={test.id + 'div'}>
            <TestLinkCard test={test} key={test.id} />
            <br key={test.id + 'br'} />
        </div>
    ));

    return (<div>
        <h1>{year_group_names[subject.level]} {subject.title} test revision material upload</h1>
        <br />
        <h2>Click the test to upload material</h2>
        {test_list}
    </div>)

}