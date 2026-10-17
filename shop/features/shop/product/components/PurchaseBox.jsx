"use client";

import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";

import { add } from "@/features/cart/cartSlice";
import { useFormatNumber } from "@/hooks/useFormatNumber";
import { getPriceInfo } from "@/utils/price";

export default function PurchaseBox({ product, selectedColor }) {
    const t = useTranslations("product");
    const dispatch = useDispatch();
    const { formatPrice } = useFormatNumber();

    const { finalPrice, oldPrice, discountPercent, hasDiscount } = getPriceInfo(
        product.price,
        product.priceAfterDiscount,
    );

    // ---- ADD To CART --------------------------------------------------
    const handleAddToCart = () =>
        dispatch(
            add({
                id: product.id,
                nameEn: product.nameEn,
                nameAr: product.nameAr,
                price: product.price,
                priceAfterDiscount: product.priceAfterDiscount,
                imageUrl: product.primaryImageUrl,
                hasColor: product.hasColor,
                quantity: product.quantity,
                colorNameEn: selectedColor?.nameEn,
                colorNameAr: selectedColor?.nameAr,
            }),
        );

    // ---- RENDER -------------------------------------------------------

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* PRICE */}
            <div className="flex-1 p-6 border border-gold/20 rounded-xl bg-marble/50 flex flex-col justify-center">
                <span className="text-xs text-slate-400 uppercase tracking-tighter">
                    {t("priceIncludesVat")}
                </span>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-3xl font-bold text-primary">
                        {formatPrice(finalPrice)}
                    </span>

                    {/* Old price + badge only when there is a discount */}
                    {hasDiscount && (
                        <>
                            <span className="text-slate-400 text-base line-through">
                                {formatPrice(oldPrice)}
                            </span>
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                                -{discountPercent}%
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* ADD TO CART */}
            <button
                type="button"
                onClick={handleAddToCart}
                className="flex-[1.5] bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 py-4 sm:py-0"
            >
                <Plus />
                {t("addToCart")}
            </button>
        </div>
    );
}
