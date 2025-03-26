'use client';

import { useRef, useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";

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
        { value: -1, label: "Unclassified", bgClass: "bg-gray-100", textClass: "text-gray-800", description: "Not yet rated" },
        { value: 0, label: "Green", bgClass: "bg-green-100", textClass: "text-green-800", description: "Confident with this topic" },
        { value: 1, label: "Amber", bgClass: "bg-amber-100", textClass: "text-amber-800", description: "Still reviewing this topic" },
        { value: 2, label: "Red", bgClass: "bg-red-100", textClass: "text-red-800", description: "Need help with this topic" }
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
                    description: "Knowledge level updated successfully",
                });
                setSelectedColor(Number(colour));
            } else {
                toaster.error({
                    title: "Error",
                    description: "An error occurred while updating the knowledge level"
                });
            }
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to connect to the server"
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Get the currently selected color info
    const currentColor = colorOptions.find(option => option.value === selectedColor) || colorOptions[0];

    return (
        <div className="w-full">
            <Toaster />

            {/* Color selector cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {colorOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`
                            rounded-lg p-4 border-2 cursor-pointer transition-all duration-200
                            ${selectedColor === option.value ?
                            `${option.bgClass} border-${option.bgClass.split('-')[1]}-500` :
                            'bg-white border-gray-200 hover:border-gray-300'
                        }
                        `}
                        onClick={() => {
                            if (colourRef.current) {
                                colourRef.current.value = option.value.toString();
                                setSelectedColor(option.value);
                            }
                        }}
                    >
                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-2 ${option.bgClass.replace('100', '500')}`}></div>
                            <h3 className={`font-medium ${selectedColor === option.value ? option.textClass : 'text-gray-900'}`}>
                                {option.label}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={submit} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:max-w-xs">
                    <label htmlFor="colour" className="block text-sm font-medium text-gray-700 mb-1">
                        Current knowledge level:
                    </label>
                    <div className="relative">
                        <select
                            name="colour"
                            id="colour"
                            defaultValue={original}
                            ref={colourRef}
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(Number(e.target.value))}
                            className={`
                                block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none
                                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${currentColor.bgClass} ${currentColor.textClass}
                                appearance-none
                            `}
                            required
                        >
                            {colorOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    className={`${option.bgClass} ${option.textClass}`}
                                >
                                    {option.label} - {option.description}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || selectedColor === original}
                    className={`
                        px-4 py-2 rounded-md text-white font-medium shadow-sm focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-indigo-500 mt-4 sm:mt-0
                        ${selectedColor !== original && !isLoading ?
                        'bg-indigo-600 hover:bg-indigo-700' :
                        'bg-gray-300 cursor-not-allowed'
                    }
                    `}
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        'Save Rating'
                    )}
                </button>
            </form>
        </div>
    );
}