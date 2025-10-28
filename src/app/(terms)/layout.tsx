import "@/app/globals.css";
import "@/app/md.css";
import Footer from "@/lib/customui/Footer";


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (<>
    {children}
    <br />
    <Footer />
  </>);
}