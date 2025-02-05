'use client';

import Image from 'next/image'
import React from 'react'
import {assets} from '@/lib/assets'
import Link from 'next/link'

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
            className='w-[330px] sm:w-[300px] h-[120px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000]'>
            <div className='p-5'>
                <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{subject.title}</h5>
                <Link href={`/revision/${subject.id}`} className='inline-flex items-center py-2 font-semibold text-center'>
                    View <Image src={assets.arrow} className='ml-2' alt='Arrow' width={12} height={12}/>
                </Link>
            </div>
        </div>
    );
}