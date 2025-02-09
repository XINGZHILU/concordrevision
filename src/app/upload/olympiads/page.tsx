import {prisma} from "@/lib/prisma";
import {OlympiadsUploadList} from "@/lib/customui/olympiadslist";



export default async function Page() {
    const olympiads = await prisma.olympiad.findMany();
    return <div>
        <OlympiadsUploadList olympiads={olympiads}/>
    </div>;
}