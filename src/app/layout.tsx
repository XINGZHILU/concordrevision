import type {Metadata} from "next";
import "@/app/globals.css";
import "@/app/md.css";
import {inter} from "@/lib/customui/fonts";
import NavBar from "@/lib/customui/navbar";
import {ClerkProvider} from "@clerk/nextjs";
import Footer from "@/lib/customui/Footer";
export const metadata: Metadata = {
    title: "Student Hub",
    description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};
import {Provider} from "@/components/ui/provider"
import {Container} from "@chakra-ui/react";

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
            </head>

            <body className={inter.className}>

            <NavBar/>

            <Provider>
                <Container minHeight="100vh">
                    <div className={'w-11/12 min-h-screen p-2 mx-auto markdown-body'}>
                        {children}
                    </div>
                    <Footer/>
                </Container>
            </Provider>
            </body>
            </html>
        </ClerkProvider>
    );
}