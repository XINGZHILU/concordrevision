import { prisma } from "@/lib/prisma";
import RevisionSubjectList from "@/lib/customui/Revision/RevisionSubjectList";
import {currentUser} from "@clerk/nextjs/server";

export default async function Home() {
    const subjects = await prisma.subject.findMany({
        orderBy: {
            title: 'asc'
        }
    });

    const user = await currentUser();
    if (!user){
        return (
            <>
                <RevisionSubjectList subjects={subjects} year = {0}/>
            </>
        )
    }

    const user_data = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!user_data){
        return <h1>User not found</h1>;
    }

    return (
        <>
            <RevisionSubjectList subjects={subjects} year = {user_data.year}/>
        </>
    )
}
