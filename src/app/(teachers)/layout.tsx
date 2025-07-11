import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import "@/app/globals.css";
import "@/app/md.css";
import { Provider } from '@/components/ui/provider';
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { bodyFont, headingFont } from '@/lib/customui/fonts';

export default async function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    notFound();
  }

  if (!dbUser.teacher && !dbUser.admin){
    return <h1>You do not have access to this page</h1>;
  }

  return (
    <ClerkProvider>
      <html>
        <head>

        </head>
        <body className={`font-sans ${bodyFont.variable} ${headingFont.variable}`}>
          <header className="bg-primary text-primary-foreground shadow-md">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/teachers" className="font-bold text-xl">
                    Teachers Portal
                  </Link>

                  <nav className="hidden md:flex space-x-4">
                    <Link href="/teachers/create-test" className="hover:bg-primary/80 px-2 py-1 rounded">
                      Schedule Tests
                    </Link>
                    <Link href="/teachers/approval" className="hover:bg-primary/80 px-2 py-1 rounded">
                      Approve Content
                    </Link>
                  </nav>
                </div>

                <div className="flex items-center space-x-4">
                  <Link href="/" className="hover:bg-primary/80 flex items-center p-2 rounded-md">
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

          {/* Main content */}
          <main className="w-11/12 min-h-screen p-2 mx-auto markdown-body">
            <Provider>
              {children}
            </Provider>
          </main>
        </body>
      </html>
    </ClerkProvider>

  );
} 