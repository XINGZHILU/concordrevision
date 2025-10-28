import "@/app/globals.css";
import "@/app/md.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={'w-11/12 min-h-screen p-2 mx-auto markdown-body'}>
        {children}
      </div>
    </>
  );
}