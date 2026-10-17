"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";

export function useFormatNumber() {
    const locale = useLocale();

    const formatter = useMemo(
        () => new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US"),
        [locale],
    );

    // 1,250 | ١٬٢٥٠
    const formatNumber = (value) => {
        if (value == null || Number.isNaN(Number(value))) return "";
        return formatter.format(Number(value));
    };

    // EGP 1,250 | ١٬٢٥٠ ج.م
    const formatPrice = (value) => {
        const num = formatNumber(value);
        return locale === "ar" ? `${num} ج.م` : `EGP ${num}`;
    };

    return { formatNumber, formatPrice };
}
