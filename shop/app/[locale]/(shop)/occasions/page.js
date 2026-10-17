import { getTranslations } from "next-intl/server";

import CollectionsView from "@/features/collections/CollectionsView";
import { fetchOccasions } from "@/lib/api/serverFetch";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({
        locale,
        namespace: "collections.occasion",
    });

    return {
        title: t("title"),
        description: t("description"),
        alternates: {
            canonical: `/${locale}/occasions`,
            languages: { en: "/en/occasions", ar: "/ar/occasions" },
        },
        openGraph: {
            title: t("title"),
            description: t("description"),
            type: "website",
        },
    };
}

export default async function OccasionsPage() {
    const occasions = await fetchOccasions().catch(() => []);

    return <CollectionsView items={occasions} type="occasion" />;
}
