'use client';

import Image from 'next/image'
import React from 'react'
import {assets} from '@/lib/assets'
import Link from 'next/link'
import {year_group_names} from "@/lib/consts";

export function NoteItem({subject}: {
    subject: {
        id: number,
        title: string,
        desc: string,
        level: number
    }
}) {

    return (
        <div
            className='max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000]'>
            <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{year_group_names[subject.level]}</p>
            <div className='p-5'>
                <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{subject.title}</h5>
                <p className='mb-3 text-sm tracking-tight text-gray-700'>{subject.desc}</p>
                <Link href={`/revision/${subject.id}`} className='inline-flex items-center py-2 font-semibold text-center'>
                    View <Image src={assets.arrow} className='ml-2' alt='Arrow' width={12} height={12}/>
                </Link>
            </div>
        </div>
    );
}