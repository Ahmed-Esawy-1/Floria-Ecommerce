"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { remove, increase, decrease } from "@/features/cart/cartSlice";
import {
    MAX_CART_QUANTITY,
    MIN_CART_QUANTITY,
} from "@/features/cart/constants";
import { useFormatNumber } from "@/hooks/useFormatNumber";
import { getPriceInfo } from "@/utils/price";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

import { Minus, Plus, Trash2 } from "lucide-react";

const QTY_BUTTON_BASE =
    "flex h-8 w-8 items-center justify-center rounded-md transition-all shadow-sm";
const QTY_BUTTON_ENABLED =
    "bg-white text-primary hover:bg-primary hover:text-white cursor-pointer";
const QTY_BUTTON_DISABLED = "bg-slate-200 text-slate-400 cursor-not-allowed";

const CartItem = memo(({ item }) => {
    const t = useTranslations("cart");
    const locale = useLocale();
    const isRtl = locale === "ar";
    const { formatPrice } = useFormatNumber();
    const dispatch = useDispatch();

    const isMinQuantity = item.quantity <= MIN_CART_QUANTITY;
    const isMaxQuantity = item.quantity >= MAX_CART_QUANTITY;

    const name = isRtl ? item.nameAr : item.nameEn;

    const { finalPrice, oldPrice, discountPercent, hasDiscount } = getPriceInfo(
        item.price,
        item.priceAfterDiscount,
    );

    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-gold/15 shadow-sm">
            {/* IMAGE */}
            <div className="aspect-square w-full md:w-40 min-h-40 max-h-60 shrink-0 relative rounded-xl overflow-hidden">
                <Image
                    src={resolveImageUrl(item.imageUrl)}
                    alt={`${name} thumbnail`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 160px"
                />
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 flex-col justify-between py-1">
                {/* TITLE & PRICE */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-ink text-xl font-bold">{name}</h3>

                        {item.hasColor && (
                            <span className="block text-ink text-sm font-normal">
                                | ({isRtl ? item.colorNameAr : item.colorNameEn}
                                )
                            </span>
                        )}

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                            <p className="text-primary font-semibold text-lg">
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

                    {/* DELETE */}
                    <button
                        type="button"
                        className="text-slate-400 hover:text-primary transition-colors cursor-pointer p-2"
                        onClick={() => dispatch(remove(item.id))}
                        aria-label={t("removeItem")}
                    >
                        <Trash2 />
                    </button>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-3 bg-rose/10 rounded-lg p-1 border border-gold/20 w-fit mt-4">
                    <button
                        type="button"
                        className={`${QTY_BUTTON_BASE} ${
                            isMinQuantity
                                ? QTY_BUTTON_DISABLED
                                : QTY_BUTTON_ENABLED
                        }`}
                        onClick={() => dispatch(decrease(item.id))}
                        disabled={isMinQuantity}
                        aria-label={t("decreaseQuantity")}
                    >
                        <Minus size={22} />
                    </button>

                    <span className="text-ink font-bold w-4 text-center">
                        {item.quantity}
                    </span>

                    <button
                        type="button"
                        className={`${QTY_BUTTON_BASE} ${
                            isMaxQuantity
                                ? QTY_BUTTON_DISABLED
                                : QTY_BUTTON_ENABLED
                        }`}
                        onClick={() => dispatch(increase(item.id))}
                        disabled={isMaxQuantity}
                        aria-label={t("increaseQuantity")}
                    >
                        <Plus size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
});

CartItem.displayName = "CartItem";

export default CartItem;
