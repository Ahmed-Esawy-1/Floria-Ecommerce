"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Trash2 } from "lucide-react";

import { useGetWatchlistProductsQuery } from "@/lib/api/watchlistApi";
import { useWatchlistActions } from "./useWatchlistActions";
import { API_URL } from "@/lib/config";
import { getPriceInfo } from "@/utils/price";
import { useFormatNumber } from "@/hooks/useFormatNumber";
import Spinner from "@/components/loading/Spinner";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { encodeId } from "@/lib/hashId";

export default function WatchlistView() {
    const t = useTranslations("watchlist");
    const locale = useLocale();
    const isEn = locale === "en";
    const { formatPrice } = useFormatNumber();

    const {
        data: items = [],
        isLoading,
        isError,
    } = useGetWatchlistProductsQuery();
    const { remove, isPending } = useWatchlistActions();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isError) {
        return (
            <main className="container mx-auto px-6 py-16 text-center text-text">
                {t("error")}
            </main>
        );
    }

    return (
        <main className="container mx-auto px-6 py-10">
            <h1 className="font-heading text-3xl font-bold text-ink mb-8">
                {t("title")}
            </h1>

            {items.length === 0 ? (
                <div className="text-center py-16">
                    <Heart className="mx-auto mb-4 text-rose" size={48} />
                    <p className="text-text mb-6">{t("empty")}</p>
                    <Link
                        href="/shop"
                        className="inline-block rounded-full bg-primary px-6 py-2 text-white"
                    >
                        {t("browse")}
                    </Link>
                </div>
            ) : (
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => {
                        const name = isEn
                            ? item.productNameEn
                            : item.productNameAr;
                        const {
                            finalPrice,
                            oldPrice,
                            discountPercent,
                            hasDiscount,
                        } = getPriceInfo(
                            item.originalPrice,
                            item.priceAfterDiscount,
                        );

                        return (
                            <li
                                key={item.id}
                                className="group relative rounded-2xl border border-gold/25 bg-white overflow-hidden shadow-sm"
                            >
                                <button
                                    type="button"
                                    aria-label={t("remove")}
                                    disabled={isPending}
                                    onClick={() => remove(item.productId)}
                                    className="absolute top-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rose shadow hover:bg-rose/10 disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <Link
                                    href={`/shop/${encodeId(item.productId)}`}
                                >
                                    <div className="relative aspect-square bg-marble-light overflow-hidden">
                                        {item.primaryImage && (
                                            <Image
                                                src={resolveImageUrl(
                                                    `${API_URL}${item.primaryImage}`,
                                                )}
                                                alt={name}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>

                                    <div className="p-4 text-start">
                                        <h2 className="font-semibold text-ink line-clamp-2 min-h-[2.75rem]">
                                            {name}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <p className="text-primary font-bold">
                                                {formatPrice(finalPrice)}
                                            </p>
                                            {hasDiscount && (
                                                <>
                                                    <span className="text-slate-400 text-sm line-through">
                                                        {formatPrice(oldPrice)}
                                                    </span>
                                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                                                        -{discountPercent}%
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}
