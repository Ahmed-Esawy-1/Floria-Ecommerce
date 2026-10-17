"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function ConfirmationView() {
    const t = useTranslations("confirmation");
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        if (!orderId) router.replace("/");
    }, [orderId, router]);

    if (!orderId) return null;

    return (
        <div className="flex-1 px-6 md:px-20 py-16 bg-marble-light">
            <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl border border-gold/15 shadow-sm text-center">
                <CheckCircle className="text-primary mx-auto mb-6" size={64} />

                <h1 className="text-ink text-3xl font-bold mb-3">
                    {t("title")}
                </h1>
                <p className="text-slate-500 mb-8">{t("description")}</p>

                <div className="mb-8 p-4 rounded-xl bg-rose/10 border border-gold/20">
                    <p className="text-slate-500 text-sm mb-1">
                        {t("orderNumber")}
                    </p>
                    <p
                        dir="ltr"
                        className="text-ink text-xl font-extrabold tracking-wider"
                    >
                        {orderId}
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all"
                >
                    <span>{t("continueShopping")}</span>
                    <ArrowRight className="rtl:rotate-180" />
                </Link>
            </div>
        </div>
    );
}
