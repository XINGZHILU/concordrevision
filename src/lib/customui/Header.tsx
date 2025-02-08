'use client';

import React from 'react';

const Header = () => {
    return (
        <div className='py-5 px-5 md:px-12 lg:px-28'>
            <div className='text-center my-8'>
                <h1 className='text-3x1 sm:text-5x1 font-medium'>Latest Notes</h1>
                <p className='mt-10 max-w-[740px] m-auto text-xs sm:text-base'>
                    This website is designed for learning, with notes detailing different gcses and A Level subjects, with practice questions divided by topics
                </p>
                <form className='flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]'>
                    <input type="email" placeholder='Enter your email' className='pl-4 outline-none' />
                    <button type='submit' className='border-1 border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white'>Subscribe</button>
                </form>
            </div>
            <div className='flex justify-center items-center gap-4 mt-8'>

            </div>
        </div>
    );
}

export default Header;