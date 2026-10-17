import { getTranslations } from "next-intl/server";
import Hero from "@/features/home/components/Hero";
import HomeView from "@/features/home/HomeView";
import LazySection from "@/features/home/components/LazySection";
import BrandsSection from "@/features/home/components/BrandsSection";
import {
    fetchSectionSummaries,
    fetchCategories,
    fetchOccasions,
} from "@/lib/api/serverFetch";
import ChatWidget from "@/components/ChatWidget";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "home" });

    const title = t("seo.title");
    const description = t("seo.description");
    const keywords = t("seo.keywords")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

    const isAr = locale === "ar";

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: `/${locale}`,
            languages: { en: "/en", ar: "/ar", "x-default": "/en" },
        },
        openGraph: {
            title,
            description,
            type: "website",
            locale: isAr ? "ar_EG" : "en_US",
            url: `/${locale}`,
            siteName: "Floria",
        },
    };
}

export default async function Page() {
    const [occasions, categories, sections] = await Promise.all([
        fetchOccasions().catch(() => []),
        fetchCategories().catch(() => []),
        fetchSectionSummaries().catch(() => []),
    ]);

    return (
        <main>
            <Hero />

            <HomeView categories={categories} occasions={occasions} />

            {sections.map((section) => (
                <LazySection key={section.id} section={section} />
            ))}

            <BrandsSection />
            <ChatWidget />
        </main>
    );
}
