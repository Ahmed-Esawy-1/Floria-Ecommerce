"use client";

import { useTranslations } from "next-intl";
import { Banknote } from "lucide-react";
import { useFormatNumber } from "@/hooks/useFormatNumber";
import { PAYMENT_METHODS } from "../constants";

export default function PaymentStep({
    paymentMethod,
    paymentNotice,
    onSelect,
    total,
    couponCode,
}) {
    const t = useTranslations("checkout");
    const { formatPrice } = useFormatNumber();

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Banknote className="text-primary" />
                <h2 className="text-ink text-2xl font-bold">
                    {t("choosePayment")}
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method) => {
                    const { value, labelKey, icon: Icon, available } = method;
                    const selected = paymentMethod === value;

                    return (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={selected}
                            aria-disabled={!available}
                            onClick={() => onSelect(method)}
                            className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                                !available
                                    ? "border-gold/10 opacity-50 cursor-not-allowed"
                                    : selected
                                      ? "border-primary bg-primary/5 cursor-pointer"
                                      : "border-gold/20 hover:border-primary/40 cursor-pointer"
                            }`}
                        >
                            <Icon
                                className={
                                    selected ? "text-primary" : "text-slate-400"
                                }
                            />
                            <span className="text-ink font-semibold text-sm">
                                {t(`paymentMethods.${labelKey}`)}
                            </span>
                            {!available && (
                                <span className="text-xs text-slate-500">
                                    {t("notAvailable")}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {paymentNotice && (
                <p className="text-amber-600 text-sm mt-4 text-center">
                    {paymentNotice}
                </p>
            )}

            <div className="flex justify-between text-ink text-lg font-extrabold mt-6 pt-4 border-t border-gold/20">
                <span>{t("total")}</span>
                <span>{formatPrice(total)}</span>
            </div>

            {couponCode && (
                <p className="text-slate-500 text-xs mt-2">
                    {t("couponApplied")}:{" "}
                    <span dir="ltr" className="font-semibold">
                        {couponCode}
                    </span>
                    {" — "}
                    {t("couponDiscountNote")}
                </p>
            )}
        </div>
    );
}
