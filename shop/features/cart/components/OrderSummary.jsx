"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, Lock, CreditCard, Banknote, Wallet } from "lucide-react";
import { useFormatNumber } from "@/hooks/useFormatNumber";

const CHECKOUT_BUTTON_BASE =
    "w-full font-bold py-4 px-6 rounded-xl mt-8 transition-all flex items-center justify-center gap-2";

export default function OrderSummary({ subtotal, checkoutDisabled = false }) {
    const t = useTranslations("cart");
    const { formatPrice } = useFormatNumber();

    return (
        <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-gold/20 shadow-lg sticky top-28">
                <h2 className="text-ink text-2xl font-bold mb-6">
                    {t("orderSummary")}
                </h2>

                {/* PRICE BREAKDOWN */}
                <div className="flex flex-col gap-4 text-slate-600">
                    <div className="flex justify-between items-center text-ink text-xl font-extrabold">
                        <span>{t("subtotal")}</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="h-px bg-gold/20 my-2" />
                    <div className="flex justify-between items-center">
                        <span>{t("delivery")}</span>
                        <span className="text-sm text-slate-500">
                            {t("calculatedAtCheckout")}
                        </span>
                    </div>
                </div>

                {/* CHECKOUT */}
                {checkoutDisabled ? (
                    <button
                        type="button"
                        disabled
                        className={`${CHECKOUT_BUTTON_BASE} bg-primary text-white opacity-40 cursor-not-allowed`}
                    >
                        <span>{t("checkout")}</span>
                        <ArrowRight className="rtl:rotate-180" />
                    </button>
                ) : (
                    <Link
                        href="/checkout"
                        className={`${CHECKOUT_BUTTON_BASE} bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 active:scale-95`}
                    >
                        <span>{t("checkout")}</span>
                        <ArrowRight className="rtl:rotate-180" />
                    </Link>
                )}

                {/* SECURITY */}
                <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                        <Lock size={18} />
                        <span>{t("securePayment")}</span>
                    </div>
                    <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                        <CreditCard />
                        <Banknote />
                        <Wallet />
                    </div>
                </div>
            </div>
        </div>
    );
}
