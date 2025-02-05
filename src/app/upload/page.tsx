import {prisma} from "@/lib/prisma";
import SubjectList from "@/lib/ui/SubjectsList";

export default async function Page() {
    const subjects = await prisma.subject.findMany();

    return (<div>
        <SubjectList subjects={subjects} year={0}></SubjectList>
    </div>);
}