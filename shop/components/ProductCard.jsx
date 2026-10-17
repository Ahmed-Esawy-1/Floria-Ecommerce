"use client";

import Image from "next/image";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { Heart } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { encodeId } from "@/lib/hashId";
import { add } from "@/features/cart/cartSlice";
import { useWatchlistActions } from "@/features/watchlist/useWatchlistActions";
import { getPriceInfo } from "@/utils/price";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

function ProductCard({ product, isInWatchlist }) {
    const t = useTranslations("common");
    const locale = useLocale();
    const router = useRouter();
    const dispatch = useDispatch();

    const isLoggedIn = useSelector((state) => !!state.auth.user);
    const {
        add: addToWatchlist,
        remove: removeFromWatchlist,
        isPending,
    } = useWatchlistActions();

    const { finalPrice, oldPrice, discountPercent, hasDiscount } = getPriceInfo(
        product?.price,
        product?.priceAfterDiscount,
    );

    const name = locale === "en" ? product?.nameEn : product?.nameAr;
    const href = `/shop/${encodeId(product?.id)}`;
    const imageUrl = product?.primaryImageUrl
        ? `${resolveImageUrl(product.primaryImageUrl)}`
        : null;

    // ---- ADD | REMOVE FROM WATCHLIST ------------------------------
    const toggleWatchlist = () => {
        if (isPending) return;

        // Guests go to login and come back to this page afterwards.
        // The URL is read at click time, so the card never subscribes to it.
        if (!isLoggedIn) {
            const current = window.location.pathname + window.location.search;
            router.push(`/login?returnUrl=${encodeURIComponent(current)}`);
            return;
        }

        if (isInWatchlist) {
            removeFromWatchlist(product.id);
        } else {
            addToWatchlist(product.id);
        }
    };

    // ---- QUICK ADD TO CART ----------------------------------------
    const handleQuickAdd = () =>
        dispatch(
            add({
                id: product.id,
                nameEn: product.nameEn,
                nameAr: product.nameAr,
                price: product.price,
                priceAfterDiscount: product.priceAfterDiscount,
                imageUrl: product.primaryImageUrl,
                quantity: product.quantity,
                hasColor: product.hasColor,
                colorNameEn: product.colorNameEn,
                colorNameAr: product.colorNameAr,
            }),
        );

    return (
        <article className="group h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gold/15 hover:border-gold/40 shadow-sm hover:shadow-lg transition-all duration-300">
            {/* IMAGE LINK */}
            <Link
                href={href}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block overflow-hidden aspect-[4/3] bg-marble-light shrink-0"
            >
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                    />
                )}
            </Link>

            {/* INFO */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">
                {/* TITLE LINK */}
                <h3 className="mb-3 min-h-[2.75rem]">
                    <Link
                        href={href}
                        className="font-semibold text-ink text-sm sm:text-base leading-snug hover:text-primary transition-colors line-clamp-2"
                    >
                        {name}
                    </Link>
                </h3>

                <div className="mt-auto">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        {/* PRICE */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                            <span className="font-bold text-primary text-lg">
                                {finalPrice.toLocaleString()} {t("pound")}
                            </span>

                            {/* Old price + badge only when there is a discount */}
                            {hasDiscount && (
                                <>
                                    <span className="text-slate-400 text-sm line-through">
                                        {oldPrice.toLocaleString()} {t("pound")}
                                    </span>
                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                                        -{discountPercent}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* HEART */}
                        <button
                            type="button"
                            onClick={toggleWatchlist}
                            disabled={isPending}
                            aria-pressed={isInWatchlist}
                            aria-label={
                                isInWatchlist
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                            }
                            className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 ${
                                isInWatchlist
                                    ? "bg-red-50 text-red-500"
                                    : "bg-rose/15 text-primary hover:bg-primary hover:text-white"
                            }`}
                        >
                            <Heart
                                size={18}
                                fill={isInWatchlist ? "currentColor" : "none"}
                            />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleQuickAdd}
                        className="w-full border border-primary/80 text-primary hover:bg-primary hover:text-white text-sm font-semibold py-2.5 rounded-full transition-all duration-300 hover:shadow-md"
                    >
                        {t("quickAdd")}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default memo(ProductCard);
