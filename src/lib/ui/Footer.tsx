'use client';

import React from 'react'
import {assets} from '@/lib/assets'
import Image from 'next/image'
import Timer from './timer'
import Timer2 from './gcsetimer'

const Footer = () => {
    return (
        <div className='flex justify-around flex-col gap-2 sm:gap-0 sm:flex-row bg-black py-5 items-center'>
            <Image src={assets.cc} alt='' width={120} height={120}/>
            <p className='text-sm text-white'>All rights reserved. Copyright @students</p>  
                <div className='flex'>
                    <Image src={assets.ig} alt='' width={100} height={120}/>
                    <Image src={assets.teams} alt='' width={100} height={120}/>
                </div>
        </div>
                       

    )
}

export default Footer