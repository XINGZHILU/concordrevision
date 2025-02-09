export const isNumeric = (string : string) => Number.isFinite(+string)

export function StorageURL(filepath: string) {
    return `https://uvvmcshblmmafbcdkztp.supabase.co/storage/v1/object/public/notes-storage/${filepath}`;
}