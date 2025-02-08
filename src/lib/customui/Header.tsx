'use client';

import React from 'react';

const Header = () => {
    return (
        <div className='py-5 px-5 md:px-12 lg:px-28'>
            <div className='text-center my-8'>
                <h1 className='text-3x1 sm:text-5x1 font-medium'>Latest Notes</h1>
                <p className='mt-10 max-w-[740px] m-auto text-xs sm:text-base'>
                    This website is designed for learning, with notes detailing different GCSEs and A Level subjects and practice questions divided by topics
                </p>
            </div>
            <div className='flex justify-center items-center gap-4 mt-8'>

            </div>
        </div>
    );
}

export default Header;