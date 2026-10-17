"use client";

import { useTranslations, useLocale } from "next-intl";
import { CheckCircle } from "lucide-react";
import { useFormatNumber } from "@/hooks/useFormatNumber";
import { getUnitPrice } from "@/utils/price";

export default function ReviewStep({
    form,
    cartItems,
    selectedCity,
    couponCode,
    subtotal,
    deliveryPrice,
    total,
    onCouponChange,
}) {
    const t = useTranslations("checkout");
    const isRtl = useLocale() === "ar";
    const { formatPrice } = useFormatNumber();

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="text-primary" />
                <h2 className="text-ink text-2xl font-bold">
                    {t("reviewOrder")}
                </h2>
            </div>

            {/* SHIPPING SUMMARY */}
            <div className="mb-6 p-4 rounded-xl bg-rose/10 border border-gold/20 space-y-1">
                <p className="text-ink text-sm font-semibold">{t("shipTo")}</p>
                <p className="text-slate-600 text-sm">{form.fullName}</p>
                <p className="text-slate-600 text-sm" dir="ltr">
                    {form.phone}
                </p>
                <p className="text-slate-600 text-sm">{selectedCity}</p>
                <p className="text-slate-500 text-sm">{form.address}</p>
            </div>

            {/* ITEMS */}
            <div className="flex flex-col gap-4 mb-6">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center border-b border-gold/10 pb-3"
                    >
                        <div>
                            <p className="text-ink font-semibold">
                                {isRtl ? item.nameAr : item.nameEn}
                            </p>
                            <p className="text-slate-500 text-sm">
                                {t("qty")}: {item.quantity}
                            </p>
                        </div>
                        <p className="text-ink font-semibold">
                            {formatPrice(getUnitPrice(item) * item.quantity)}
                        </p>
                    </div>
                ))}
            </div>

            {/* COUPON */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-ink mb-2">
                    {t("couponLabel")}
                </label>
                <input
                    dir="ltr"
                    autoComplete="off"
                    value={form.couponCode}
                    onChange={(e) => onCouponChange(e.target.value)}
                    placeholder={t("couponPlaceholder")}
                    className="w-full rounded-xl border border-gold/20 p-4 text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <p className="text-slate-500 text-xs mt-2">
                    {t("couponOfferNote")}
                </p>
                {couponCode && (
                    <p className="text-primary text-xs mt-1">
                        {t("couponDiscountNote")}
                    </p>
                )}
            </div>

            {/* TOTALS */}
            <div className="flex justify-between text-slate-600 mb-1">
                <span>{t("subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 mb-3">
                <span>{t("delivery")}</span>
                <span>{formatPrice(deliveryPrice)}</span>
            </div>
            <div className="flex justify-between text-ink text-xl font-extrabold pt-3 border-t border-gold/20">
                <span>{t("total")}</span>
                <span>{formatPrice(total)}</span>
            </div>
        </div>
    );
}
