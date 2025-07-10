'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <div className='py-20 px-5 md:px-12 lg:px-28 rounded-lg'>
            <div className='text-center my-8'>
                <h1 className='text-4xl sm:text-6xl font-bold font-heading text-concord-primary'>
                    Concord Revision Hub
                </h1>
                <p className='mt-10 max-w-[740px] m-auto text-lg sm:text-xl text-concord-text'>
                    Your central place for revision notes, practice questions, and collaborative learning, tailored for your academic success.
                </p>
            </div>
            <div className='flex justify-center items-center gap-4 mt-8'>
                <Link href="/revision"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-concord-primary hover:bg-concord-primary-dark">
                    Browse Subjects
                </Link>
            </div>
        </div>
    );
}

export default Header;