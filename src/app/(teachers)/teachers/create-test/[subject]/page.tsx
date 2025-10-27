import NewTestForm from "@/lib/customui/Upload/test_create_form";
import { prisma } from "@/lib/prisma";
import { getYearGroupName } from "@/lib/year-group-config";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { subject: string } }) {
    const user = await currentUser();

    if (!user) {
        return redirect('/sign-in');
    }

    const subjectId = parseInt(params.subject, 10);

    if (isNaN(subjectId)) {
        return redirect('/teachers/create-test');
    }

    const subject = await prisma.subject.findUnique({
        where: {
            id: subjectId
        }
    });

    if (!subject) {
        return redirect('/teachers/create-test');
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Create a Test for {getYearGroupName(subject.level)} {subject.title}</h1>
            <NewTestForm subject={subject.id} />
        </div>
    );
} 