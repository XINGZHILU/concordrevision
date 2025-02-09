import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";

export default async function Page(req : any, res : any){
    const params = await req.params;
    const fileid = params.file;

    if (!isNumeric(fileid)) {
        notFound();
    }

    const file = await prisma.storageFile.findUnique({
        where: {
            id: +fileid
        }
    });

    if (!file) {
        notFound();
    }

    return (<div className={'place-items-center'}>
        <iframe src
        ={file.path} className="w-screen h-screen"></iframe>
    </div>)

}