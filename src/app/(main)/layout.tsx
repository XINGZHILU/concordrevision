import type { Metadata } from "next";
import "@/app/globals.css";
import "@/app/md.css";
import NavBar from "@/lib/customui/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/lib/customui/Footer";
import { bodyFont, headingFont } from "@/lib/customui/fonts";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  title: "Concordpedia",
  description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) {
    return (
      <html lang="en" suppressHydrationWarning={true} className={`${headingFont.variable} ${bodyFont.variable}`}>
        <head>
          <title>Concordpedia</title>
          <meta charSet="utf-8" />
        </head>

        <body className={`font-sans ${bodyFont.variable} ${headingFont.variable}`}>
          <Provider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider>
              <NavBar teacher={false} can_upload={false} admin={false} />
              <div className={'w-11/12 min-h-screen p-2 mx-auto markdown-body'}>
                {children}
                <Toaster />
              </div>
              <br />
              <Footer />
            </ClerkProvider>
          </Provider>
        </body>
      </html>
    );
  }
  const record = await prisma.user.findUnique({
    where: {
      id: user.id
    }
  });
  if (!record) {
    return <h1>User not found</h1>;
  }
  return (
    <html lang="en" suppressHydrationWarning={true} className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <title>Concordpedia</title>
        <meta charSet="utf-8" />
      </head>

      <body className={`font-sans ${bodyFont.variable} ${headingFont.variable}`}>
        <Provider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <NavBar teacher={record.teacher} can_upload={record.upload_permission || record.teacher || record.admin} admin={record.admin} />
            <div className={'w-11/12 min-h-screen p-2 mx-auto markdown-body'}>
              {children}
            </div>
            <Toaster />
            <br />
            <Footer />
          </ClerkProvider>
        </Provider>
      </body>
    </html>
  );
}