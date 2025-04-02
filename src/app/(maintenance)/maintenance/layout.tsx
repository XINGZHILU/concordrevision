import type {Metadata} from "next";
import "@/app/globals.css";
import "@/app/md.css";


export const metadata: Metadata = {
    title: "Student Hub",
    description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};


export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <head>
            <title>Student Hub</title>
            <meta charSet="utf-8"/>
        </head>

        <body>
        <div className={'w-11/12 min-h-screen p-2 mx-auto markdown-body'}>
            {children}
        </div>
        </body>
        </html>
    );
}