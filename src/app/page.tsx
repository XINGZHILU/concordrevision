'use client'
import Header from "@/lib/ui/Header";
import NoteList from "@/lib/ui/NoteList";
import Footer from "@/lib/ui/Footer";

export default function Home() {
    return (
        <>
            <Header/>
            <NoteList/>
            <div className='flex justify-center items-center gap-4 mt-8'>
            </div>
            <Footer/>
        </>
    )
}
