
const MONTHS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const pad = (n: number) => String(n).padStart(2, '0');

export function formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    // Same day → [HH:MM]
    if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    ) {
        return `[${hours}:${minutes}]`;
    }

    // Yesterday → [AYER]
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
    ) {
        return '[AYER]';
    }

    const day = pad(date.getDate());
    const month = MONTHS[date.getMonth()];

    // Same year → [12 NOV]
    if (date.getFullYear() === now.getFullYear()) {
        return `[${day} ${month}]`;
    }

    // Older → [12 NOV 25]
    const year = String(date.getFullYear()).slice(-2);
    return `[${day} ${month} ${year}]`;
}
