import { getTranslations } from "next-intl/server";

import CollectionsView from "@/features/collections/CollectionsView";
import { fetchCategories } from "@/lib/api/serverFetch";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({
        locale,
        namespace: "collections.category",
    });

    return {
        title: t("title"),
        description: t("description"),
        alternates: {
            canonical: `/${locale}/categories`,
            languages: { en: "/en/categories", ar: "/ar/categories" },
        },
        openGraph: {
            title: t("title"),
            description: t("description"),
            type: "website",
        },
    };
}

export default async function CategoriesPage() {
    const categories = await fetchCategories().catch(() => []);

    return <CollectionsView items={categories} type="category" />;
}
