import "@/app/globals.css";
import "@/app/md.css";
import Link from "next/link";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (<>
    {children}
    <br/>
    <Link href={'/'}>Back to home page</Link>
  </>);
}