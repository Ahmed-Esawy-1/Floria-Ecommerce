import { SITE_URL } from "@/lib/config";

export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
                "/change-password",
                "/*/change-password",
                "/checkout",
                "/*/checkout",
                "/orders",
                "/*/orders",
                "/profile",
                "/*/profile",
                "/watchlist",
                "/*/watchlist",
            ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
