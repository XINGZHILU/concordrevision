/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import FileList from "@/lib/customui/Basic/filelist";
import MDViewer from "@/lib/customui/Basic/showMD";

export default async function Page(req : any, res : any){
    const params = await req.params;
    const oid = params.oid;
    const rid = params.rid;

    if (!isNumeric(oid) || !isNumeric(rid)) {
        notFound();
    }

    const olympiad = await prisma.olympiad.findUnique({
        where: {
            id: +oid
        }
    });

    if (!olympiad) {
        notFound();
    }

    const resource = await prisma.olympiad_Resource.findUnique({
        where: {
            id: +rid
        },
        include: {
            files: true
        }
    });

    if (!resource) {
        notFound();
    }

    if (!resource.approved){
        notFound();
    }

    return (<div className="w-full">
        <h1>{olympiad.title} - {resource.title}</h1>
        <br/>
        <MDViewer content={resource.desc}/>
        <br/>
        <h2>Files</h2>
        <br/>
        <FileList files={resource.files}/>
    </div>)
}