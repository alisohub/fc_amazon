export function normalizeText(txt: string | null): string {
    return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
}
