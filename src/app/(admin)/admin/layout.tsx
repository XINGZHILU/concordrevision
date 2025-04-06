import type {Metadata} from "next";
import "@/app/globals.css";
import "@/app/md.css";
import {ClerkProvider, SignedIn, UserButton} from "@clerk/nextjs";
import {currentUser} from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Student Hub",
    description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};
import {Provider} from "@/components/ui/provider"
import {notFound} from "next/navigation";
import Link from "next/link";


export default async function RootLayout({children}: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user) {
        notFound();
    }
    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });
    if (!record) {
        return <h1>User not found</h1>;
    }
    if (!record.teacher){
        notFound();
    }

    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning={true}>
            <head>
                <title>Student Hub</title>
                <meta charSet="utf-8"/>
            </head>

            <body>


            <Provider>
                <div className="min-h-screen bg-gray-50">
                    {/* Admin Header */}
                    <header className="bg-indigo-700 text-white shadow-md">
                        <div className="container mx-auto px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link href="/admin" className="font-bold text-xl">
                                        Admin Portal
                                    </Link>

                                    <nav className="hidden md:flex space-x-4">
                                        <Link href="/admin/approval" className="hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-600">
                                            Resource Approvals
                                        </Link>
                                        <Link href="/admin/users" className="hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-600">
                                            Users
                                        </Link>
                                        <Link href="/admin/subjects" className="hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-600">
                                            Subjects
                                        </Link>
                                        <Link href="/admin/olympiads" className="hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-600">
                                            Olympiads
                                        </Link>
                                    </nav>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Link href="/" className="hover:text-indigo-200 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        Main Site
                                    </Link>

                                    <SignedIn>
                                        <div className="mr-4">
                                            <UserButton
                                                appearance={{
                                                    elements: {
                                                        userButtonAvatarBox: "w-8 h-8"
                                                    }
                                                }}
                                            />
                                        </div>
                                    </SignedIn>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Mobile Navigation */}
                    <div className="md:hidden bg-indigo-800 text-white">
                        <div className="container mx-auto px-4 py-2">
                            <nav className="flex overflow-x-auto space-x-4 scrollbar-hide pb-1">
                                <Link href="/admin" className="whitespace-nowrap hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-700">
                                    Dashboard
                                </Link>
                                <Link href="/admin/approval" className="whitespace-nowrap hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-700">
                                    Approvals
                                </Link>
                                <Link href="/admin/users" className="whitespace-nowrap hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-700">
                                    Users
                                </Link>
                                <Link href="/admin/subjects" className="whitespace-nowrap hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-700">
                                    Subjects
                                </Link>
                                <Link href="/admin/olympiads" className="whitespace-nowrap hover:text-indigo-200 px-2 py-1 rounded hover:bg-indigo-700">
                                    Olympiads
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main content */}
                    <main>
                        {children}
                    </main>

                    {/* Admin Footer */}
                    <footer className="bg-white border-t border-gray-200 mt-12">
                        <div className="container mx-auto px-4 py-4">
                            <div className="text-center text-sm text-gray-500">
                                Admin Portal &copy; {new Date().getFullYear()} Student Hub. All rights reserved.
                            </div>
                        </div>
                    </footer>
                </div>
            </Provider>
            </body>
            </html>
        </ClerkProvider>
    );
}