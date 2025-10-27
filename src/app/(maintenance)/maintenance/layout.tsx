import type { Metadata } from "next";
import "@/app/globals.css";
import "@/app/md.css";
import React from "react";


export const metadata: Metadata = {
  title: "Concordpedia",
  description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={'w-11/12 min-h-screen p-2 mx-auto markdown-body'}>
        {children}
      </div>
    </>
  );
}