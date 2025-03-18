import type {Metadata} from "next";
import "@/app/globals.css";
import {inter} from "@/lib/customui/fonts";
import NavBar from "@/lib/customui/navbar";
import {ClerkProvider} from "@clerk/nextjs";
import Footer from "@/lib/customui/Footer";
import Script from 'next/script'

export const metadata: Metadata = {
    title: "Student Hub",
    description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};
import {Provider} from "@/components/ui/provider"

//                <script type="text/javascript" id="MathJax-script" async
//                         src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
//                 </script>

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning={true}>
            <head>
                <title>Student Hub</title>
                <meta charSet="utf-8"/>
                <Script src={'marked.min.js'}></Script>
                <Script src={'jquery.min.js'}></Script>
            </head>

            <body className={inter.className}>

            <NavBar/>

            <Provider>
                <div className={'w-screen place-items-center p-2'}>
                    <div className='min-h-screen max-w-11/12 mx-auto'>
                        {children}
                    </div>
                </div>
                <Footer/>
            </Provider>
            </body>
            </html>
        </ClerkProvider>
    );
}