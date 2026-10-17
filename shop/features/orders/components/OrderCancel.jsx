"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCancelOrderMutation } from "@/lib/api/ordersApi";

export default function OrderCancel({ orderId }) {
    const t = useTranslations("orders");
    const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState(null);

    const handleCancel = async () => {
        setError(null);
        try {
            await cancelOrder(orderId).unwrap();
        } catch {
            setError(t("cancelFailed"));
        } finally {
            setConfirming(false);
        }
    };

    return (
        <>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                {!confirming ? (
                    <button
                        type="button"
                        onClick={() => setConfirming(true)}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all"
                    >
                        {t("cancel")}
                    </button>
                ) : (
                    <>
                        <span className="text-sm text-slate-600">
                            {t("cancelConfirm")}
                        </span>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="px-5 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition-all"
                        >
                            {cancelling ? t("cancelling") : t("cancelYes")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setConfirming(false)}
                            disabled={cancelling}
                            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            {t("cancelNo")}
                        </button>
                    </>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-3 text-end">{error}</p>
            )}
        </>
    );
}
