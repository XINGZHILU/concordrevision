import { prisma } from "@/lib/prisma";
import RevisionSubjectList from "@/lib/customui/Revision/RevisionSubjectList";
import { currentUser } from "@clerk/nextjs/server";
import PastPapersCard from "@/lib/customui/Revision/PastPapersCard";

export default async function Home() {
    const subjects = await prisma.subject.findMany({
        orderBy: {
            title: 'asc'
        }
    });

    const user = await currentUser();
    if (!user) {
        return (
            <div className="space-y-8">
                <PastPapersCard />
                <RevisionSubjectList subjects={subjects} year={0} />
            </div>
        )
    }

    const user_data = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!user_data) {
        return <h1>User not found</h1>;
    }

    return (
        <div className="space-y-8">
            <PastPapersCard />
            <RevisionSubjectList subjects={subjects} year={user_data.year} />
        </div>
    )
}
