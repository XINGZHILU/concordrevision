'use client'

import {useState} from "react";
import {olympiad_subjects} from "@/lib/consts";
import {OlympiadCard} from "@/lib/customui/cards";
import Link from "next/link";

export default function OlympiadsList({olympiads}: {
    olympiads: {
        id: number,
        title: string,
        desc: string
        area: string
    }[]
}) {
    const [menu, setMenu] = useState(olympiad_subjects[0]);
    return <div className={'content-center'}>
        <div className='flex justify-center gap-6 my-10'>
            {
                olympiad_subjects.map((area, index) => (
                    <button key={index} onClick={() => setMenu(area)}
                            className={area === menu ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>{area}</button>
                ))
            }
        </div>
        <div className={"flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24"}>
            {
                olympiads.filter((olympiad) => olympiad.area === menu).map((olympiad) => (
                    <OlympiadCard key={olympiad.id} olympiad={olympiad}/>)
                )
            }
        </div>
    </div>;
}

export function OlympiadsUploadList({olympiads}: {
    olympiads: {
        id: number,
        title: string,
        desc: string
        area: string
    }[]
}) {
    const [menu, setMenu] = useState(olympiad_subjects[0]);
    return <div className={'content-center'}>
        <div className='flex justify-center gap-6 my-10'>
            {
                olympiad_subjects.map((area, index) => (
                    <button key={index} onClick={() => setMenu(area)}
                            className={area === menu ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>{area}</button>
                ))
            }
        </div>
        <div className={"flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24"}>
            {
                olympiads.filter((olympiad) => olympiad.area === menu).map((olympiad) => (
                    <Link href={`/upload/olympiads/${olympiad.id}`} key={olympiad.id}>{olympiad.title}</Link>)
                )
            }
        </div>
    </div>;
}