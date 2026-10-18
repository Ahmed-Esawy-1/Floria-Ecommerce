import { PRODUCT_VARIANTS } from "@/features/products/constants";
import { SITE_URL } from "@/lib/config";
import { LOCALES } from "@/lib/seo/site";

export default function sitemap() {
    return Object.values(PRODUCT_VARIANTS).flatMap(({ path }) =>
        LOCALES.map((locale) => ({
            url: `${SITE_URL}/${locale}${path}`,
            changeFrequency: "daily",
            priority: 0.8,
            alternates: {
                languages: Object.fromEntries(
                    LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]),
                ),
            },
        })),
    );
}
