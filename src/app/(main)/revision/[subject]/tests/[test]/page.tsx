/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";
import {currentUser} from "@clerk/nextjs/server";
import {TestNoteCard} from "@/lib/customui/Basic/cards";
import MDViewer from "@/lib/customui/Basic/showMD";
import { TestBadge } from "@/lib/customui/Basic/Badges";


export default async function Page(req: any, res: any) {
    function Get_Colour(usr: { red: number[]; amber: number[]; green: number[] }, nid: number) {
        if (usr.red.includes(nid)) {
            return 2;
        } else if (usr.amber.includes(nid)) {
            return 1;
        } else if (usr.green.includes(nid)) {
            return 0;
        } else {
            return -1;
        }
    }


    const params = await req.params;
    const sid = params.subject;
    const tid = params.test;

    if (!isNumeric(sid) || !isNumeric(tid)) {
        notFound();
    }

    const subject = await prisma.subject.findUnique({
        where: {
            id: +sid
        },
        include: {
            notes: true,
            tests: true
        }
    });

    if (!subject) {
        notFound();
    }

    const test = await prisma.test.findUnique({
        where: {
            id: +tid
        },
        include: {
            notes: true
        }
    });

    if (!test) {
        notFound();
    }

    const notes = test.notes.filter((note) => {return (note.approved)});

    const user = await currentUser();
    if (!user) {
        return (<div className="w-full">
            <h1>{year_group_names[subject.level]} {subject.title} - {test.title}</h1>
            <br/>
            <ul>
                <li><b>Test
                    Type:</b> <TestBadge type={test.type}/>
                </li>
                <li><b>Test Date:</b> {test.date.toDateString()}</li>
            </ul>
            <br/>
            <h2>Information</h2>
            <MDViewer content={test.desc}/>
    
            <br/>
            <h2>Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-h-screen overflow-y-scroll">
                {
                    notes.length === 0 ? (
                        <p>No notes found</p>
                    ) : (
                        notes.map((note) => {
                            // @ts-ignore
                            return <div key={note.id + 'div'}> <TestNoteCard note={note} key={note.id} colour={-1}/>
                                <br key={note.id + 'br'}/>
                            </div>;
                        })
                    )
                }
            </div>
        </div>)
    }

    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!record) {
        return <h1>User not found</h1>;
    }

    return (<div className="w-full">
        <h1>{year_group_names[subject.level]} {subject.title} - {test.title}</h1>
        <br/>
        <ul>
            <li><b>Test
                Type:</b> {test.type === 0 ? 'Saturday Test' : test.type === 1 ? 'End of term exam' : 'Public exam'}
            </li>
            <li><b>Test Date:</b> {test.date.toDateString()}</li>
        </ul>
        <br/>
        <h2>Information</h2>
        <MDViewer content={test.desc}/>
        <br/>
        <h2>Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-h-screen overflow-y-scroll">
            {
                notes.length === 0 ? (
                    <p>No notes found</p>
                ) : (
                    notes.map((note) => {
                        // @ts-ignore
                        return <div key={note.id + 'div'}> <TestNoteCard note={note} key={note.id} colour={Get_Colour(record, note.id)}/>
                            <br key={note.id + 'br'}/>
                        </div>;
                    })
                )
            }
        </div>
    </div>)
}