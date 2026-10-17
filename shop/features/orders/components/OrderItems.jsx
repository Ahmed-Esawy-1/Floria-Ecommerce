"use client";

import { useTranslations, useLocale } from "next-intl";
import { useFormatNumber } from "@/hooks/useFormatNumber";

export default function OrderItems({ items = [] }) {
    const t = useTranslations("orders");
    const isRtl = useLocale() === "ar";
    const { formatPrice } = useFormatNumber();

    return (
        <div className="flex flex-col gap-3 py-4 border-b border-gold/10">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex justify-between items-center gap-4"
                >
                    <div>
                        <p className="text-ink font-semibold">
                            {isRtl ? item.productNameAr : item.productNameEn}
                            {item.hasOffer && (
                                <span className="ms-2 text-xs font-bold text-primary">
                                    {t("offer")}
                                </span>
                            )}
                        </p>
                        <p className="text-slate-500 text-sm">
                            {t("qty")}: {item.quantity}
                        </p>
                    </div>
                    <p className="text-ink font-semibold">
                        {formatPrice(item.totalPrice)}
                    </p>
                </div>
            ))}
        </div>
    );
}
