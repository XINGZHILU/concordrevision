'use client';

import React from 'react';
//import PomodoroActionBar from "@/lib/customui/Basic/pomodoro_action_bar";
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright and All Rights Reserved */}
          <div className="text-sm text-gray-500 order-2 md:order-1 text-center md:text-left">
            All rights reserved. ©Joshua Ng, Xingzhi Lu, Christoph Chan {new Date().getFullYear()}
          </div>

          {/* Links */}
          <ul className="flex flex-wrap items-center gap-4 order-1 md:order-2 justify-center md:justify-end list-none">
            <li>
              <Link href="/about" className="text-sm text-gray-500 hover:text-indigo-600">About</Link>
            </li>
            <li>
              <Link href="/guide" className="text-sm text-gray-500 hover:text-indigo-600">Guide</Link>
            </li>
            <li>
              <Link href="/contributors" className="text-sm text-gray-500 hover:text-indigo-600">Contributors</Link>
            </li>
            <li>
              <Link href="/thanks" className="text-sm text-gray-500 hover:text-indigo-600">Thanks</Link>
            </li>
            {/* 
                        <li>
                            <div className="inline-flex">
                                <PomodoroActionBar />
                            </div>
                        </li>
                        */}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;