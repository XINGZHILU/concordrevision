'use client';

import {useState} from "react";
import {year_group_names} from "@/lib/consts";
import Link from "next/link";

export default function SubjectList({subjects, year}: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[], year: number
}) {
    const [menu, setMenu] = useState(year);
    return (<div>
        <div className='flex justify-center gap-6 my-10'>
            {
                year_group_names.map((year, index) => (
                    <button key={index} onClick={() => setMenu(index)}
                            className={menu === index ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>{year}</button>
                ))
            }
        </div>
        <ul>
            {
                subjects.filter((subject) => subject.level === menu).map((subject) => (
                    <li key={subject.title + 'li'}><Link key={subject.title + subject.id} className={'border-dotted border-2 border-blue-500'}
                                                         href={`/upload/${subject.id}`}>{subject.title}</Link></li>)
                )
            }
        </ul>
    </div>)
}