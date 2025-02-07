import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";
import {currentUser} from "@clerk/nextjs/server";
import ColourSelector from "@/lib/ui/ColourSelector";

export default async function Page(req : any, res : any){

    const user = await currentUser();
    if (!user){
        return <h1>You must login to access this page</h1>;
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
        include: {
            notes: true
        }
    });

    if (!subject) {
        notFound();
    }

    const note = subject.notes.filter((note) => note.id === +nid)[0];

    let colour = -1;
    if (note.greenUIDs.includes(user.id)) {
        colour = 0;
    }
    else if (note.amberUIDs.includes(user.id)) {
        colour = 1;
    }
    else if (note.redUIDs.includes(user.id)) {
        colour = 2;
    }

    if (!note) {
        notFound();
    }

    return (<div className="w-full">
        <h1>{year_group_names[subject.level]} {subject.title} - {note.title}</h1>
        <ColourSelector nid={note.id} uid={user.id} subject={subject.id} original={colour}/>
        {note.desc.split('\n').map((line, index) => <p key={index}>{line}</p>)}
        <br/>
        <div className="w-full place-items-center">
            <iframe src={note.filename} width={'90%'} height={600}></iframe>
        </div>
    </div>)
}