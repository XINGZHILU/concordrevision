import {prisma} from "@/lib/prisma";
import SubjectList from "@/lib/customui/UploadSubjectsList";
import { currentUser } from '@clerk/nextjs/server'

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        return <h1>You must login to access this page</h1>;
    }
    
    const subjects = await prisma.subject.findMany({
        orderBy: {
            title: 'asc'
        }
    });

    return (<div>
        <SubjectList subjects={subjects} year={0}></SubjectList>
    </div>);
}