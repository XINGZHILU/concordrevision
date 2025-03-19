import Link from "next/link";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

export default function NavBar(){
    return (<nav className="bg-gray-200 border-gray-500">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                 <span
                     className="self-center text-2xl font-semibold whitespace-nowrap">Online Student Hub</span>
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
                              className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-200 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ">Revision</Link>
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
                            <SignInButton/>
                        </SignedOut>
                        <SignedIn>
                            <UserButton/>
                        </SignedIn>
                    </li>
                </ul>
            </div>
        </div>
    </nav>);
}