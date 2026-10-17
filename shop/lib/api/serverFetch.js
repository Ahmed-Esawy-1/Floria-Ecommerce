import { BASE } from "../config";

// ---- FUNC -------------------
async function request(
    path,
    {
        method = "GET",
        body,
        revalidate = 3600,
        tags = [],
        fallback = null,
    } = {},
) {
    const url = `${BASE}${path}`;

    try {
        const res = await fetch(url, {
            method,
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body: body ? JSON.stringify(body) : undefined,
            next: { revalidate, tags },
            redirect: "manual",
        });
        const contentType = res.headers.get("content-type") ?? "";

        // Not OK (this includes 3xx), or the server answered with HTML
        if (!res.ok || !contentType.includes("application/json")) {
            const location = res.headers.get("location");
            console.error(
                `[serverFetch] ${method} ${url} -> ${res.status} (${contentType})` +
                    (location ? ` redirect to: ${location}` : ""),
            );
            return fallback;
        }

        return await res.json();
    } catch (error) {
        console.error(`[serverFetch] ${method} ${url} failed:`, error);
        return fallback;
    }
}

// ---- COLLECTIONS ----
const collection = { revalidate: 3600, tags: ["collections"], fallback: [] };

export const fetchCategories = () =>
    request("/categories/summaries", collection);
export const fetchOccasions = () => request("/occasions/summaries", collection);
export const fetchSectionSummaries = () =>
    request("/shop/sections/summaries", collection);

// ---- PRODUCTS ----
export const fetchShopProducts = (body, { page = 0, size = 12 } = {}) =>
    request(`/shop/products?page=${page}&size=${size}`, {
        method: "POST",
        body,
        revalidate: 300,
        tags: ["products"],
        fallback: null,
    });
