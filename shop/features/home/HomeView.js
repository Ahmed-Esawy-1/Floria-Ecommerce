"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import SectionHeader from "./components/SectionHeader";
import HomeItemCard from "./components/HomeItemCard";
import { SLIDER_BREAKPOINTS } from "./constants";

const AppSwiper = dynamic(() => import("@/components/AppSwiper"), {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse bg-rose/10 rounded-xl" />,
});

export default function HomeView({ categories = [], occasions = [] }) {
    const t = useTranslations("home");
    const tCommon = useTranslations("common");

    return (
        <>
            {occasions.length > 0 && (
                <section className="pt-20 pb-10 bg-gradient-to-b from-rose/10 to-marble">
                    <div className="container mx-auto px-4 sm:px-6">
                        <SectionHeader
                            title={t("occasionsTitle")}
                            desc={t("occasionsDesc")}
                            href="/occasions"
                            viewAllLabel={tCommon("viewAll")}
                        />
                        <AppSwiper
                            items={occasions}
                            breakpoints={SLIDER_BREAKPOINTS}
                            renderSlide={(o) => (
                                <HomeItemCard
                                    item={o}
                                    href={`/shop?occasionIds=${o.id}`}
                                />
                            )}
                        />
                    </div>
                </section>
            )}

            {categories.length > 0 && (
                <section className="py-10 bg-gradient-to-b from-marble to-rose/10">
                    <div className="container mx-auto px-4 sm:px-6">
                        <SectionHeader
                            title={t("categoriesTitle")}
                            desc={t("categoriesDesc")}
                            href="/categories"
                            viewAllLabel={tCommon("viewAll")}
                        />
                        <AppSwiper
                            items={categories}
                            breakpoints={SLIDER_BREAKPOINTS}
                            centerInsufficientSlides
                            renderSlide={(c) => (
                                <HomeItemCard
                                    item={c}
                                    href={`/shop?categoryIds?${c.id}`}
                                    rounded
                                />
                            )}
                        />
                    </div>
                </section>
            )}
        </>
    );
}
