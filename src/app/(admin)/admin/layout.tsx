import type { Metadata } from "next";
import "@/app/globals.css";
import "@/app/md.css";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
// import { bodyFont, headingFont } from "@/lib/customui/fonts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Provider } from "@/components/ui/provider"
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Concordpedia",
  description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
  if (!record.admin) {
    notFound();
  }

  return (
    <Provider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-muted">
          {/* Admin Header */}
          <header className="bg-primary text-primary-foreground shadow-md">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/admin" className="font-bold text-xl">
                    Admin Portal
                  </Link>

                  <nav className="hidden md:flex space-x-4">
                    <Link href="/admin/users" className="hover:bg-primary/80 px-2 py-1 rounded">
                      Users
                    </Link>
                    <Link href="/admin/subjects" className="hover:bg-primary/80 px-2 py-1 rounded">
                      Subjects
                    </Link>
                    <Link href="/admin/year-groups" className="hover:bg-primary/80 px-2 py-1 rounded">
                      Year Groups
                    </Link>
                    <Link href="/admin/olympiads" className="hover:bg-primary/80 px-2 py-1 rounded">
                      Olympiads
                    </Link>
                    <Link href="/admin/ucas" className="hover:bg-primary/80 px-2 py-1 rounded">
                      UCAS
                    </Link>
                    <Link href="/admin/delete" className="hover:bg-primary/80 px-2 py-1 rounded">
                      Delete
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

          {/* Mobile Navigation */}
          <div className="md:hidden bg-primary/90 text-primary-foreground">
            <div className="container mx-auto px-4 py-2">
              <nav className="flex overflow-x-auto space-x-4 scrollbar-hide pb-1">
                <Link href="/admin" className="whitespace-nowrap hover:bg-primary/80 px-2 py-1 rounded">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="whitespace-nowrap hover:bg-primary/80 px-2 py-1 rounded">
                  Users
                </Link>
                <Link href="/admin/subjects" className="whitespace-nowrap hover:bg-primary/80 px-2 py-1 rounded">
                  Subjects
                </Link>
                <Link href="/admin/year-groups" className="whitespace-nowrap hover:bg-primary/80 px-2 py-1 rounded">
                  Year Groups
                </Link>
                <Link href="/admin/olympiads" className="whitespace-nowrap hover:bg-primary/80 px-2 py-1 rounded">
                  Olympiads
                </Link>
                <Link href="/admin/ucas" className="whitespace-nowrap hover:bg-primary/80 px-2 py-1 rounded">
                  UCAS
                </Link>
                <Link href="/admin/delete" className="whitespace-nowrap hover:bg-primary/80 px-2 py-1 rounded">
                  Delete
                </Link>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <main>
            {children}
            <Toaster />
          </main>

          {/* Admin Footer */}
          <footer className="bg-card border-t border-border mt-12">
            <div className="container mx-auto px-4 py-4">
              <div className="text-center text-sm text-muted-foreground">
                Admin Portal &copy; {new Date().getFullYear()} Concordpedia. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    </Provider>
  );
}