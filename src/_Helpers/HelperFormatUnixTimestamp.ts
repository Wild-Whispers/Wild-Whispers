

export default function HelperFormatUnixTimestamp(timestamp: number) {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 4) return `${weeks}w ago`;

    // Format for longer than a month
    const date = new Date(timestamp);

    const day = date.getDate();
    const daySuffix =
        day % 10 === 1 && day !== 11 ? "st" :
        day % 10 === 2 && day !== 12 ? "nd" :
        day % 10 === 3 && day !== 13 ? "rd" : "th";

    const monthName = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const hours12 = date.getHours() % 12 || 12;
    const minutesStr = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";

    return `${monthName} ${day}${daySuffix}, ${year} ${hours12}:${minutesStr}${ampm}`;
}