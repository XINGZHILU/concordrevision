'use client';

import React from 'react'
import PomodoroActionBar from "@/lib/customui/pomodoro_action_bar";
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-white rounded-lg shadow-gray-500 m-4">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center">All rights reserved. ©Joshua Ng, Xingzhi Lu, Christoph Chan 2025</span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
                    <li>
                        <Link href="/about" className="hover:underline me-4 md:me-6">About</Link>
                    </li>
                    <li>
                        <Link href="/guide" className="hover:underline me-4 md:me-6">Guide</Link>
                    </li>
                    <li>
                        <Link href="/contributors" className="hover:underline me-4 md:me-6">Contributors</Link>
                    </li>
                    <li>
                        <Link href="/thanks" className="hover:underline me-4 md:me-6">Thanks</Link>
                    </li>
                    <li>
                        <PomodoroActionBar/>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer