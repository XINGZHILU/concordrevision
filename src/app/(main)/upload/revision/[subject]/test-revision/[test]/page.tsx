import { prisma } from "@/lib/prisma";
import { isNumeric } from "@/lib/utils";
import { year_group_names } from "@/lib/consts";
import { currentUser } from '@clerk/nextjs/server'
import TestUploadForm from "@/lib/customui/Upload/TestUploadForm";
import { MaxSizeAlert } from "@/lib/customui/Upload/Alert";


// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export default async function Page(req: any, res: any) {
    const params = await req.params;
    const sid = params.subject;
    const user = await currentUser();
    const test = params.test as string;

    if (!user) {
        return <h1>You must login to access this page</h1>;
    }

    if (!isNumeric(sid) || !isNumeric(test)) {
        return <h1>Invalid subject or test</h1>;
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
        return <h1>Subject not found</h1>;
    }

    const test_record = await prisma.test.findUnique({
        where: {
            id: +test,
            subjectId: subject.id
        }
    });



    if (!test_record) {
        return <h1>Test not found</h1>;
    }


    if (test_record.type === 2) {
        return (<div>
            <h1>{year_group_names[subject.level]} {subject.title} revision resources upload</h1>

            <TestUploadForm subject={subject.id} author={user.id} test={test_record.id} type={1}></TestUploadForm>
        </div>);
    }
    else {
        return (<div>
            <h1>{year_group_names[subject.level]} {subject.title} revision resources upload</h1>
            <MaxSizeAlert />
            <TestUploadForm subject={subject.id} author={user.id} test={test_record.id} type={0}></TestUploadForm>
        </div>);
    }



}