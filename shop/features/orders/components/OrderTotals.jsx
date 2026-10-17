"use client";

import { useTranslations } from "next-intl";
import { useFormatNumber } from "@/hooks/useFormatNumber";

export default function OrderTotals({ order }) {
    const t = useTranslations("orders");
    const { formatPrice } = useFormatNumber();

    const subtotal =
        order.subtotal ??
        Number(order.totalPrice) -
            Number(order.deliveryPrice ?? 0) +
            Number(order.discountAmount ?? 0);

    const hasDiscount = Number(order.discountAmount ?? 0) > 0;

    return (
        <div className="pt-4 space-y-1">
            <div className="flex justify-between text-slate-600 text-sm">
                <span>{t("subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-sm">
                <span>{t("delivery")}</span>
                <span>{formatPrice(order.deliveryPrice)}</span>
            </div>
            {hasDiscount && (
                <div className="flex justify-between text-green-600 text-sm">
                    <span>{t("discount")}</span>
                    <span>- {formatPrice(order.discountAmount)}</span>
                </div>
            )}
            <div className="flex justify-between text-ink text-lg font-extrabold pt-2 border-t border-gold/10">
                <span>{t("total")}</span>
                <span>{formatPrice(order.totalPrice)}</span>
            </div>
        </div>
    );
}
