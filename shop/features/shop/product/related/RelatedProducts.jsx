"use client";

import { useTranslations } from "next-intl";

import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/loading/ProductSkeleton";
import AppSwiper from "@/components/AppSwiper";
import useWatchlistIds from "@/hooks/useWatchlistIds";
import { useGetRelatedProductsQuery } from "@/lib/api/shopApi";
import { COUNT } from "../constants";
import { PRODUCT_BREAKPOINTS } from "@/features/shared/constants";

export default function RelatedProducts({ productId }) {
    const t = useTranslations("product");
    const watchlistIds = useWatchlistIds();

    const {
        data: products = [],
        isLoading,
        isError,
    } = useGetRelatedProductsQuery(productId, { skip: !productId });

    // Nothing to show or it failed
    if (isError || (!isLoading && products.length === 0)) return null;

    return (
        <section className="mt-24">
            <h2 className="text-3xl font-bold mb-8 text-ink">
                {t("relatedTitle")}
            </h2>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: COUNT }, (_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            ) : (
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
        </section>
    );
}
