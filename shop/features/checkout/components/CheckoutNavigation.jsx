"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { STEPS } from "../constants";

export default function CheckoutNavigation({
    stepIndex,
    step,
    canGoNext,
    isLoading,
    paymentMethod,
    onBack,
    onNext,
    onPlace,
}) {
    const t = useTranslations("checkout");
    const isLast = step === STEPS[STEPS.length - 1];

    return (
        <div className="flex justify-between mt-8 pt-6 border-t border-gold/10">
            <button
                type="button"
                onClick={onBack}
                disabled={stepIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-500 disabled:opacity-0 hover:bg-slate-50 transition-all"
            >
                <ArrowLeft fontSize="small" className="rtl:rotate-180" />
                {t("back")}
            </button>

            {!isLast ? (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold py-3 px-8 rounded-xl transition-all"
                >
                    {t("next")}
                    <ArrowRight fontSize="small" className="rtl:rotate-180" />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onPlace}
                    disabled={!paymentMethod || isLoading}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold py-3 px-8 rounded-xl transition-all"
                >
                    {isLoading ? t("placingOrder") : t("placeOrder")}
                </button>
            )}
        </div>
    );
}
