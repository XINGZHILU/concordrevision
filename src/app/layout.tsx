import type { Metadata } from "next";
import "@/app/globals.css";
import { inter } from "@/lib/ui/fonts";
import Link from "next/link";
import Footer from "@/lib/ui/Footer";
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import Image from "next/image";

export const metadata: Metadata = {
    title: "Concord Student Hub",
    description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <head>
                    <title>Concord College tutor notes</title>
                    <link rel="icon" type="image/x-icon"
                        href="https://concordcollegeuk.com/wp-content/uploads/2023/11/logo.svg" />
                    <script type="text/javascript" id="MathJax-script" async
                        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
                    </script>
                </head>

                <body className={inter.className}>

                    <nav
                        className="bg-gray-200 border-gray-500">
                        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                                <Image src="https://concordcollegeuk.com/wp-content/uploads/2023/11/logo.svg" className="h-8"
                                    alt="Concord Logo" width={80} height={80} />
                                <span
                                    className="self-center text-2xl font-semibold whitespace-nowrap">Concord Student Hub</span>
                            </Link>

                            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 "
                                id="navbar-sticky">
                                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-200 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                                    <li>
                                        <Link href="/"
                                            className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0"
                                            aria-current="page">Home</Link>
                                    </li>
                                    <li>
                                        <Link href="/revision"
                                            className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-200 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ">Revision
                                            Notes</Link>
                                    </li>
                                    <li>
                                        <Link href="/olympiads"
                                            className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-200 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ">Olympiads</Link>
                                    </li>
                                    <li>
                                        <Link href="/ec"
                                            className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-200 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ">Extracurriculars</Link>
                                    </li>
                                    <li>
                                        <Link href="/upload"
                                            className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-200 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ">Upload</Link>
                                    </li>
                                    <li>
                                        <SignedOut>
                                            <SignInButton />
                                        </SignedOut>
                                        <SignedIn>
                                            <UserButton />
                                        </SignedIn>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <br />
                    <div className='min-h-screen'>
                        {children}
                    </div>
                    <Footer />
                </body>
            </html>
        </ClerkProvider>
    );
}