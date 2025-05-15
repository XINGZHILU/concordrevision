import { prisma } from "@/lib/prisma";
import { OlympiadsUploadList } from "@/lib/customui/Olympiads/olympiadslist";
import { currentUser } from "@clerk/nextjs/server";



export default async function Page() {
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

    const olympiads = await prisma.olympiad.findMany();
    return <div>
        <OlympiadsUploadList olympiads={olympiads} />
    </div>;
}