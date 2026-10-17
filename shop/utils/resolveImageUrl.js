import { API_URL } from "@/lib/config";

// Google image (https), preview (blob/data) or a local image served by the backend
export function resolveImageUrl(url) {
    if (!url) return null;
    if (/^(https?:|blob:|data:)/.test(url)) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
