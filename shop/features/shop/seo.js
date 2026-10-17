import { getTranslations } from "next-intl/server";

import {
    absoluteUrl,
    DEFAULT_OG_IMAGE,
    localizedAlternates,
    OG_LOCALES,
} from "@/lib/seo/site";
import { PRODUCT_VARIANTS } from "./constants";

export async function buildListMetadata({ locale, variant, searchParams }) {
    const t = await getTranslations({
        locale,
        namespace: `shop.variants.${variant}`,
    });
    const { path } = PRODUCT_VARIANTS[variant];
    const sp = await searchParams;

    const FILTER_KEYS = ["categoryIds", "occasionIds"];
    const isFiltered = FILTER_KEYS.some((key) => sp?.[key]);

    const title = t("title");
    const description = t("description");

    return {
        title,
        description,
        alternates: localizedAlternates(locale, path),
        robots: { index: !isFiltered, follow: true },
        openGraph: {
            type: "website",
            title,
            description,
            url: `/${locale}${path}`,
            locale: OG_LOCALES[locale],
            images: [
                {
                    url: DEFAULT_OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: "Floria luxury flowers",
                },
            ],
        },
    };
}

// Breadcrumbs + the products rendered on the first page
export async function buildListJsonLd({ locale, variant, products }) {
    const t = await getTranslations({ locale, namespace: "shop" });
    const { path } = PRODUCT_VARIANTS[variant];
    const pageUrl = absoluteUrl(`/${locale}${path}`);
    const name = t(`variants.${variant}.title`);

    return [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: t("breadcrumbHome"),
                    item: absoluteUrl(`/${locale}`),
                },
                { "@type": "ListItem", position: 2, name, item: pageUrl },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name,
            url: pageUrl,
            inLanguage: locale,
            mainEntity: {
                "@type": "ItemList",
                itemListElement: (products?.content ?? []).map((p, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: absoluteUrl(`/${locale}/shop/${p.id}`),
                })),
            },
        },
    ];
}
