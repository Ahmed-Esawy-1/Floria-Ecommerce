"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useGetSectionProductsQuery } from "@/lib/api/homeApi";
import useWatchlistIds from "@/hooks/useWatchlistIds";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/loading/ProductSkeleton";
import SectionHeader from "@/features/home/components/SectionHeader";
import useInView from "@/hooks/useInView";
import { MIN_PRODUCTS } from "@/features/home/constants";
import { PRODUCT_BREAKPOINTS } from "@/features/shared/constants";

const AppSwiper = dynamic(() => import("@/components/AppSwiper"), {
    ssr: false,
    loading: () => (
        <div className="h-40 animate-pulse bg-slate-200 rounded-xl" />
    ),
});

export default function LazySection({ section }) {
    const locale = useLocale();
    const tCommon = useTranslations("common");
    const { ref, isVisible } = useInView();
    const watchlistIds = useWatchlistIds();

    const { data, isFetching, isSuccess } = useGetSectionProductsQuery(
        section.id,
        {
            skip: !isVisible,
        },
    );
    const products = data ?? [];

    // ---- Render ----------------------------------------------------------------
    if (isSuccess && products.length < MIN_PRODUCTS) return null;

    return (
        <section
            ref={ref}
            className="py-8 sm:py-10 bg-gradient-to-b from-rose/5 via-marble to-rose/5 overflow-hidden"
            style={{ minHeight: "320px" }}
        >
            <div className="container mx-auto px-4 sm:px-6">
                <SectionHeader
                    title={locale === "en" ? section.nameEn : section.nameAr}
                    href={`/shop${section.urlVisit}`}
                    viewAllLabel={tCommon("viewAll")}
                />

                {(!isVisible || isFetching) && <ProductSkeleton />}

                {isVisible && !isFetching && products.length > 0 && (
                    <AppSwiper
                        items={products}
                        breakpoints={PRODUCT_BREAKPOINTS}
                        renderSlide={(item) => (
                            <ProductCard
                                product={item}
                                isInWatchlist={watchlistIds.includes(item.id)}
                            />
                        )}
                    />
                )}
            </div>
        </section>
    );
}
