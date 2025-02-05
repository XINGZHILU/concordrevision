import React, { useState } from 'react'
import {blog_data} from '@/lib/assets.js'
import NoteItem from './NoteItem'

const NoteList = () => {

    const [menu,setMenu] = useState("All");

    return(
        <div>
            <div className='flex justify-center gap-6 my-10'>
                <button onClick={()=>setMenu('All')} className={menu==="All"?'bg-black text-white py-1 px-4 rounded-sm':""}>All</button>
                <button onClick={()=>setMenu('GCSE_Notes')} className={menu==="Notes"?'bg-black text-white py-1 px-4 rounded-sm':""}>GCSE_Notes</button>
                <button onClick={()=>setMenu('ALNotes')} className={menu==="Notes"?'bg-black text-white py-1 px-4 rounded-sm':""}>ALNotes</button>
                <button onClick={()=>setMenu('Tools/Utility')} className={menu==="Tools/Utility"?'bg-black text-white py-1 px-4 rounded-sm':""}>Tools/Utility</button>
                <button onClick={()=>setMenu('Extracurricular')} className={menu==="Extracurricular"?'bg-black text-white py-1 px-4 rounded-sm':""}>Extracurricular</button>
            </div>
            <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
                {blog_data.filter((item)=> menu==="All"?true:item.category===menu).map((item,index)=>{
                    return <NoteItem key={index} id={item.id} image={item.image} title={item.title} description={item.description} category={item.category}/>

                })}
        
            </div>
        </div>
    )
}

export default NoteList