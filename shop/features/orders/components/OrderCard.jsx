"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import OrderItems from "./OrderItems";
import OrderTotals from "./OrderTotals";
import OrderCancel from "./OrderCancel";
import { CANCELLABLE_STATUSES } from "../constants";

export default function OrderCard({ order }) {
    const t = useTranslations("orders");
    const isRtl = useLocale() === "ar";

    const date = new Date(order.createdAt).toLocaleDateString(
        isRtl ? "ar-EG" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
    );

    const canCancel =
        order.canCancel ?? CANCELLABLE_STATUSES.includes(order.status);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gold/10">
                <div>
                    <p className="text-slate-500 text-xs mb-1">
                        {t("orderNumber")}
                    </p>
                    <p
                        dir="ltr"
                        className="text-ink font-extrabold tracking-wider"
                    >
                        {order.orderId}
                    </p>
                </div>
                <div className="text-end">
                    <p className="text-slate-500 text-xs mb-1">{date}</p>
                    <StatusBadge status={order.status} />
                </div>
            </div>

            <OrderItems items={order.items} />

            <div className="py-4 border-b border-gold/10 space-y-1 text-sm">
                <p className="flex items-start gap-2 text-slate-600">
                    <MapPin
                        size={16}
                        className="text-primary mt-0.5 shrink-0"
                    />
                    <span>
                        {isRtl ? order.cityNameAr : order.cityNameEn}
                        {" — "}
                        {order.shippingAddress}
                    </span>
                </p>
                <p className="text-slate-500">
                    {t("payment")}:{" "}
                    <span className="text-ink font-semibold">
                        {t(`paymentMethods.${order.paymentMethod}`)}
                    </span>
                </p>
            </div>

            <OrderTotals order={order} />

            {canCancel && <OrderCancel orderId={order.orderId} />}
        </div>
    );
}
