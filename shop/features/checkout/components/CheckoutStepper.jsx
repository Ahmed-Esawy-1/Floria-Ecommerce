"use client";

import { useTranslations } from "next-intl";
import { STEPS } from "../constants";

export default function CheckoutStepper({ stepIndex }) {
    const t = useTranslations("checkout");

    return (
        <div className="flex items-center justify-center gap-4 mb-10">
            {STEPS.map((s, i) => {
                const active = i <= stepIndex;
                return (
                    <div key={s} className="flex items-center gap-4">
                        <div
                            className={`flex items-center gap-2 ${
                                active ? "text-primary" : "text-slate-300"
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                                    active
                                        ? "bg-primary text-white border-primary"
                                        : "border-slate-200"
                                }`}
                            >
                                {i + 1}
                            </div>
                            <span className="text-sm font-semibold hidden sm:inline">
                                {t(`steps.${s}`)}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className="w-8 h-px bg-gold/30" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
