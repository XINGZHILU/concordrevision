'use client';

import {useRef} from "react";

export default function ColourSelector({nid, uid, original}: { nid: number, uid: string, original: number }) {
    console.log(nid, uid, original);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const colour = colourRef.current?.value as unknown as number;
        if (colour === undefined || colour === original) {
            return;
        }
        const response1 = await fetch('/api/remove_colour', {
            method: 'POST',
            body: JSON.stringify({nid, uid, original}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response2 = await fetch('/api/add_colour', {
            method: 'POST',
            body: JSON.stringify({nid, uid, colour}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response1.ok && response2.ok){
            alert('Colour set');

        }
        else {
            alert('Colour not set');
        }
    }

    const colourRef = useRef<HTMLSelectElement>(null);
    return (<div>
        <form onSubmit={submit}>
            <label htmlFor="colour">Choose a colour:</label>
            <select name="colour" id="colour" defaultValue={original} ref={colourRef} required>
                <option value={-1} className={'bg-gray-500 text-white'}>Unclassified</option>
                <option value={0} className={'bg-green-500 text-white'}>Green</option>
                <option value={1} className={'bg-amber-500 text-white'}>Amber</option>
                <option value={2} className={'bg-red-500 text-white'}>Red</option>
            </select>
            <button type="submit">Save</button>
        </form>
    </div>);
}