'use client';

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { key_pages } from "../consts";
import Image from "next/image";

export default function NavBar({ can_upload, teacher, admin }: { can_upload: boolean, teacher: boolean, admin: boolean }) {
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
    if (!pathname) {
      return false;
    }
    return path !== '/' && pathname.startsWith(path);
  };

  return (
    <nav className="bg-background shadow-md sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/icon.svg" className="h-8"
                alt="Concord Logo" width={20} height={20} />
              <span className="text-xl font-bold text-primary">Concordpedia</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex space-x-4 items-center">
              {
                key_pages.map((page) => {
                  return <Link
                    key={page.name}
                    href={page.link}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(page.link)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-muted'
                      }`}
                  >
                    {page.name}
                  </Link>;
                }
                )
              }

              {can_upload ? (<Link
                href="/upload"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/upload')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-muted'
                  }`}
              >
                Upload
              </Link>
              ) : (<></>)}

              {teacher ? (<Link
                href="/teachers"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/teachers')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-muted'
                  }`}
              >
                Teachers
              </Link>
              ) : (<></>)}

              {admin ? (<Link
                href="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-muted'
                  }`}
              >
                Admin
              </Link>
              ) : (<></>)}

              <div className="ml-4 flex items-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
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
                  />
                </SignedIn>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">

            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-accent-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background shadow-lg">
            {
              key_pages.map((page) => {
                return <Link key={page.name}
                  href={page.link}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(page.link)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {page.name}
                </Link>;
              }
              )
            }
            {can_upload ? (<Link
              href="/upload"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/upload')
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Upload
            </Link>) : (<></>)}
            {teacher ? (<Link
              href="/teachers"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/teachers')
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Teacher
            </Link>) : (<></>)}
            {admin ? (<Link
              href="/admin"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin')
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>) : (<></>)}
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
            <SignedOut>
              <div className="mt-4 px-3">
                <SignInButton mode="modal">
                  <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
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