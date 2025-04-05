export const isNumeric = (string: string) => Number.isFinite(+string)

export function StorageURLNotes(filepath: string) {
    return `https://uvvmcshblmmafbcdkztp.supabase.co/storage/v1/object/public/notes-storage/${filepath}`;
}

export function StorageURLOlympiads(filepath: string) {
    return `https://uvvmcshblmmafbcdkztp.supabase.co/storage/v1/object/public/olympiads-storage/${filepath}`;
}