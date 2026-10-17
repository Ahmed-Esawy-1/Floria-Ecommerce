import { BASE_URL } from "@/api/config";

export function resolveImageUrl(url) {
    if (!url) return null;
    if (/^(https?:|blob:|data:)/.test(url)) return url;
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
