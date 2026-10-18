"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/loading/ProductSkeleton";
import Spinner from "@/components/loading/Spinner";
import Filters from "./components/Filters";
import { useProductsList } from "./useProductsList";
import { PAGE_SIZE, PRODUCT_VARIANTS } from "./constants";

export default function ProductsView({
    variant = "all",
    initialFacets,
    initialProducts,
}) {
    const t = useTranslations("shop");
    const config = PRODUCT_VARIANTS[variant] ?? PRODUCT_VARIANTS.all;

    const [filtersOpen, setFiltersOpen] = useState(false);
    const list = useProductsList(config, initialFacets, initialProducts);

    // Lock page scroll while the mobile filter drawer is open
    useEffect(() => {
        document.body.style.overflow = filtersOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filtersOpen]);

    const title = t(`variants.${variant}.title`);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row gap-8">
            {list.filtersLoading ? (
                <div className="hidden lg:flex w-64 items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <Filters
                    open={filtersOpen}
                    setOpen={setFiltersOpen}
                    data={list.data}
                    filters={list.filters}
                    price={list.price}
                    onToggle={list.toggleFacet}
                    onPriceChange={list.changePrice}
                    onClear={list.clearAll}
                />
            )}

            <main className="flex-1 pt-10 px-4 lg:px-5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
                    <div>
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text mb-2"
                        >
                            <Link href="/" className="hover:text-primary">
                                {t("breadcrumbHome")}
                            </Link>
                            <ChevronRight
                                size={14}
                                className="rtl:rotate-180"
                            />
                            <span>{title}</span>
                        </nav>
                        <h1 className="font-serif text-4xl text-primary">
                            {title}
                        </h1>
                    </div>
                    <span className="text-xs text-text">
                        {list.totalElements} {t("products")}
                    </span>
                </div>

                <div className="lg:hidden mb-6">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen(true)}
                        className="px-4 py-2 border border-gold/40 rounded-md text-sm text-ink"
                    >
                        {t("filters")}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {list.isLoading
                        ? Array.from({ length: PAGE_SIZE }, (_, i) => (
                              <ProductSkeleton key={i} />
                          ))
                        : list.products.map((product) => (
                              <ProductCard
                                  key={product.id}
                                  product={product}
                                  isInWatchlist={list.watchlistIds.includes(
                                      product.id,
                                  )}
                              />
                          ))}
                </div>

                {!list.isLoading &&
                    !list.isFetching &&
                    list.products.length === 0 && (
                        <p className="text-center text-text py-20">
                            {t("noProducts")}
                        </p>
                    )}

                {list.hasMore && (
                    <div className="flex justify-center mt-10 mb-16">
                        <button
                            type="button"
                            disabled={list.isFetching}
                            onClick={list.loadMore}
                            className="px-6 py-3 border border-primary rounded-md text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                        >
                            {list.isFetching ? t("loading") : t("loadMore")}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
