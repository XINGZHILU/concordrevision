import type {Metadata} from "next";
import "@/app/globals.css";
import "@/app/md.css";
import NavBar from "@/lib/customui/navbar";
import {ClerkProvider} from "@clerk/nextjs";
import Footer from "@/lib/customui/Footer";

export const metadata: Metadata = {
    title: "Student Hub",
    description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};
import {Provider} from "@/components/ui/provider"
import {currentUser} from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";


export default async function RootLayout({children}: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user) {
        return (
            <ClerkProvider>
                <html lang="en" suppressHydrationWarning={true}>
                <head>
                    <title>Student Hub</title>
                    <meta charSet="utf-8"/>
                </head>

                <body>

                <NavBar teacher={false} can_upload={false}/>

                <Provider>
                    <div className={'w-11/12 min-h-screen p-2 mx-auto markdown-body'}>
                        {children}
                    </div>
                    <br/>
                    <Footer/>
                </Provider>
                </body>
                </html>
            </ClerkProvider>
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
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning={true}>
            <head>
                <title>Student Hub</title>
                <meta charSet="utf-8"/>
            </head>

            <body>

            <NavBar teacher={record.teacher} can_upload={record.upload_permission || record.teacher}/>

            <Provider>
                <div className={'w-11/12 min-h-screen p-2 mx-auto markdown-body'}>
                    {children}
                </div>
                <br/>
                <Footer/>
            </Provider>
            </body>
            </html>
        </ClerkProvider>
    );
}