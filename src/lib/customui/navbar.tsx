'use client';

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function NavBar({can_upload, teacher} : {can_upload : boolean, teacher: boolean}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Function to determine if a link is active
    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') {
            return true;
        }
        if (!pathname){
            return false;
        }
        return path !== '/' && pathname.startsWith(path);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">Online Student Hub</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <div className="flex space-x-4 items-center">
                            <Link
                                href="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive('/')
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/revision"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive('/revision')
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                Revision
                            </Link>
                            <Link
                                href="/olympiads"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive('/olympiads')
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                Olympiads
                            </Link>
                            <Link
                                href="/ec"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive('/ec')
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                Extracurriculars
                            </Link>

                            {can_upload ? (<Link
                                    href="/upload"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/upload')
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Upload
                                </Link>
                            ) : (<></>)}

                            {teacher ? (<Link
                                    href="/admin"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/admin')
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Admin
                                </Link>
                            ) : (<></>)}

                            <div className="ml-4 flex items-center">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Sign in
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: "w-8 h-8"
                                            }
                                        }}
                                        afterSignOutUrl="/"
                                    />
                                </SignedIn>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center">
                        <SignedIn>
                            <div className="mr-4">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-8 h-8"
                                        }
                                    }}
                                    afterSignOutUrl="/"
                                />
                            </div>
                        </SignedIn>

                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMobileMenuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                        <Link
                            href="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive('/')
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/revision"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive('/revision')
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Revision
                        </Link>
                        <Link
                            href="/olympiads"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive('/olympiads')
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Olympiads
                        </Link>
                        <Link
                            href="/ec"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive('/ec')
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Extracurriculars
                        </Link>
                        <Link
                            href="/upload"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive('/upload')
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Upload
                        </Link>
                        <SignedOut>
                            <div className="mt-4 px-3">
                                <SignInButton mode="modal">
                                    <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Sign in
                                    </button>
                                </SignInButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    );
}