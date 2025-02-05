'use client';

import React from 'react'
import {assets} from '@/lib/assets'
import Image from 'next/image'

const Footer = () => {
    return (
        <div className='flex justify-around flex-col gap-2 sm:gap-0 sm:flex-row bg-black py-5 items-center'>
            <Image src={assets.cc} alt='' width={120} height={120}/>
            <p className='text-sm text-white'>All rights reserved. ©Joshua Ng, Xingzhi Lu, Christoph Chan 2025</p>  
        </div>
                       

    )
}

export default Footer