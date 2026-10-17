import { SITE_URL } from "../config";

export const DEFAULT_OG_IMAGE = "/images/hero.jpg";

export const LOCALES = ["en", "ar"];
export const DEFAULT_LOCALE = "en";
export const OG_LOCALES = { en: "en_US", ar: "ar_EG" };

export const absoluteUrl = (path = "") =>
    /^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`;

// canonical + hreflang
export function localizedAlternates(locale, path) {
    return {
        canonical: `/${locale}${path}`,
        languages: {
            ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])),
            "x-default": `/${DEFAULT_LOCALE}${path}`,
        },
    };
}
