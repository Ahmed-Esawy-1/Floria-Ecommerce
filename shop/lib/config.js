export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
    /\/+$/,
    "",
);
export const BASE = API_URL + "/api";
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
