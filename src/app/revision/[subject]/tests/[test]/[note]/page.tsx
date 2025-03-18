import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";
import {currentUser} from "@clerk/nextjs/server";
import ColourSelector from "@/lib/customui/Revision/ColourSelector";
import PDFFrame from "@/lib/customui/Basic/pdf_frame";
import FileList from "@/lib/customui/Basic/filelist";


export default async function Page(req : any, res : any){
    function Get_Colour(usr: { red: number[]; amber: number[]; green: number[]}, nid: number) {
        if (usr.red.includes(nid)) {
            return 2;
        }
        else if (usr.amber.includes(nid)) {
            return 1;
        }
        else if (usr.green.includes(nid)) {
            return 0;
        }
        else {
            return -1;
        }
    }

    const user = await currentUser();
    if (!user){
        return <h1>You must login to access this page</h1>;
    }

    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!record){
        return <h1>User not found</h1>;
    }

    const params = await req.params;
    const sid = params.subject;
    const nid = params.note;

    if (!isNumeric(sid) || !isNumeric(nid)) {
        notFound();
    }

    const subject = await prisma.subject.findUnique({
        where: {
            id: +sid
        },
    });

    if (!subject) {
        notFound();
    }

    const note = await prisma.note.findUnique({
        where: {
            id: +nid
        },
        include: {
            files: true
        }
    });

    if (!note) {
        notFound();
    }

    const colour = Get_Colour(record, note.id);

    if (!note) {
        notFound();
    }

    return (<div className="w-full">
        <h1>{year_group_names[subject.level]} {subject.title} - {note.title}</h1>
        <br/>
        <ColourSelector nid={note.id} uid={user.id} subject={subject.id} original={colour}/>
        <br/>
        {note.desc.split('\n').map((line, index) => <p  key={index}>{line}</p>)}
        <br/>
        <h2>Files</h2>
        <br/>
        <FileList files={note.files}/>
    </div>)
}