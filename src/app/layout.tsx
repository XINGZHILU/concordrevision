import type { Metadata } from "next";
import "@/app/globals.css";
import "@/app/md.css";
import { ClerkProvider } from "@clerk/nextjs";
import { bodyFont, headingFont } from "@/lib/customui/fonts";
export const metadata: Metadata = {
  title: "Concordpedia",
  description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true} className={`${headingFont.variable} ${bodyFont.variable}`}>
        <head>
          <title>Concordpedia</title>
          <meta charSet="utf-8" />
        </head>

        <body className={`font-sans ${bodyFont.variable} ${headingFont.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}