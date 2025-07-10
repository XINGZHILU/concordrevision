import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isNumeric = (string: string) => Number.isFinite(+string)

export function StorageURLNotes(filepath: string) {
    return `https://uvvmcshblmmafbcdkztp.supabase.co/storage/v1/object/public/notes-storage/${filepath}`;
}

export function StorageURLOlympiads(filepath: string) {
    return `https://uvvmcshblmmafbcdkztp.supabase.co/storage/v1/object/public/olympiads-storage/${filepath}`;
}