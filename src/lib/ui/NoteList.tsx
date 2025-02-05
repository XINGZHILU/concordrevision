'use client';

import {year_group_names} from "@/lib/consts";
import React, {useState} from 'react'

import {NoteItem} from './NoteItem'

const NoteList = ({subjects, year}: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[], year: number
}) => {

    if (year < 0 || year > 5){
        year = 0;
    }
    const [menu, setMenu] = useState(year);

    return (
        <div>
            <div className='flex justify-center gap-6 my-10'>
                {
                    year_group_names.map((year, index) => (
                        <button key={index} onClick={() => setMenu(index)}
                                className={menu === index ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>{year} Notes</button>
                    ))
                }
            </div>
            <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
                {
                    subjects.filter((subject) => subject.level===menu).map((subject) => {
                        return <NoteItem key={subject.title + subject.id} subject={subject}/>;
                    })
                }
            </div>
        </div>
    )
}

export default NoteList