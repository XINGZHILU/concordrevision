'use client';

import React from 'react';
import PomodoroActionBar from "@/lib/customui/Basic/pomodoro_action_bar";
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* About section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">StudyHub</h3>
                        <p className="text-gray-600">
                            Your comprehensive platform for GCSE and A Level revision materials, practice questions, and study resources.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
                            </li>
                            <li>
                                <Link href="/subjects" className="text-gray-600 hover:text-indigo-600">Subjects</Link>
                            </li>
                            <li>
                                <Link href="/resources" className="text-gray-600 hover:text-indigo-600">Resources</Link>
                            </li>
                            <li>
                                <Link href="/tests" className="text-gray-600 hover:text-indigo-600">Tests</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-indigo-600">About</Link>
                            </li>
                            <li>
                                <Link href="/guide" className="text-gray-600 hover:text-indigo-600">Guide</Link>
                            </li>
                            <li>
                                <Link href="/contributors" className="text-gray-600 hover:text-indigo-600">Contributors</Link>
                            </li>
                            <li>
                                <Link href="/thanks" className="text-gray-600 hover:text-indigo-600">Thanks</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Pomodoro Timer */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Timer</h3>
                        <p className="text-gray-600 mb-4">
                            Use our Pomodoro Timer to boost your productivity while studying.
                        </p>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <PomodoroActionBar />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;