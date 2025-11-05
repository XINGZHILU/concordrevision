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

/**
 * Generates a URL to the PDF viewer page
 * @param fileUrl - The URL of the PDF file to view
 * @param fileName - Optional display name for the PDF
 * @returns The URL path to the PDF viewer
 */
export function getPdfViewerUrl(fileUrl: string, fileName?: string): string {
    // Use URLSearchParams to properly encode the parameters
    const params = new URLSearchParams({ url: fileUrl });
    
    if (fileName) {
        params.set('name', fileName);
    }
    
    return `/pdf/view?${params.toString()}`;
}

/**
 * Redirects to the PDF viewer page (client-side only)
 * @param fileUrl - The URL of the PDF file to view
 * @param fileName - Optional display name for the PDF
 */
export function redirectToPdf(fileUrl: string, fileName?: string): void {
    if (typeof window !== 'undefined') {
        const url = getPdfViewerUrl(fileUrl, fileName);
        window.location.href = url;
    }
}