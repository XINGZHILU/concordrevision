'use client';

import { useRef, useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { LuCircleAlert, LuCircleCheck, LuCircleEllipsis, LuCircleHelp } from "react-icons/lu";


function GetSymbol({colour} : {colour : number}){
    if (colour === -1){
        return <LuCircleHelp/>
    }
    else if (colour === 0){
        return <LuCircleCheck/>
    }
    else if (colour === 1){
        return <LuCircleEllipsis/>
    }
    return <LuCircleAlert/>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ColourSelector({ nid, uid, subject, original }: {
    nid: number,
    uid: string,
    subject: number,
    original: number
}) {
    const [selectedColor, setSelectedColor] = useState(original);
    const [isLoading, setIsLoading] = useState(false);
    const colourRef = useRef<HTMLSelectElement>(null);

    const colorOptions = [
        { value: -1, label: "Unclassified", bgClass: "bg-gray-100", textClass: "text-gray-800" },
        { value: 0, label: "Green", bgClass: "bg-green-100", textClass: "text-green-800" },
        { value: 1, label: "Amber", bgClass: "bg-amber-100", textClass: "text-amber-800" },
        { value: 2, label: "Red", bgClass: "bg-red-100", textClass: "text-red-800" }
    ];

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const colour = colourRef.current?.value as unknown as number;

        if (colour === undefined || Number(colour) === original) {
            return;
        }

        setIsLoading(true);

        try {
            const response1 = await fetch('/api/remove_colour', {
                method: 'POST',
                body: JSON.stringify({ nid, uid, original }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const response2 = await fetch('/api/add_colour', {
                method: 'POST',
                body: JSON.stringify({ nid, uid, colour }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response1.ok && response2.ok) {
                toaster.success({
                    title: "Success",
                    description: "Knowledge level updated",
                });
                setSelectedColor(Number(colour));
            } else {
                toaster.error({
                    title: "Error",
                    description: "Failed to update knowledge level"
                });
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to connect to server"
            });
        } finally {
            setIsLoading(false);
        }
        original = colour;
    }

    // Get the currently selected color info
    // const currentColor = colorOptions.find(option => option.value === selectedColor) || colorOptions[0];

    return (
        <div>
            <Toaster />

            <form onSubmit={submit} className="flex items-center flex-wrap gap-2">
                <div className="flex space-x-2 mr-2">
                    {colorOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`
                                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                transition-colors border
                                ${selectedColor === option.value ?
                                `${option.bgClass} border-${option.bgClass.split('-')[1]}-500` :
                                'bg-white border-gray-200 hover:bg-gray-50'
                            }
                            `}
                            onClick={() => {
                                if (colourRef.current) {
                                    colourRef.current.value = option.value.toString();
                                    setSelectedColor(option.value);
                                }
                            }}
                        >
                            <GetSymbol colour = {option.value}/> {option.label}
                        </button>
                    ))}
                </div>

                <select
                    name="colour"
                    id="colour"
                    defaultValue={original}
                    ref={colourRef}
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(Number(e.target.value))}
                    className="sr-only"
                    required
                >
                    {colorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={isLoading || selectedColor === original}
                    className={`
                        inline-flex items-center px-3 py-1.5 text-xs font-medium rounded 
                        focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500
                        ${selectedColor !== original && !isLoading ?
                        'bg-indigo-600 text-white hover:bg-indigo-700' :
                        'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                    `}
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving
                        </span>
                    ) : (
                        'Save'
                    )}
                </button>
            </form>
        </div>
    );
}